# MongoDB Installation Helper for Windows (PowerShell)
# Usage: powershell -ExecutionPolicy Bypass -File setup-mongodb.ps1

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "    MongoDB Setup for AIRHOP Project" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Check if MongoDB is installed
$mongoCheck = Get-Command mongod -ErrorAction SilentlyContinue

if ($null -eq $mongoCheck) {
    Write-Host "[!] MongoDB is not installed`n" -ForegroundColor Red
    Write-Host "Choose an option:" -ForegroundColor Yellow
    Write-Host "1. Download MongoDB Community Edition"
    Write-Host "2. Use Docker to run MongoDB (requires Docker Desktop)"
    Write-Host "3. Manual setup instructions"
    Write-Host "4. Exit"
    Write-Host ""
    
    $choice = Read-Host "Enter your choice (1-4)"
    
    switch ($choice) {
        "1" {
            Write-Host "`n[*] Opening MongoDB download page..." -ForegroundColor Cyan
            Start-Process "https://www.mongodb.com/try/download/community"
            Write-Host "`n[*] Download the .msi file for Windows" -ForegroundColor Cyan
            Write-Host "[*] Run the installer and check: 'Install MongoDB as a Service'" -ForegroundColor Cyan
            Write-Host "[*] Then restart your backend server`n" -ForegroundColor Cyan
            Read-Host "Press Enter when installation is complete"
        }
        "2" {
            Write-Host "`n[*] Checking for Docker..." -ForegroundColor Cyan
            $docker = Get-Command docker -ErrorAction SilentlyContinue
            
            if ($null -eq $docker) {
                Write-Host "[!] Docker is not installed`n" -ForegroundColor Red
                Write-Host "[*] Download Docker Desktop: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
                Read-Host "`nPress Enter to exit"
            }
            else {
                Write-Host "[+] Docker found!`n" -ForegroundColor Green
                Write-Host "[*] Starting MongoDB container on port 27017..." -ForegroundColor Cyan
                
                # Check if container already exists
                $containerExists = docker ps -a --filter "name=airhop-mongo" --quiet
                
                if ($containerExists) {
                    Write-Host "[*] Removing old container..." -ForegroundColor Yellow
                    docker stop airhop-mongo -ErrorAction SilentlyContinue
                    docker rm airhop-mongo -ErrorAction SilentlyContinue
                }
                
                # Start new container
                docker run -d -p 27017:27017 --name airhop-mongo mongo:latest
                
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "[+] MongoDB container started successfully!`n" -ForegroundColor Green
                    Write-Host "MongoDB is now running on: mongodb://localhost:27017/airhop" -ForegroundColor Green
                    Write-Host "`n[*] Now restart your backend server:`n" -ForegroundColor Cyan
                    Write-Host "    cd E:\Airhop-project-main\backend" -ForegroundColor White
                    Write-Host "    node server.js`n" -ForegroundColor White
                }
                else {
                    Write-Host "[!] Failed to start Docker container" -ForegroundColor Red
                }
            }
        }
        "3" {
            Write-Host "`n" -ForegroundColor Cyan
            Write-Host "=== Manual MongoDB Setup Steps ===" -ForegroundColor Cyan
            Write-Host ""
            Write-Host "Option A: MongoDB Community Edition (Recommended)"
            Write-Host "1. Visit: https://www.mongodb.com/try/download/community"
            Write-Host "2. Download the .msi installer for Windows"
            Write-Host "3. Run the installer (Choose Complete installation)"
            Write-Host "4. Check 'Install MongoDB as a Service'"
            Write-Host "5. Let it install (takes ~2 minutes)"
            Write-Host "6. MongoDB will auto-start as a Windows Service"
            Write-Host ""
            Write-Host "Option B: MongoDB with Docker"
            Write-Host "1. Install Docker Desktop: https://www.docker.com/products/docker-desktop"
            Write-Host "2. Open PowerShell and run:"
            Write-Host "   docker run -d -p 27017:27017 --name airhop-mongo mongo:latest"
            Write-Host "3. MongoDB starts automatically"
            Write-Host ""
            Write-Host "After setup, restart the backend server:"
            Write-Host "   cd E:\Airhop-project-main\backend"
            Write-Host "   node server.js"
            Write-Host ""
            Read-Host "Press Enter to exit"
        }
        default {
            Write-Host "`nExiting..." -ForegroundColor Yellow
            exit 1
        }
    }
}
else {
    Write-Host "[+] MongoDB is installed!`n" -ForegroundColor Green
    Write-Host "MongoDB version:" -ForegroundColor Cyan
    & mongod --version
    
    Write-Host "`n[*] MongoDB service status:" -ForegroundColor Cyan
    Get-Service MongoDB -ErrorAction SilentlyContinue | Select-Object Name, Status
    
    Write-Host "`n[+] Your MongoDB installation is ready!" -ForegroundColor Green
    Write-Host "`n[*] To start the backend server, run:`n" -ForegroundColor Cyan
    Write-Host "    cd E:\Airhop-project-main\backend" -ForegroundColor White
    Write-Host "    node server.js`n" -ForegroundColor White
}

Write-Host "========================================`n" -ForegroundColor Cyan
Read-Host "Press Enter to exit"
