# Exercise the released app through its Windows accessibility controls.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName UIAutomationClient, UIAutomationTypes, System.Windows.Forms
$uia = [System.Windows.Automation.AutomationElement]
$scope = [System.Windows.Automation.TreeScope]::Descendants

function Get-Control([string]$name, [string]$type, [switch]$contains) {
    $terms = @()
    if ($type) {
        $terms += [System.Windows.Automation.PropertyCondition]::new(
            $uia::ControlTypeProperty, [System.Windows.Automation.ControlType]::$type)
    }
    if (!$contains) {
        $terms += [System.Windows.Automation.PropertyCondition]::new($uia::NameProperty, $name)
    }
    $condition = if ($terms.Count -eq 1) { $terms[0] } else {
        [System.Windows.Automation.AndCondition]::new($terms[0], $terms[1])
    }
    $until = (Get-Date).AddSeconds(50)
    do {
        if ($contains) {
            $found = $window.FindAll($scope, $condition) | Where-Object { $_.Current.Name.Contains($name) } | Select-Object -First 1
        } else {
            $found = $window.FindFirst($scope, $condition)
        }
        if ($found -and $found.Current.IsEnabled) { return $found }
        Start-Sleep -Milliseconds 350
    } while ((Get-Date) -lt $until)
    throw "Windows did not expose '$name' ($type)."
}

function Open-Control($element) {
    $element.GetCurrentPattern([System.Windows.Automation.InvokePattern]::Pattern).Invoke()
}

function Search-Library([string]$name, [string]$value) {
    $field = Get-Control $name 'Edit'
    $field.SetFocus()
    [System.Windows.Forms.SendKeys]::SendWait('^a')
    [System.Windows.Forms.SendKeys]::SendWait($value)
}

# Published titles and revision also serve as an independent check of the saved course.
$envelope = Invoke-RestMethod 'https://raw.githubusercontent.com/Aziliz/erudior/published-courses/v1/catalog.signed.json'
$catalog = $envelope.text | ConvertFrom-Json
$program = $catalog.stagedPrograms | Where-Object id -eq 'automotive-mechanics-custom-construction'
$courseId = $program.stages[0].courses[0].courseId
$course = $catalog.courses | Where-Object id -eq $courseId
$lesson = $course.outline[0].lessons[0]
if (!$program.title -or !$lesson) { throw 'Published automotive pathway or first lesson missing' }
$saved = Join-Path $env:APPDATA "com.erudior.app/courses/$courseId.json"
if (Test-Path $saved) { throw 'Expected a clean install' }
$env:WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS = '--force-renderer-accessibility'
$app = Start-Process $env:ERUDIOR_TEST_EXE -PassThru
try {
    $until = (Get-Date).AddSeconds(60)
    do {
        $app.Refresh()
        if ($app.HasExited) { throw "Erudior exited with code $($app.ExitCode)" }
        if ($app.MainWindowHandle -ne 0) { break }
        Start-Sleep -Milliseconds 300
    } while ((Get-Date) -lt $until)
    if ($app.MainWindowHandle -eq 0) { throw 'Installed Erudior did not create a window' }
    $window = $uia::FromHandle($app.MainWindowHandle)
    Write-Host "Opened native window: $($window.Current.Name)"
    Open-Control (Get-Control 'Refresh catalog' 'Button')
    Search-Library 'Search programs' $program.title
    $null = Get-Control $program.title $null
    $null = Get-Control 'Explore pathway' 'Button'
    Write-Host "Found signed program: $($program.title)"
    Search-Library 'Search courses' $course.title
    Open-Control (Get-Control $course.title 'Button' -contains)
    Open-Control (Get-Control 'Start course' 'Button')
    Open-Control (Get-Control 'Lessons' 'Button')
    Open-Control (Get-Control $lesson 'Button' -contains)
    $null = Get-Control $lesson $null
    $null = Get-Control 'Take the quiz' 'Button'
    $installed = Get-Content -Raw -Encoding UTF8 $saved | ConvertFrom-Json
    if ($installed.id -ne $courseId -or $installed.revision -ne $course.revision) { throw 'Saved course differs from the live release' }
    Write-Host "Opened $courseId revision $($installed.revision) and its lesson '$lesson' in the installed Windows app."
} catch {
    if ($window) {
        Write-Host 'Named controls on the current app screen:'
        $window.FindAll($scope, [System.Windows.Automation.Condition]::TrueCondition) |
            Where-Object { $_.Current.Name } | Select-Object -First 70 |
            ForEach-Object { Write-Host "$($_.Current.ControlType.ProgrammaticName) $($_.Current.Name)" }
    }
    throw
} finally {
    if (!$app.HasExited) { Stop-Process -Id $app.Id }
}
