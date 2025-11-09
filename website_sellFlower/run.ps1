# Quick script to run Spring Boot application
# This sets JAVA_HOME for the current session and runs the app

$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.12.7-hotspot"
Write-Host "JAVA_HOME set to: $env:JAVA_HOME" -ForegroundColor Green
Write-Host "Starting Spring Boot application..." -ForegroundColor Cyan
./mvnw spring-boot:run

