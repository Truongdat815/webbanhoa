# Script to set JAVA_HOME permanently for Windows
# Run this script as Administrator

# Set JAVA_HOME for current user
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Microsoft\jdk-17.0.12.7-hotspot", [EnvironmentVariableTarget]::User)

# Add JAVA_HOME\bin to PATH if not already present
$currentPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
$javaBinPath = "C:\Program Files\Microsoft\jdk-17.0.12.7-hotspot\bin"

if ($currentPath -notlike "*$javaBinPath*") {
    [Environment]::SetEnvironmentVariable("Path", "$currentPath;$javaBinPath", [EnvironmentVariableTarget]::User)
    Write-Host "JAVA_HOME and PATH updated successfully!" -ForegroundColor Green
} else {
    Write-Host "JAVA_HOME already in PATH" -ForegroundColor Yellow
}

Write-Host "JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Cyan
Write-Host "Please restart your terminal/PowerShell for changes to take effect." -ForegroundColor Yellow

