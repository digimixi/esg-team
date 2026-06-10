$envPath = "C:\Users\hence\.gemini\antigravity\scratch\esg-team\.env.local"
$dockerfilePath = "C:\Users\hence\.gemini\antigravity\scratch\esg-team\Dockerfile"

# Extract variables from .env.local safely
$projectIdMatch = Select-String -Path $envPath -Pattern 'NEXT_PUBLIC_SANITY_PROJECT_ID="([^"]+)"'
$datasetMatch = Select-String -Path $envPath -Pattern 'NEXT_PUBLIC_SANITY_DATASET="([^"]+)"'
$writeTokenMatch = Select-String -Path $envPath -Pattern 'SANITY_WRITE_TOKEN="([^"]+)"'
$geminiKeyMatch = Select-String -Path $envPath -Pattern 'GEMINI_API_KEY="([^"]+)"'

if (-not $projectIdMatch -or -not $datasetMatch) {
    Write-Error "Failed to extract required environment variables."
    exit 1
}

$projectId = $projectIdMatch.Matches.Groups[1].Value.Trim()
$dataset = $datasetMatch.Matches.Groups[1].Value.Trim()
$writeToken = $writeTokenMatch.Matches.Groups[1].Value.Trim()
$geminiKey = $geminiKeyMatch.Matches.Groups[1].Value.Trim()

Write-Host "Variables extracted successfully. Updating Dockerfile..."

# Inject into Dockerfile
if (Test-Path $dockerfilePath) {
    $content = Get-Content $dockerfilePath
    $content = $content -replace "^ARG NEXT_PUBLIC_SANITY_PROJECT_ID.*", "ARG NEXT_PUBLIC_SANITY_PROJECT_ID=$projectId"
    $content = $content -replace "^ARG NEXT_PUBLIC_SANITY_DATASET.*", "ARG NEXT_PUBLIC_SANITY_DATASET=$dataset"
    $content | Set-Content $dockerfilePath
}

Write-Host "Deploying to Google Cloud Run..."
# Execute gcloud run deploy
gcloud run deploy esg-team --source C:\Users\hence\.gemini\antigravity\scratch\esg-team --region asia-east1 --allow-unauthenticated --set-env-vars="NEXT_PUBLIC_SANITY_PROJECT_ID=$projectId,NEXT_PUBLIC_SANITY_DATASET=$dataset,SANITY_WRITE_TOKEN=$writeToken,GEMINI_API_KEY=$geminiKey"
