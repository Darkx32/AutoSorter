$outputFilename = "sorts.js"
$outputPath = ".\backend\out"
$mainPath = ".\backend\main.cpp"
$funcToExport = '["_sqrt_cpp"]'

if (-not (Test-Path $outputPath -PathType Container)) {
    New-Item -Path $outputPath -ItemType Directory | Out-Null
}

try {
    em++ $mainPath -s WASM=1 -s MODULARIZE=1 -s EXPORT_ES6=1 -s EXPORTED_FUNCTIONS=$funcToExport -s EXPORTED_RUNTIME_METHODS='["cwrap", "ccall"]' -o "$outputPath\$outputFilename"
    Write-Host "Successfuly compiled backend code." -ForegroundColor Green
} catch {
    Write-Host "Error to compile backend code: $($_.Exception.Message)" -ForegroundColor Red
}