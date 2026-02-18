
$jsonPath = "c:/Users/USER/.gemini/antigravity/brain/555452d0-6151-4522-bf49-b566935fd1c6/backend_swagger_v3.json"
$outputPath = "c:/Users/USER/.gemini/antigravity/brain/555452d0-6151-4522-bf49-b566935fd1c6/swagger_analysis_v3.txt"

try {
    $json = Get-Content -Raw -Path $jsonPath | ConvertFrom-Json
    
    $output = @()
    $output += "Swagger Version: $($json.openapi)"
    
    $paths = $json.paths | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
    
    $output += "`n--- API ENDPOINTS ---"
    foreach ($path in $paths) {
        $methods = $json.paths.$path | Get-Member -MemberType NoteProperty | Select-Object -ExpandProperty Name
        $methodString = $methods -join ", "
        $output += "$path [$methodString]"
    }
    
    $output | Out-File -FilePath $outputPath
    Write-Host "Analysis saved to $outputPath"
} catch {
    Write-Error "Error parsing JSON: $_"
}
