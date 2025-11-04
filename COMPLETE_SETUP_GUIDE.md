# 🚀 **STEP-BY-STEP: GET SEARCH HISTORY WORKING**

## 📋 **Prerequisites**

- [ ] Node.js installed
- [ ] npm or pnpm installed
- [ ] MongoDB installed (local or MongoDB Atlas account)

---

## 🔧 **Complete Setup Guide**

### **Step 1: Ensure MongoDB is Running**

#### **Option A: Local MongoDB**

**Windows:**

```powershell
# Open a NEW terminal/PowerShell window

# Check if MongoDB is installed
mongod --version

# If not installed:
# Download from: https://www.mongodb.com/try/download/community
# Run the installer

# Start MongoDB
mongod

# Expected output:
# [initandlisten] waiting for connections on port 27017
```

#### **Option B: MongoDB Atlas (Cloud)**

```
1. Go to: https://www.mongodb.com/cloud/atlas
2. Login or create account
3. Create a free cluster
4. Get connection string
5. Update .env.local with connection string
```

---

### **Step 2: Start Backend Server**

```powershell
# Open a NEW terminal window
# Navigate to backend folder

cd e:\Airhop-project-main\backend

# Install dependencies (if first time)
npm install

# Start the backend
npm start

# Expected output:
# 🔌 Connecting to MongoDB
# ✅ Connected to MongoDB (Real)
# ✅ Server running on port 5000
# 🌤️ Connected to OpenWeather API successfully!
```

**KEEP THIS TERMINAL OPEN**

---

### **Step 3: Start Frontend Server**

```powershell
# Open ANOTHER NEW terminal window
# Navigate to root folder

cd e:\Airhop-project-main

# Install dependencies (if first time)
pnpm install

# Start the frontend
pnpm dev

# Expected output:
# ✓ Ready in X.Xs
# - Local: http://localhost:3000
```

**KEEP THIS TERMINAL OPEN**

---

### **Step 4: Test the Application**

**4.1 Open Browser**

```
URL: http://localhost:3000/search
```

**4.2 Login (if needed)**

```
- Go to: http://localhost:3000/login
- Enter your credentials
- Click "Sign In"
- Should redirect to dashboard or search
```

**4.3 Perform a Search**

```
1. Go to: http://localhost:3000/search
2. Enter From city: Delhi
3. Enter To city: Mumbai
4. Click "Search" button
5. Wait for results to load
```

**4.4 Monitor Console**

```
1. Press F12 (or right-click → Inspect)
2. Click "Console" tab
3. Should see logs like:
   📤 Sending search data to backend: {...}
   📡 Backend URL: http://localhost:5000
   📥 Backend response: {...}
   ✅ Search saved to history successfully!
```

**4.5 Check Backend Terminal**

```
Watch the backend terminal for:
📥 [saveSearch] Received request
👤 [saveSearch] req.user: { id: '...', email: '...' }
✅ [saveSearch] Saved search for user ...
```

**4.6 View Search History**

```
1. Go to: http://localhost:3000/search-history
2. Should see your search:
   ✅ Delhi → Mumbai
   ✅ Date and time
   ✅ Air quality data
   ✅ 3 route options
   ✅ Selected route marked
```

---

## 🆘 **If Something Goes Wrong**

### **Problem: Backend won't start**

```powershell
# Error: MongoDB connection failed
# Solution: Start MongoDB first
mongod

# Error: Port 5000 already in use
# Solution: Check what's using it
netstat -ano | findstr :5000

# Then kill it or use different port
taskkill /PID <PID> /F
# OR
PORT=5001 npm start
```

### **Problem: Frontend won't start**

```powershell
# Error: Port 3000 already in use
# Solution: Use different port
PORT=3001 pnpm dev

# Or kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### **Problem: Search not saving**

**Frontend Console Check:**

```
F12 → Console

GOOD signs:
✅ "✅ Search saved to history successfully!"
✅ "202 Sending search data to backend"

BAD signs:
❌ "Failed to save search to history: 401"
   → User not logged in, log in again
❌ "Failed to save search to history: 404"
   → Backend not running or wrong URL
❌ "Error saving search to history"
   → Check browser console for error
```

**Backend Terminal Check:**

```
GOOD signs:
✅ "[saveSearch] Saved search for user"

BAD signs:
❌ "No token provided"
   → Frontend not sending auth
❌ "Invalid token"
   → JWT token expired, login again
❌ "Not authenticated"
   → Auth middleware issue
```

### **Problem: History page empty**

**Checklist:**

```
1. [ ] At least one search performed
2. [ ] Browser console shows "✅ Search saved"
3. [ ] Backend logs show "[saveSearch] Saved search"
4. [ ] Logged in with same account
5. [ ] Refreshed history page
```

---

## 🧪 **Full Test Script**

**Copy-paste this to test everything:**

```powershell
# Terminal 1: Start MongoDB
mongod

# Wait for: [initandlisten] waiting for connections on port 27017
# Then continue...

# Terminal 2: Start Backend
cd e:\Airhop-project-main\backend
npm start

# Wait for: ✅ Server running on port 5000
# Then continue...

# Terminal 3: Start Frontend
cd e:\Airhop-project-main
pnpm dev

# Wait for: ✓ Ready in X.Xs
# Then proceed...

# Browser: Test the flow
# 1. Go to http://localhost:3000/search
# 2. Search: Delhi → Mumbai
# 3. Check browser console (F12)
# 4. Check backend terminal for "[saveSearch]"
# 5. Go to http://localhost:3000/search-history
# 6. Verify search is shown
```

---

## 📊 **Expected Final Result**

### **Browser Console (F12 → Console):**

```
✅ "📤 Sending search data to backend"
✅ "✅ Search saved to history successfully!"
```

### **Backend Terminal:**

```
✅ "✅ [saveSearch] Saved search for user"
```

### **History Page (http://localhost:3000/search-history):**

```
✅ Search card displayed
✅ "Delhi → Mumbai"
✅ Air quality: Delhi AQI 185, Mumbai AQI 142
✅ 3 route options visible
✅ Selected route marked with ✓
```

---

## ✅ **Verification Checklist**

- [ ] MongoDB running (mongod terminal)
- [ ] Backend running (npm start terminal)
- [ ] Frontend running (pnpm dev terminal)
- [ ] Can access http://localhost:3000/search
- [ ] Can login successfully
- [ ] Can perform search (Delhi → Mumbai)
- [ ] Browser console shows save confirmation
- [ ] Backend terminal shows save confirmation
- [ ] Can access http://localhost:3000/search-history
- [ ] Search history page shows search
- [ ] Search has all details (AQI, routes, etc.)

**If all are checked: ✅ WORKING! 🎉**

---

## 📞 **Quick Reference**

| Task           | Command                              | Location       |
| -------------- | ------------------------------------ | -------------- |
| Start MongoDB  | `mongod`                             | Any terminal   |
| Start Backend  | `npm start`                          | backend folder |
| Start Frontend | `pnpm dev`                           | root folder    |
| View Logs      | F12 → Console                        | Browser        |
| View History   | http://localhost:3000/search-history | Browser        |
| Check DB       | MongoDB Compass                      | Desktop app    |

---

## 🎯 **Success Criteria**

✅ **PASS if:**

- Can search for routes
- Search data sent to backend
- Data stored in MongoDB
- History page shows searches
- All route information displayed

❌ **FAIL if:**

- Search not performing
- "Failed to save" error
- History page empty
- Backend not running

---

**Let's get this working! 🚀**
