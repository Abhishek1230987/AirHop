# 🧪 **QUICK DIAGNOSTIC - RUN THIS TO FIX**

## Step 1: Stop Everything

```powershell
# Stop all processes
# Press Ctrl+C in each terminal running:
# - frontend (pnpm dev)
# - backend (npm start)
```

---

## Step 2: Start Fresh MongoDB

```powershell
# Start MongoDB in a NEW terminal
mongod

# You should see:
# [initandlisten] waiting for connections on port 27017
```

**WAIT FOR THIS MESSAGE BEFORE PROCEEDING**

---

## Step 3: Start Backend

```powershell
# In a NEW terminal
cd backend
npm start

# You should see:
# ✅ Connected to MongoDB (Real)
# ✅ Server running on port 5000
# 🌤️ Connected to OpenWeather API successfully!
```

**WAIT FOR THESE MESSAGES BEFORE PROCEEDING**

---

## Step 4: Start Frontend

```powershell
# In a NEW terminal
cd ..\  (to root)
pnpm dev

# You should see:
# ✓ Ready in X.Xs
# - Local: http://localhost:3000
```

**WAIT FOR THIS MESSAGE BEFORE PROCEEDING**

---

## Step 5: Test the Flow

1. **Open Browser:** `http://localhost:3000/search`

2. **Login (if needed)**

3. **Perform Search:**

   - From: `Delhi`
   - To: `Mumbai`
   - Click: Search

4. **Watch Browser Console (F12):**

   - Press `F12`
   - Click `Console` tab
   - You should see logs like:
     ```
     📤 Sending search data to backend: {...}
     ✅ Search saved to history successfully!
     ```

5. **Watch Backend Terminal:**

   - You should see logs like:
     ```
     📥 [saveSearch] Received request
     ✅ [saveSearch] Saved search for user ...
     ```

6. **Check History:**
   - Go to: `http://localhost:3000/search-history`
   - You should see your search listed

---

## 🔍 **Troubleshooting - If Still Not Working**

### **Issue: "❌ MongoDB connection error" in backend**

**Solution:**

```powershell
# Make sure MongoDB is running
mongod

# Should show: "[initandlisten] waiting for connections on port 27017"
```

### **Issue: "Cannot POST /api/search" or "404"**

**Solution:**

```powershell
# Stop and restart backend
# In backend terminal, press Ctrl+C
# Then: npm start
```

### **Issue: "401 Unauthorized"**

**Solution:**

```
1. Go to Login page
2. Log out if already logged in
3. Log back in
4. Try searching again
```

### **Issue: "Failed to fetch" in browser console**

**Solution:**

```
1. Check backend is running on port 5000
2. Check CORS is enabled in backend
3. Restart both frontend and backend
```

---

## ✅ **If Everything Works**

You should see:

1. ✅ Search performs and shows results
2. ✅ Browser console shows "✅ Search saved"
3. ✅ Backend terminal shows "[saveSearch] Saved search"
4. ✅ History page shows the search
5. ✅ History displays all route information

---

## 📊 **If You See This in Browser Console - YOU'RE GOOD!**

```
📤 Sending search data to backend: {
  source: "Delhi",
  destination: "Mumbai",
  sourceAQI: {aqi: 185, temperature: 32, humidity: 65},
  destinationAQI: {aqi: 142, temperature: 28, humidity: 72},
  routes: (3) [{…}, {…}, {…}],
  selectedRoute: "balanced",
  selectedRouteDetails: {distance: 1497, duration: 1122, avgAQI: 146, pollution: "moderate"}
}

📡 Backend URL: http://localhost:5000

📥 Backend response: {
  search: {
    _id: "507f1f77bcf86cd799439012",
    userId: "507f1f77bcf86cd799439011",
    source: "Delhi",
    destination: "Mumbai",
    routes: (3) […],
    selectedRoute: "balanced",
    createdAt: "2025-11-04T15:45:00.000Z"
  }
}

✅ Search saved to history successfully!
```

---

## 💾 **Verify in History Page**

Go to: `http://localhost:3000/search-history`

You should see:

- ✅ Search card with "Delhi → Mumbai"
- ✅ Date and time
- ✅ Air quality information
- ✅ 3 route options (Fastest, Balanced, Healthiest)
- ✅ Selected route marked with ✓

---

**If all this works, your search history is now functional!** 🎉
