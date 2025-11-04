@echo off
REM MongoDB Installation Helper for Windows
REM This script helps you install and start MongoDB Community Edition

echo.
echo ========================================
echo    MongoDB Setup for AIRHOP Project
echo ========================================
echo.

REM Check if MongoDB is already installed
mongod --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [!] MongoDB is not installed
    echo.
    echo Choose an option:
    echo 1. Download MongoDB Community Edition installer
    echo 2. Use Docker to run MongoDB
    echo 3. Exit
    echo.
    set /p choice="Enter your choice (1-3): "
    
    if "%choice%"=="1" (
        echo.
        echo [*] Opening MongoDB download page...
        start https://www.mongodb.com/try/download/community
        echo.
        echo [*] Download the .msi file and run the installer
        echo [*] Make sure to check: "Install MongoDB as a Service"
        pause
    ) else if "%choice%"=="2" (
        echo.
        echo [*] Checking for Docker...
        docker --version >nul 2>&1
        if %errorlevel% neq 0 (
            echo [!] Docker is not installed
            echo [*] Download Docker Desktop from: https://www.docker.com/products/docker-desktop
            pause
        ) else (
            echo [+] Docker found!
            echo [*] Starting MongoDB container...
            docker run -d -p 27017:27017 --name airhop-mongo mongo:latest
            echo [+] MongoDB container started on port 27017
            pause
        )
    ) else (
        echo Exiting...
        exit /b 1
    )
) else (
    echo [+] MongoDB is installed!
    mongod --version
    echo.
    echo [*] MongoDB service status:
    sc query MongoDB
    pause
)
