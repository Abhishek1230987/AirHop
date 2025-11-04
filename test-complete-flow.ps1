# 🔧 Complete Flow Test Script for History Feature
# This script tests if all components are working together

Write-Host "🧪 Testing Complete History Flow" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Function to test endpoint
function Test-Endpoint {
    param(
        [string]$url,
        [string]$name,
        [hashtable]$headers = @{},
        [string]$method = "GET",
        [string]$body = $null
    )
    
    Write-Host "Testing: $name" -ForegroundColor Yellow
    Write-Host "URL: $url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $url
            Method = $method
            Headers = $headers
            TimeoutSec = 5
        }
        
        if ($body) {
            $params['Body'] = $body
        }
        
        $response = Invoke-RestMethod @params
        Write-Host "✅ SUCCESS - Status: OK" -ForegroundColor Green
        Write-Host "Response: $($response | ConvertTo-Json -Depth 2)" -ForegroundColor Green
        return $response
    }
    catch {
        Write-Host "❌ FAILED - $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
    Write-Host ""
}

# 1. Test Backend Connection
Write-Host "`n1️⃣  TESTING BACKEND CONNECTION" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Test-Endpoint -url "http://localhost:5000/api/aqi" -name "Backend Health Check"

# 2. Test MongoDB Connection (from backend logs)
Write-Host "`n2️⃣  MONGODB CONNECTION" -ForegroundColor Cyan
Write-Host "=======================" -ForegroundColor Cyan
Write-Host "Check backend terminal output:"
Write-Host "  Look for: '✅ Connected to MongoDB (Real)'" -ForegroundColor Yellow
Write-Host "  Or: '💾 Falling back to In-Memory Database'" -ForegroundColor Yellow

# 3. List current searches in MongoDB
Write-Host "`n3️⃣  CHECKING MONGODB DOCUMENTS" -ForegroundColor Cyan
Write-Host "=============================" -ForegroundColor Cyan
Write-Host "Run this in a new PowerShell terminal:" -ForegroundColor Yellow
Write-Host "  mongo" -ForegroundColor Gray
Write-Host "  use airhop" -ForegroundColor Gray
Write-Host "  db.searchhistories.find().pretty()" -ForegroundColor Gray
Write-Host "  db.searchhistories.countDocuments()" -ForegroundColor Gray

# 4. Test the complete flow manually
Write-Host "`n4️⃣  MANUAL TESTING STEPS" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host @"
Follow these steps:

STEP 1: Go to http://localhost:3000/login
        - Login with your account
        - Verify you're logged in (no login page)

STEP 2: Go to http://localhost:3000/search
        - Open browser console (F12)
        - Click in console tab
        - Search: Delhi → Mumbai
        - Watch for message: "✅ Search saved to history successfully!"

STEP 3: Check backend terminal
        - Look for: "✅ [saveSearch] Saved search for user ..."
        - Should show search ID

STEP 4: Check MongoDB (optional)
        - Open new PowerShell
        - Run: mongo
        - Run: use airhop
        - Run: db.searchhistories.find().pretty()
        - Should see your search

STEP 5: Go to http://localhost:3000/search-history
        - Open browser console (F12)
        - Wait for page to load
        - Watch for: "✅ [SearchHistory] Got data: ..."
        - Should show your search in the list

"@ -ForegroundColor Yellow

Write-Host "`n5️⃣  COLLECTING LOGS FOR DEBUGGING" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host @"
If the flow doesn't work, collect logs:

1. Browser Console (F12 → Console):
   - Copy all red errors
   - Copy all logs starting with "📤", "📡", "✅", "❌"

2. Backend Terminal:
   - Take screenshot of all output
   - Look for "[saveSearch]" logs
   - Look for "[getSearchHistory]" logs
   - Look for MongoDB connection status

3. MongoDB (if running):
   - Run: db.searchhistories.countDocuments()
   - What number? (should be > 0 after search)

4. Network Tab (F12 → Network):
   - Perform search
   - Look for POST /api/search request
   - Check: Status code (should be 200)
   - Response tab shows: { success: true, searchId: "..." }

Share screenshots of these with:
- Browser console logs
- Backend terminal output  
- MongoDB document count
- Network response
"@ -ForegroundColor Yellow

Write-Host "`n✅ Testing guide complete!" -ForegroundColor Green
Write-Host "Run the steps above and report the results." -ForegroundColor Cyan
