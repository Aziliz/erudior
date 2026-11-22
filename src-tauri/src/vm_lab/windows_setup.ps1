# Only the signed desktop application supplies the action, selection and host script.
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
$Managed = 'Erudior-Labs'

function Invoke-Wsl([string[]]$Arguments, [string]$InputScript) {
    # Windows PowerShell 5 wraps native stderr in ErrorRecord objects.
    $ErrorActionPreference = 'Continue'
    if ($InputScript) {
        $lines = ($InputScript.Replace("`r", '') + "`n# end") | & $Wsl @Arguments 2>&1
    } else {
        $lines = & $Wsl @Arguments 2>&1
    }
    $exitCode = $LASTEXITCODE
    $output = (($lines | ForEach-Object { "$_" }) -join "`n").Replace([string][char]0, '').Trim().TrimStart([char]0xfeff)
    return @{ Code = $exitCode; Text = $output }
}

function Get-Hosts {
    $names = Invoke-Wsl @('--list', '--quiet')
    if ($names.Code -ne 0 -or !$names.Text.Trim()) { return }
    $details = Invoke-Wsl @('--list', '--verbose')
    if ($details.Code -ne 0) {
        # WSL reports an empty registry differently across Windows versions and output modes.
        if ($details.Text -match 'WSL_E_(DEFAULT_)?DISTRO_NOT_FOUND|WSL_E_WSL_OPTIONAL_COMPONENT_REQUIRED') { return }
        throw "Windows could not list its registered WSL versions. $($details.Text)"
    }
    foreach ($line in ($names.Text -split "`n")) {
        $name = $line.Trim()
        if (!$name -or $name -match '^[*-]|[\x00-\x1f]' -or $name -match '^(docker-desktop|podman-machine|rancher-desktop)(-|$)') { continue }
        # Match the registered name literally. The state and headings are localized.
        $pattern = '^\s*\*?\s*' + [regex]::Escape($name) + '\s+.+?\s+([12])\s*$'
        foreach ($row in ($details.Text -split "`n")) {
            if ($row -match $pattern) { [pscustomobject]@{ name = $name; version = [int]$Matches[1] }; break }
        }
    }
}

function Enable-Wsl {
    # Elevate only the Windows feature installation. Distributions belong to the original Windows user.
    $process = Start-Process -FilePath $Wsl -ArgumentList '--install','--no-distribution' -Verb RunAs -Wait -PassThru
    return $process.ExitCode
}

function Enable-MissingWsl {
    # An older Windows image may have no wsl.exe until the features are enabled.
    $dism = Join-Path ([Environment]::SystemDirectory) 'dism.exe'
    $process = Start-Process -FilePath $dism -Verb RunAs -Wait -PassThru -ArgumentList @(
        '/Online','/Enable-Feature','/FeatureName:Microsoft-Windows-Subsystem-Linux',
        '/FeatureName:VirtualMachinePlatform','/All','/NoRestart')
    if ($process.ExitCode -notin @(0,3010,1641)) {
        throw "Windows could not enable the WSL features (exit $($process.ExitCode))."
    }
    return @{ state = 'restart' }
}

function Ensure-Installer {
    $help = Invoke-Wsl @('--help')
    if ($help.Text -match '(?m)^\s*--name[ =<]') { return }
    $enabled = Enable-Wsl
    if ($enabled -in @(3010,1641)) { return 'restart' }
    $updated = Invoke-Wsl @('--update','--web-download')
    if ($updated.Code -in @(3010,1641)) { return 'restart' }
    $help = Invoke-Wsl @('--help')
    if ($help.Text -notmatch '(?m)^\s*--name[ =<]') {
        throw "Windows could not install the WSL update needed for a dedicated lab host. Retry when Windows can reach Microsoft. $($updated.Text)"
    }
}

function Setup-Host([string]$Target) {
    $hostsFound = @(Get-Hosts)
    $selected = $hostsFound | Where-Object name -eq $Target | Select-Object -First 1
    if (!$selected) {
        if ($Target -ne $Managed) { throw 'That distribution is no longer registered. Refresh the host list and choose a WSL 2 distribution.' }
        if ((Ensure-Installer) -eq 'restart') { return @{ state = 'restart' } }
        $installArgs = @('--install','Debian','--name',$Managed,'--no-launch','--web-download')
        $installed = Invoke-Wsl $installArgs
        if ($installed.Code -ne 0 -and $installed.Code -notin @(3010,1641)) {
            $status = Invoke-Wsl @('--status')
            if ($status.Code -ne 0 -or $installed.Text -match 'WSL_E_WSL_OPTIONAL_COMPONENT_REQUIRED|HCS_E_HYPERV_NOT_INSTALLED|0x8007019e|0x80370102|E_ACCESSDENIED|0x80070005|0x800702e4') {
                $enabled = Enable-Wsl
                if ($enabled -in @(3010,1641)) { return @{ state = 'restart' } }
                if ($enabled -ne 0) { throw "Windows could not enable WSL (exit $enabled). Check Windows virtualization support and retry setup." }
                $installed = Invoke-Wsl $installArgs
            }
        }
        if ($installed.Code -in @(3010,1641) -or $installed.Text -match 'WSL_E_WSL_OPTIONAL_COMPONENT_REQUIRED|HCS_E_HYPERV_NOT_INSTALLED|0x8007019e|0x80370102') {
            return @{ state = 'restart' }
        }
        $selected = @(Get-Hosts) | Where-Object name -eq $Managed | Select-Object -First 1
        if (!$selected) {
            if ($installed.Code -eq 0) { return @{ state = 'restart' } }
            throw "Windows could not install the dedicated Debian distribution. Use a current Store version of WSL that supports --name. $($installed.Text)"
        }
        if ($selected.version -eq 1) {
            $converted = Invoke-Wsl @('--set-version',$Managed,'2')
            if ($converted.Code -ne 0) { throw "Windows could not start the new host in WSL 2. $($converted.Text)" }
            $selected = @(Get-Hosts) | Where-Object name -eq $Managed | Select-Object -First 1
        }
    }
    if ($selected.version -ne 2) { throw 'This host uses WSL 1. Choose a WSL 2 host or install a dedicated Debian host.' }
    $isManaged = $selected.name -eq $Managed
    $mode = if ($isManaged) { 'managed' } else { 'existing' }
    $provision = Invoke-Wsl @('--distribution',$selected.name,'--user','root','--cd','/','--exec','/bin/sh','-s','--',$mode) $env:ERUDIOR_HOST_SCRIPT
    if ($provision.Code -ne 0) {
        $detail = $provision.Text
        if ($detail.Length -gt 650) { $detail = $detail.Substring($detail.Length - 650) }
        throw "Could not prepare $($selected.name). $detail"
    }
    $userArgs = if ($isManaged) { @('--user','erudior-lab') } else { @() }
    $probe = Invoke-Wsl (@('--distribution',$selected.name) + $userArgs + @('--cd','/','--exec','/usr/bin/python3','-V'))
    if ($probe.Code -ne 0) { throw "The lab account could not start Python in $($selected.name). Retry setup." }
    return @{ state = 'ready'; distribution = $selected.name; managed = $isManaged }
}

function Get-Inventory([string]$Name, [bool]$Present) {
    $registered = @()
    if ($Present) { $registered = @(Get-Hosts) }
    $ready = $false
    if ($registered | Where-Object { $_.name -eq $Name -and $_.version -eq 2 }) {
        $userArgs = if ($Name -eq $Managed) { @('--user','erudior-lab') } else { @() }
        $check = Invoke-Wsl (@('--distribution',$Name) + $userArgs + @('--cd','/','--exec','/bin/sh','-s','--','check')) $env:ERUDIOR_HOST_SCRIPT
        $ready = $check.Code -eq 0
    }
    return @{ hosts = $registered; ready = $ready }
}

if ($MyInvocation.InvocationName -ne '.') {
    [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding($false)
    $OutputEncoding = [Console]::OutputEncoding
    $env:WSL_UTF8 = '1'
    $Wsl = Join-Path ([Environment]::SystemDirectory) 'wsl.exe'
    try {
        $present = Test-Path -LiteralPath $Wsl
        $result = if ($env:ERUDIOR_HOST_ACTION -eq 'list') {
            Get-Inventory $env:ERUDIOR_HOST_TARGET $present
        } elseif ($env:ERUDIOR_HOST_ACTION -eq 'setup') {
            if ($present) { Setup-Host $env:ERUDIOR_HOST_TARGET } else { Enable-MissingWsl }
        } else { throw 'Unknown Windows lab setup action.' }
        [Console]::Out.WriteLine((ConvertTo-Json -InputObject $result -Compress -Depth 4))
    } catch {
        [Console]::Error.WriteLine($_.Exception.Message)
        exit 1
    }
}
