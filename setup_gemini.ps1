# PowerShell Script to Setup Gemini API Key for Food Recognition
# Run this script: .\setup_gemini.ps1

Write-Host "🤖 Nutrition AI - Gemini API Setup" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

Write-Host "📚 Step 1: Get Your Free Gemini API Key" -ForegroundColor Yellow
Write-Host "Visit: https://makersuite.google.com/app/apikey" -ForegroundColor White
Write-Host "Sign in with Google and click 'Create API Key'`n"

# Prompt for API key
$apiKey = Read-Host "Enter your Gemini API Key (or press Enter to skip)"

if ($apiKey) {
    # Set environment variable for current session
    $env:GEMINI_API_KEY = $apiKey
    Write-Host "`n✅ API Key set for current session!" -ForegroundColor Green
    
    # Ask if user wants to save permanently
    $save = Read-Host "`nDo you want to save this permanently? (y/n)"
    
    if ($save -eq 'y' -or $save -eq 'Y') {
        [System.Environment]::SetEnvironmentVariable('GEMINI_API_KEY', $apiKey, 'User')
        Write-Host "✅ API Key saved permanently!" -ForegroundColor Green
        Write-Host "⚠️ You may need to restart VS Code for it to take effect." -ForegroundColor Yellow
    }
    
    # Create .env file
    $envContent = "# Gemini API Key for Food Recognition`nGEMINI_API_KEY=$apiKey"
    Set-Content -Path "backend\.env" -Value $envContent
    Write-Host "✅ Created backend\.env file" -ForegroundColor Green
    
} else {
    Write-Host "`n⚠️ No API key entered. You can set it later:" -ForegroundColor Yellow
    Write-Host "   PowerShell: `$env:GEMINI_API_KEY='your_key_here'" -ForegroundColor White
    Write-Host "   Or edit backend\.env file`n" -ForegroundColor White
}

Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start backend: cd backend; uvicorn main:app --reload" -ForegroundColor White
Write-Host "2. Start frontend: cd frontend; npm run dev" -ForegroundColor White
Write-Host "3. Upload any Indian food image and see AI magic! ✨`n" -ForegroundColor White

Write-Host "📦 Supported Foods (36 items):" -ForegroundColor Cyan
Write-Host "Breakfast: Idli, Dosa, Upma, Poha, Paratha, Pongal" -ForegroundColor White
Write-Host "Main: Biryani, Curry, Dal, Rajma, Chole, Butter Chicken" -ForegroundColor White
Write-Host "Bread: Roti, Chapati, Naan, Puri" -ForegroundColor White
Write-Host "Snacks: Samosa, Vada, Pakora" -ForegroundColor White
Write-Host "And many more!`n" -ForegroundColor White

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
