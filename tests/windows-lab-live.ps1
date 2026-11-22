# For a disposable Windows CI machine. Exercise the same Windows PowerShell entry point as the app.
$ErrorActionPreference = 'Stop'
$lab = Join-Path $PSScriptRoot '../src-tauri/src/vm_lab'
$scriptText = [IO.File]::ReadAllText((Resolve-Path "$lab/windows_setup.ps1").Path)
$encoded = [Convert]::ToBase64String([Text.Encoding]::Unicode.GetBytes($scriptText))
$env:ERUDIOR_HOST_SCRIPT = [IO.File]::ReadAllText((Resolve-Path "$lab/windows-host.sh").Path)
function Run-HostAction([string]$Action, [string]$Target) {
    $env:ERUDIOR_HOST_ACTION = $Action
    $env:ERUDIOR_HOST_TARGET = $Target
    $result = & powershell.exe -NoLogo -NoProfile -NonInteractive -EncodedCommand $encoded
    if ($LASTEXITCODE -ne 0) { throw "Desktop host action $Action failed (exit $LASTEXITCODE)." }
    return ($result | ConvertFrom-Json)
}
$env:WSL_UTF8 = '1'
foreach ($switch in @('--version','--status','--list')) {
    & wsl.exe $switch 2>&1 | ForEach-Object { Write-Host "$_" }
    Write-Host "$switch exited with $LASTEXITCODE."
}
$before = Run-HostAction 'list' 'Debian'
if ($before.hosts.name -contains 'Erudior-Labs') { throw 'This test requires a fresh lab host.' }
$setup = Run-HostAction 'setup' 'Erudior-Labs'
if ($setup.state -eq 'restart') {
    'Windows reported that a restart is required. This hosted VM cannot reboot during the job.' |
        Out-File -Append -Encoding utf8 $env:GITHUB_STEP_SUMMARY
    Write-Host 'Host setup reached the Windows restart boundary.'
    return
}
if ($setup.state -ne 'ready' -or !$setup.managed) { throw 'Dedicated host setup did not complete.' }
$after = Run-HostAction 'list' $setup.distribution
if (!$after.ready) { throw 'The app could not rediscover its configured host.' }
$id = & wsl.exe -d $setup.distribution -u erudior-lab --exec id -u
if ($LASTEXITCODE -ne 0 -or [int]$id -le 0) { throw 'Guest tools must use an unprivileged account.' }
$again = Run-HostAction 'setup' $setup.distribution
if ($again.state -ne 'ready') { throw 'Repeat setup failed.' }
'Verified fresh Debian registration, QEMU and ISO tools, a non-root lab account, rediscovery and repeat setup on Windows.' |
    Tee-Object -Variable summary
$summary | Out-File -Append -Encoding utf8 $env:GITHUB_STEP_SUMMARY
