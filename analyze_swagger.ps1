
$jsonPath = "c:/Users/USER/.gemini/antigravity/brain/555452d0-6151-4522-bf49-b566935fd1c6/backend_swagger.json"

try {
    $json = Get-Content -Raw -Path $jsonPath | ConvertFrom-Json
    
    Write-Host "Swagger Version: $($json.openapi)"
    
    $paths = $json.paths | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
    
    Write-Host "`n--- API ENDPOINTS ---"
    foreach ($path in $paths) {
        $methods = $json.paths.$path | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
        $methodString = $methods -join ", "
        Write-Host "$path [$methodString]"
    }
} catch {
    Write-Error "Error parsing JSON: $_"
}
