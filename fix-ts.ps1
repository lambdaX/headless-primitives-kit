# Fix imports in use-headless-component.ts to use relative paths
# Run this from your project root directory

$hookFile = "src/hooks/use-headless-component.ts"

if (Test-Path $hookFile) {
    Write-Host "Processing: $hookFile" -ForegroundColor Cyan
    
    # Read the file content
    $content = Get-Content $hookFile -Raw
    
    # Replace the @ imports with relative imports
    $content = $content -replace "@/components/headless-logic/", "../components/headless-logic/"
    
    # Write back to file
    Set-Content -Path $hookFile -Value $content
    
    Write-Host "Updated imports in $hookFile" -ForegroundColor Green
    Write-Host "Changed '@/components/headless-logic/' to '../components/headless-logic/'" -ForegroundColor Yellow
} else {
    Write-Host "File not found: $hookFile" -ForegroundColor Red
}

Write-Host "Done! Hook imports have been fixed." -ForegroundColor Green