# Create target directory
New-Item -ItemType Directory -Path "src/contracts/typechain-types" -Force

# Find all non-debug JSON artifacts
$artifactFiles = Get-ChildItem -Recurse -Path artifacts\contracts -Filter *.json |
                 Where-Object { $_.Name -notlike '*.dbg.json' } |
                 Select-Object -ExpandProperty FullName

# Generate types for each valid artifact
foreach ($file in $artifactFiles) {
    npx typechain --target ethers-v6 --out-dir src/contracts/typechain-types $file
}

Write-Host "Successfully generated contract types!" -ForegroundColor Green
