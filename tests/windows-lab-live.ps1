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

# A separately registered Debian can hold existing disks under its own default account.
$existing = 'Erudior-QA-existing'
if ($before.hosts.name -contains $existing) { throw 'Existing-host fixture name is already taken.' }
$archive = Join-Path $env:RUNNER_TEMP 'erudior-qa-debian.tar'
$folder = Join-Path $env:RUNNER_TEMP 'erudior-qa-existing'
& wsl.exe --export $setup.distribution $archive
if ($LASTEXITCODE -ne 0) { throw 'Could not export the disposable fixture.' }
& wsl.exe --import $existing $folder $archive --version 2
if ($LASTEXITCODE -ne 0) { throw 'Could not register an existing-host fixture under a custom name.' }
& wsl.exe --manage $existing --set-default-user erudior-lab
if ($LASTEXITCODE -ne 0) { throw 'Could not select the fixture user.' }
& wsl.exe -d $existing --cd '~' --exec touch erudior-prior-work
if ($LASTEXITCODE -ne 0) { throw 'Could not stage prior work.' }
$reused = Run-HostAction 'setup' $existing
if ($reused.managed -or $reused.distribution -ne $existing -or $reused.state -ne 'ready') {
    throw 'The selected existing host was not reused.'
}
& wsl.exe -d $existing --cd '~' --exec test -f erudior-prior-work
if ($LASTEXITCODE -ne 0 -or !(Run-HostAction 'list' $existing).ready) { throw 'Could not resume the original user and files.' }
Write-Host 'Verified reuse of a custom WSL distribution with its original Linux account and files.'
