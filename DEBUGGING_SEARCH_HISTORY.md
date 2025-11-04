# 🔍 **SEARCH HISTORY DEBUGGING GUIDE**

## 🚨 **Issue: Nothing Stored in DB, Nothing in History**

Let's systematically diagnose the issue.

---

## 📋 **Step 1: Check Backend Connection**

### **1.1 Verify MongoDB is Running**

**For Local MongoDB:**

```powershell
# Check if MongoDB is running
mongod --version

# Start MongoDB if not running
mongod
```

**For MongoDB Atlas:**

```
✓ Open MongoDB Atlas dashboard
✓ Check if cluster is active
✓ Verify connection string in .env.local
```

### **1.2 Check Backend is Running**

```powershell
# In a terminal, go to backend
cd backend

# Check if port 5000 is running
netstat -ano | findstr :5000

# If not running, start it:
npm start
# or
node server.js
```

### **1.3 Test Backend API**

```powershell
# In PowerShell
$headers = @{
    "Content-Type" = "application/json"
}

# Test if backend is responding
Invoke-WebRequest -Uri "http://localhost:5000/api/aqi" -Headers $headers -UseBasicParsing
```

**Expected Response:** Status 200 (or error if endpoint requires auth)

---

## 🖥️ **Step 2: Check Frontend Logs**

### **2.1 Open Browser DevTools**

1. Go to: `http://localhost:3000/search`
2. Press: `F12` (or right-click → Inspect)
3. Click: **Console** tab

### **2.2 Perform a Search**

1. Enter: `Delhi` → `Mumbai`
2. Click: **Search**
3. Watch the console for messages

### **2.3 Look for These Messages:**

**✅ GOOD (Data being sent):**

```
📤 Sending search data to backend: {...}
📡 Backend URL: http://localhost:5000
📥 Backend response: {...}
✅ Search saved to history successfully!
```

**❌ BAD (Data not being sent):**

```
📡 Backend URL: http://localhost:5000
❌ Error saving search to history: ...
⚠️ Failed to save search to history: 401 ...
⚠️ Failed to save search to history: 404 ...
```

---

## 🔧 **Step 3: Check Common Issues**

### **Issue 1: 401 Unauthorized**

**Symptoms:**

```
⚠️ Failed to save search to history: 401
```

**Possible causes:**

- User not logged in
- JWT token expired
- Auth cookie not set

**Fix:**

```
1. Log out completely
2. Log back in
3. Try searching again
```

### **Issue 2: 404 Not Found**

**Symptoms:**

```
⚠️ Failed to save search to history: 404
```

**Possible causes:**

- Backend not running
- Wrong API endpoint
- Backend not configured properly

**Fix:**

```
1. Check if backend running: pnpm dev (in backend folder)
2. Check port 5000 is accessible
3. Verify NEXT_PUBLIC_BACKEND_URL in .env.local
```

### **Issue 3: MongoDB Connection Error**

**Symptoms:**

```
Backend logs: "❌ MongoDB connection error"
No data in history page
```

**Possible causes:**

- MongoDB not running
- Connection string wrong
- Database credentials invalid

**Fix - Local MongoDB:**

```powershell
# Start MongoDB
mongod

# Should see: "[initandlisten] waiting for connections on port 27017"
```

**Fix - Atlas MongoDB:**

```
1. Check .env.local has correct MongoDB_URI
2. Verify IP whitelist in Atlas
3. Check credentials are correct
4. Ensure retryWrites=false is set
```

---

## 🧪 **Step 4: Test Each Component**

### **4.1 Test Frontend Can Reach Backend**

**In Browser Console:**

```javascript
fetch("http://localhost:5000/api/aqi")
  .then((r) => r.json())
  .then((d) => console.log("✅ Backend reachable:", d))
  .catch((e) => console.error("❌ Backend not reachable:", e));
```

**Expected:** Either data or successful response

### **4.2 Test Backend API Directly**

**In PowerShell:**

```powershell
# Get your JWT token first (from browser console)
# Open DevTools → Application → Cookies → token

$token = "YOUR_TOKEN_HERE"
$headers = @{
    "Content-Type" = "application/json"
    "Authorization" = "Bearer $token"
}

$body = @{
    source = "Delhi"
    destination = "Mumbai"
    sourceAQI = @{ aqi = 100; temperature = 32; humidity = 65 }
    destinationAQI = @{ aqi = 120; temperature = 28; humidity = 72 }
    routes = @()
    selectedRoute = "balanced"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5000/api/search" `
  -Method POST `
  -Headers $headers `
  -Body $body `
  -UseBasicParsing
```

**Expected:** 200 status with saved search data

### **4.3 Test Backend Logs**

**Watch backend terminal for:**

```
📥 [saveSearch] Received request
👤 [saveSearch] req.user: { id: '...', email: '...' }
📦 [saveSearch] Request body: { source: 'Delhi', ... }
✅ [saveSearch] Saved search for user ...
```

---

## 📊 **Step 5: Check Database**

### **5.1 Using MongoDB CLI**

```powershell
# Connect to local MongoDB
mongo

# Switch to database
use airhop

# Check if SearchHistory collection exists
show collections

# See all searches
db.searchhistory.find()

# Count searches
db.searchhistory.countDocuments()
```

### **5.2 Using MongoDB Compass (GUI)**

1. Download: `https://www.mongodb.com/products/compass`
2. Connect to: `mongodb://localhost:27017`
3. Select: `airhop` database
4. Select: `searchhistories` collection
5. You should see your searches here

---

## 🔄 **Complete Diagnostic Flow**

```
1. Verify Backend Running
   └─ Check port 5000: netstat -ano | findstr :5000
   └─ Check logs for startup errors

2. Verify MongoDB Running
   └─ Check port 27017 (local) or Atlas connection
   └─ Test connection manually

3. Perform Search
   └─ Go to http://localhost:3000/search
   └─ Enter cities
   └─ Click Search
   └─ Watch console

4. Check Console Logs
   └─ Look for "📤 Sending search data" message
   └─ Look for "✅ Search saved" or error messages

5. Check Backend Logs
   └─ Look for "[saveSearch]" messages
   └─ Check for auth errors
   └─ Check for database errors

6. Check Database
   └─ Use MongoDB Compass or CLI
   └─ Verify searchhistories collection
   └─ Check if documents were created

7. Check History Page
   └─ Go to http://localhost:3000/search-history
   └─ Should see searches you performed
```

---

## 📝 **Example: Full Working Flow**

### **Frontend Console (Expected):**

```
🔍 Fetching data for city: Delhi
✅ Weather API response for Delhi: {...}
📊 PM2.5: 85.32 μg/m³ → AQI: 185
✅ Delhi: AQI=185, Temp=32°C, Humidity=65%

🔍 Fetching data for city: Mumbai
✅ Weather API response for Mumbai: {...}
📊 PM2.5: 65.21 μg/m³ → AQI: 142
✅ Mumbai: AQI=142, Temp=28°C, Humidity=72%

📤 Sending search data to backend: {
  source: "Delhi",
  destination: "Mumbai",
  sourceAQI: {...},
  ...
}
📡 Backend URL: http://localhost:5000
📥 Backend response: {search: {...}}
✅ Search saved to history successfully!
```

### **Backend Logs (Expected):**

```
📥 [saveSearch] Received request
👤 [saveSearch] req.user: { id: '507f1f77bcf86cd799439011', email: 'user@example.com' }
📦 [saveSearch] Request body: {
  source: 'Delhi',
  destination: 'Mumbai',
  hasSourceAQI: true,
  hasDestAQI: true,
  routesCount: 3,
  selectedRoute: 'balanced'
}
✅ [saveSearch] Saved search for user 507f1f77bcf86cd799439011: {
  source: 'Delhi',
  destination: 'Mumbai',
  selectedRoute: 'balanced',
  searchId: '507f1f77bcf86cd799439012'
}
```

### **History Page (Expected):**

```
✅ Search History page loads
✅ Shows "1 search found"
✅ Delhi → Mumbai card displays
✅ Shows date/time
✅ Shows air quality data
✅ Shows 3 route options
✅ Shows selected route marked
```

---

## 🚨 **Quick Fixes**

### **Fix 1: Backend Not Running**

```powershell
cd backend
npm start
# or
node server.js
```

### **Fix 2: MongoDB Not Running**

```powershell
# Local MongoDB
mongod

# OR check Atlas connection
# Go to MongoDB Atlas dashboard
# Check cluster is running
```

### **Fix 3: Not Logged In**

```
1. Click "Log Out"
2. Go to Login page
3. Log back in
4. Try searching again
```

### **Fix 4: Wrong Backend URL**

```
Edit .env.local:
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000

Restart frontend:
pnpm dev
```

### **Fix 5: Port Already In Use**

```powershell
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process
taskkill /PID <PID> /F

# Or use different port
PORT=5001 npm start
```

---

## ✅ **Verification Checklist**

- [ ] Backend running on port 5000
- [ ] MongoDB running (local or Atlas)
- [ ] Frontend running on port 3000
- [ ] User is logged in
- [ ] Can see search results on page
- [ ] Browser console shows "✅ Search saved"
- [ ] Backend logs show "[saveSearch] Saved search"
- [ ] Can see search in History page
- [ ] Search has all details (AQI, routes, etc.)

---

## 📞 **Still Not Working?**

**Provide these details:**

1. **Frontend console output** (F12 → Console)
2. **Backend terminal output** (where you run `npm start`)
3. **MongoDB connection string** (redacted)
4. **Error messages** (exact text)
5. **Steps you performed** (exact order)

---

**Good luck debugging! 🚀**
