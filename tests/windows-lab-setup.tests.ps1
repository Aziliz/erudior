# Execute the shipping Windows PowerShell functions against a controlled WSL command boundary.
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot '../src-tauri/src/vm_lab/windows_setup.ps1')
$env:ERUDIOR_HOST_SCRIPT = 'fixture'
function Assert-True($Condition, [string]$Message) { if (!$Condition) { throw $Message } }
function Reset-Fixture {
    $script:registry = [ordered]@{}
    $script:calls = [Collections.Generic.List[string]]::new()
    $script:feature = $true
    $script:modern = $true
    $script:failure = $false
    $script:firstVersion = 2
    $script:checkCode = 0
}
function Enable-Wsl {
    $calls.Add('enable Windows features')
    if (!$feature) { return 3010 }
    return 0
}
function Invoke-Wsl([string[]]$Arguments, [string]$InputScript) {
    $cmd = $Arguments -join '|'
    $calls.Add($cmd)
    switch ($Arguments[0]) {
        '--list' {
            $lines = foreach ($name in $registry.Keys) {
                if ($Arguments[1] -eq '--quiet') { $name } else { "  $name    Angehalten    $($registry[$name])" }
            }
            return @{ Code = 0; Text = ($lines -join "`n") }
        }
        '--help' {
            $help = if ($modern) { '            --name <Name>' } else { '  --install' }
            return @{ Code = 0; Text = $help }
        }
        '--status' { return @{ Code = 0; Text = '' } }
        '--update' { $script:modern = $true; return @{ Code = 0; Text = '' } }
        '--install' {
            Assert-True ($cmd -eq '--install|Debian|--name|Erudior-Labs|--no-launch|--web-download') 'Unexpected WSL install options'
            if (!$feature) { return @{ Code = 1; Text = 'WSL_E_WSL_OPTIONAL_COMPONENT_REQUIRED' } }
            $registry[$Managed] = $firstVersion
            return @{ Code = 0; Text = '' }
        }
        '--set-version' {
            Assert-True ($cmd -eq '--set-version|Erudior-Labs|2') 'Only the newly created host may be converted'
            $registry[$Managed] = 2
            return @{ Code = 0; Text = '' }
        }
        '--distribution' {
            Assert-True ($registry.Contains($Arguments[1])) 'An unregistered host was launched'
            if ($Arguments -contains '/bin/sh') {
                Assert-True ($InputScript -eq 'fixture') 'Missing payload'
                if ($Arguments[-1] -eq 'check') { return @{ Code = $checkCode; Text = '' } }
                if ($failure) { return @{ Code = 1; Text = 'package source unavailable' } }
            }
            return @{ Code = 0; Text = '' }
        }
        default { throw "Unexpected WSL command: $cmd" }
    }
}
Reset-Fixture
Assert-True (!(Get-Inventory 'Debian' $false).ready -and $calls.Count -eq 0) 'Missing wsl.exe should offer first-use setup'
Assert-True (!(Get-Inventory 'Debian' $true).ready) 'Missing distro must not launch a lab'
$feature = $false
Assert-True ((Setup-Host $Managed).state -eq 'restart') 'Windows feature restart must be surfaced'
Assert-True (!$registry.Count) 'No distribution should be registered as administrator'
$feature = $true
$firstVersion = 1
$setup = Setup-Host $Managed
Assert-True ($setup.state -eq 'ready' -and $setup.managed -and $setup.distribution -eq $Managed) 'Could not resume setup'
Assert-True ($calls.Contains('--distribution|Erudior-Labs|--user|erudior-lab|--cd|/|--exec|/usr/bin/python3|-V')) 'Probe did not use the dedicated account'
$calls.Clear()
Assert-True ((Get-Inventory $Managed $true).ready) 'Saved host was not reused'
$null = Setup-Host $Managed
Assert-True (!($calls -match '^--install[|]')) 'Repeat setup tried to reinstall the distribution'
Reset-Fixture
$modern = $false
$null = Setup-Host $Managed
Assert-True ($calls.Contains('--update|--web-download')) 'Older WSL must update before named installation'
Reset-Fixture
$custom = 'Debian ' + [char]0x00e9 + '.QA'
$registry['docker-desktop'] = 2
$registry['podman-machine-default'] = 2
$registry['Debian'] = 2
$registry[$custom] = 2
$registry['Old'] = 1
$inv = Get-Inventory 'Debian' $true
Assert-True ($inv.ready -and $inv.hosts.Count -eq 3) 'Inventory changed localized names or included a private container host'
Assert-True ($calls.Contains('--distribution|Debian|--cd|/|--exec|/bin/sh|-s|--|check')) 'Legacy host must keep its Linux default user'
$calls.Clear()
foreach ($name in @('Removed','docker-desktop','Old')) {
    $rejected = $false
    try { $null = Setup-Host $name } catch { $rejected = $true }
    Assert-True $rejected "Invalid host was accepted: $name"
}
Assert-True (!($calls -match '^--distribution[|]|^--install[|]|^--set-version[|]')) 'An ineligible host was modified'
$setup = Setup-Host $custom
Assert-True (!$setup.managed -and $setup.distribution -ceq $custom) 'Selected name was lost'
Assert-True ($calls.Contains("--distribution|$custom|--cd|/|--exec|/usr/bin/python3|-V")) 'Existing host default user was changed'
$failure = $true
$rejected = $false
try { $null = Setup-Host $custom } catch { $rejected = $_.Exception.Message -match 'package source unavailable' }
Assert-True $rejected 'Failed setup must report the error'
$checkCode = 1
Assert-True (!(Get-Inventory $custom $true).ready) 'Broken saved host must offer setup'
Write-Host 'Windows lab registration, restart, WSL update, isolated user, upgrades, inventory and retries passed.'
