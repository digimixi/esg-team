$ErrorActionPreference = 'Stop'

# 1. Extract variables from .env.local
$projectId = (Select-String -Path .env.local -Pattern "^NEXT_PUBLIC_SANITY_PROJECT_ID=(.*)").Matches.Groups[1].Value.Trim()
$dataset = (Select-String -Path .env.local -Pattern "^NEXT_PUBLIC_SANITY_DATASET=(.*)").Matches.Groups[1].Value.Trim()
$writeToken = (Select-String -Path .env.local -Pattern "^SANITY_WRITE_TOKEN=(.*)").Matches.Groups[1].Value.Trim()
$geminiKey = (Select-String -Path .env.local -Pattern "^GEMINI_API_KEY=(.*)").Matches.Groups[1].Value.Trim()

if (-not $projectId -or -not $dataset) {
    Write-Error "Could not extract PROJECT_ID or DATASET from .env.local"
    exit 1
}

# 2. Inject into Dockerfile
(Get-Content Dockerfile) -replace "ARG NEXT_PUBLIC_SANITY_PROJECT_ID.*", "ARG NEXT_PUBLIC_SANITY_PROJECT_ID=$projectId" -replace "ARG NEXT_PUBLIC_SANITY_DATASET.*", "ARG NEXT_PUBLIC_SANITY_DATASET=$dataset" | Set-Content Dockerfile

Write-Host "Triggering deployment to Google Cloud Run (this will take a few minutes)..."

# 3. Execute deployment
gcloud run deploy esg-team --source . --region asia-east1 --allow-unauthenticated --set-env-vars="NEXT_PUBLIC_SANITY_PROJECT_ID=$projectId,NEXT_PUBLIC_SANITY_DATASET=$dataset,SANITY_WRITE_TOKEN=$writeToken,GEMINI_API_KEY=$geminiKey"
