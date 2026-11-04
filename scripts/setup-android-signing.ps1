# Run locally in PowerShell, on a trusted machine with Java keytool and GitHub CLI installed.
# This script does not create or store passwords in the repository.
param([string]$KeystorePath = "$HOME\erudior-android-release.jks")
$ErrorActionPreference = "Stop"
if (-not (Get-Command keytool -ErrorAction SilentlyContinue)) { throw "keytool is required (install JDK)." }
if (-not (Get-Command gh -ErrorAction SilentlyContinue)) { throw "GitHub CLI (gh) is required." }
gh auth status | Out-Null
if ($LASTEXITCODE -ne 0) { throw "Run gh auth login first." }
if (Test-Path -LiteralPath $KeystorePath) {
    throw "Keystore already exists at $KeystorePath. Do not overwrite a release identity."
}
$parent = Split-Path -Parent $KeystorePath
if (-not (Test-Path -LiteralPath $parent)) { New-Item -ItemType Directory -Path $parent -Force | Out-Null }
Write-Host "Generating permanent Erudior Android signing identity: $KeystorePath"
Write-Host "Keytool will prompt for a password. Record it securely, along with the keystore backup."
& keytool -genkeypair -keystore $KeystorePath -storetype PKCS12 -alias erudior-android -keyalg RSA -keysize 3072 -validity 10000 -dname "CN=Erudior Android Release"
if ($LASTEXITCODE -ne 0) { throw "keytool failed; no GitHub secrets changed." }
$pwd = Read-Host "Enter the keystore password again (not displayed)" -AsSecureString
$plain = [System.Net.NetworkCredential]::new("", $pwd).Password
try {
    [Convert]::ToBase64String([System.IO.File]::ReadAllBytes($KeystorePath)) | gh secret set ANDROID_KEYSTORE_B64 -R Aziliz/erudior
    if ($LASTEXITCODE -ne 0) { throw "Failed to upload keystore secret" }
    $plain | gh secret set ANDROID_KEYSTORE_PASSWORD -R Aziliz/erudior
    if ($LASTEXITCODE -ne 0) { throw "Failed to upload keystore password" }
    "erudior-android" | gh secret set ANDROID_KEY_ALIAS -R Aziliz/erudior
    if ($LASTEXITCODE -ne 0) { throw "Failed to upload key alias" }
    # PKCS12 generated with keytool uses the same key password as the store password.
    $plain | gh secret set ANDROID_KEY_PASSWORD -R Aziliz/erudior
    if ($LASTEXITCODE -ne 0) { throw "Failed to upload key password" }
} finally {
    $plain = $null
    $pwd.Dispose()
}
Write-Host "Secrets configured. BACK UP $KeystorePath in an encrypted location before publishing."
Write-Host "Do not share the keystore or its password in chat or commit them to Git."
Write-Host "Next: Actions > Android APK (development) > Run workflow on main > publish_preview."
