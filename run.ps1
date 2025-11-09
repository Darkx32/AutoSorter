if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "NodeJS is not installed" -ForegroundColor Red
    Write-Host "Install it on 'https://nodejs.org/en/download'" -ForegroundColor Yellow
    exit 1
}
Write-Host "npm is installed" -ForegroundColor Green

if (-not (Get-Command em++ -ErrorAction SilentlyContinue)) {
    Write-Host "Emscription is not installed" -ForegroundColor Red
    Write-Host "Download emscripton following this instructions in website 'https://emscripten.org/docs/getting_started/downloads.html'" -ForegroundColor Yellow
    exit 1
}
Write-Host "Emscription is installed" -ForegroundColor Green

Write-Host "Running compiling script" -ForegroundColor Yellow
& ".\backend\compile.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error to compile. ERROR CODE: $LASTEXITCODE" -ForegroundColor Red
    exit 1
}
Write-Host "Backend was compiled with success!" -ForegroundColor Green

Write-Host "Installing npm packages" -ForegroundColor Yellow
npm install --prefix ".\frontend"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error to install npm packages. ERROR CODE: $LASTEXITCODE" -ForegroundColor Red
    exit 1
}

Write-Host "Running npm to start project" -ForegroundColor Yellow

npm start --prefix ".\frontend"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Error to run npm. ERROR CODE: $LASTEXITCODE" -ForegroundColor Red
    exit 1
}