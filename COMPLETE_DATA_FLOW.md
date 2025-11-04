# 🔄 **COMPLETE DATA FLOW - HOW IT ALL WORKS**

## **Overview**

The search history feature works in 3 phases:

```
Phase 1: SEARCH          Phase 2: AUTO-SAVE      Phase 3: DISPLAY
┌─────────────┐         ┌──────────────┐       ┌────────────────┐
│   User      │    →    │   Backend    │   →   │   History      │
│ Searches    │    →    │   Saves to   │   →   │   Page Shows   │
│ Delhi →     │    →    │   MongoDB    │   →   │   All Searches │
│ Mumbai      │    →    │              │   →   │                │
└─────────────┘         └──────────────┘       └────────────────┘
    (3 sec)                (instant)             (when user clicks)
```

---

## **Phase 1️⃣: SEARCH (User searches on /search)**

### **Flow:**

```
1. User enters: Delhi → Mumbai
2. Clicks Search button
   ↓
3. handleSearch() function runs:
   - Fetches AQI for Delhi
   - Fetches AQI for Mumbai
   - Calculates 3 route options (fast, balanced, cleanest)
   - Updates map with routes
   ↓
4. Creates searchData object:
   {
     source: "Delhi",
     destination: "Mumbai",
     sourceAQI: { aqi: 120, temperature: 28, humidity: 65 },
     destinationAQI: { aqi: 95, temperature: 30, humidity: 60 },
     routes: [
       { type: "fast", distance: 150, duration: 2.5, avgAQI: 105 },
       { type: "balanced", distance: 155, duration: 2.6, avgAQI: 95 },
       { type: "cleanest", distance: 160, duration: 2.8, avgAQI: 85 }
     ],
     selectedRoute: "balanced"
   }
   ↓
5. SAVES TO LOCALSTORAGE (instant recovery if page reloads)
   ↓
6. POSTS to Backend: POST /api/search
   {
     method: "POST",
     credentials: "include",  ← Sends auth token
     body: JSON.stringify(searchData)
   }
   ↓
7. Frontend logs:
   "📤 Sending search data to backend: {...}"
   "📡 Backend URL: http://localhost:5000"
   "📥 Backend response: { success: true, searchId: '...' }"
   "✅ Search saved to history successfully!"
```

### **Console Output You Should See:**

```javascript
📤 Sending search data to backend: {
  source: "Delhi",
  destination: "Mumbai",
  sourceAQI: {...},
  ...
}
📡 Backend URL: http://localhost:5000
✅ Search saved to history successfully!
```

---

## **Phase 2️⃣: AUTO-SAVE (Backend saves to MongoDB)**

### **Backend Flow:**

```
1. Backend receives POST /api/search request
   ↓
2. authMiddleware checks authentication:
   - Looks for token in: Bearer header → cookie → query param
   - Decodes JWT to get userId and email
   ↓
3. saveSearch() controller processes:
   - Receives: searchData from request body
   - Extracts: userId from req.user
   - Creates: new SearchHistory document with:
     {
       userId: "user123@gmail.com",
       source: "Delhi",
       destination: "Mumbai",
       sourceAQI: {...},
       destinationAQI: {...},
       routes: [...],
       selectedRoute: "balanced",
       createdAt: "2024-11-04T10:30:00Z",
       updatedAt: "2024-11-04T10:30:00Z"
     }
   ↓
4. Saves to MongoDB database (airhop.searchhistories collection)
   ↓
5. Returns response:
   {
     success: true,
     searchId: "507f1f77bcf86cd799439011",
     message: "Search saved successfully"
   }
```

### **Backend Console Output You Should See:**

```
✅ [saveSearch] Received request
✅ [saveSearch] Saved search for user user123@gmail.com with ID 507f1f77bcf86cd799439011
```

### **MongoDB Document Created:**

```javascript
{
  _id: ObjectId("507f1f77bcf86cd799439011"),
  userId: "user123@gmail.com",
  source: "Delhi",
  destination: "Mumbai",
  sourceAQI: {
    aqi: 120,
    temperature: 28,
    humidity: 65,
    location: "Delhi"
  },
  destinationAQI: {
    aqi: 95,
    temperature: 30,
    humidity: 60,
    location: "Mumbai"
  },
  routes: [
    {
      type: "fast",
      distance: 150,
      duration: 2.5,
      avgAQI: 105,
      pollution: "high",
      description: "Fastest route via highway"
    },
    {
      type: "balanced",
      distance: 155,
      duration: 2.6,
      avgAQI: 95,
      pollution: "moderate",
      description: "Balanced route"
    },
    {
      type: "cleanest",
      distance: 160,
      duration: 2.8,
      avgAQI: 85,
      pollution: "low",
      description: "Cleanest air quality route"
    }
  ],
  selectedRoute: "balanced",
  selectedRouteDetails: {
    distance: 155,
    duration: 2.6,
    avgAQI: 95,
    pollution: "moderate"
  },
  createdAt: ISODate("2024-11-04T10:30:00.000Z"),
  updatedAt: ISODate("2024-11-04T10:30:00.000Z"),
  __v: 0
}
```

---

## **Phase 3️⃣: DISPLAY (User views history)**

### **Frontend Flow:**

```
1. User goes to: http://localhost:3000/search-history
   ↓
2. Page loads, useEffect triggers:
   - Checks: Is user logged in?
   - Yes → Continue
   - No → Redirect to /login
   ↓
3. fetchHistory() function runs:
   - Sends: GET /api/search
   - Includes: credentials: 'include' (sends auth token)
   ↓
4. Receives response:
   {
     success: true,
     searches: [
       {
         _id: "507f1f77bcf86cd799439011",
         source: "Delhi",
         destination: "Mumbai",
         routes: [...],
         createdAt: "2024-11-04T10:30:00Z"
       },
       // ... more searches
     ],
     total: 5,
     limit: 10,
     skip: 0
   }
   ↓
5. Updates state: setSearches(data.searches)
   ↓
6. Renders: Search history cards with:
   - Source/Destination
   - 3 route options with details
   - Color-coded AQI badges (green/yellow/red)
   - Selected route highlighted
   - Delete button
```

### **Console Output You Should See:**

```javascript
📥 [SearchHistory] Fetching history for user: user123@gmail.com
📡 [SearchHistory] Response status: 200
✅ [SearchHistory] Got data: {
  searchCount: 5,
  total: 5,
  searches: [...]
}
```

### **History Page Display:**

```
┌─────────────────────────────────────────────┐
│  Search History                    Delete ✕  │
├─────────────────────────────────────────────┤
│                                               │
│  📍 Delhi → Mumbai                           │
│  📅 Nov 4, 2024 · 10:30 AM                  │
│                                               │
│  🌡️ Air Quality:                            │
│  • Delhi: AQI 120 🟠 (Moderate)            │
│  • Mumbai: AQI 95 🟡 (Moderate)            │
│                                               │
│  🛣️ Route Options:                          │
│  ┌─────────────────────────────────────┐    │
│  │ ⚡ Fast                       155 km │    │
│  │ 🕒 2h 30m | AQI: 105 🟠          │    │
│  │ Via Highway                         │    │
│  └─────────────────────────────────────┘    │
│                                               │
│  ┌─────────────────────────────────────┐    │
│  │ ⚖️ Balanced (Selected) ✓      155 km│    │
│  │ 🕒 2h 36m | AQI: 95 🟡            │    │
│  │ Best Balance                        │    │
│  └─────────────────────────────────────┘    │
│                                               │
│  ┌─────────────────────────────────────┐    │
│  │ 🌿 Cleanest                   160 km│    │
│  │ 🕒 2h 48m | AQI: 85 🟢           │    │
│  │ Through green routes                │    │
│  └─────────────────────────────────────┘    │
│                                               │
└─────────────────────────────────────────────┘
```

---

## **Error Handling & Recovery**

### **If Page Reload Happens (Phase 1.5)**

```
Search in Progress → Page Reloads → What Happens?

✅ SAVED IN LOCALSTORAGE:
   useEffect on /search page loads:
   const saved = localStorage.getItem('searchState')
   if (saved) restore it immediately
   Result: Previous search is restored, user sees same data

❌ NOT YET SENT TO BACKEND:
   If search didn't post before reload, it's lost
   But: Search bar values are restored from localStorage
   User can click search again to re-submit
```

### **If Backend Offline (Phase 2)**

```
Frontend tries POST /api/search → Backend not responding

❌ Error: "Failed to connect to server"
✅ But: Search still displayed on /search page
✅ And: Saved in localStorage (persists)
✅ Action: When backend comes online, search again
   It will save to database then

Frontend Console shows:
"❌ Error saving search to history: fetch failed"
```

### **If User Not Authenticated (Phase 3)**

```
Frontend tries GET /api/search → Backend returns 401

❌ Error: "Response status: 401"
✅ Action: User must login first

Frontend redirects: /search-history → /login
Backend returns: { error: "Unauthorized" }

Backend Console shows:
"❌ [getSearchHistory] No userId found - unauthorized"
```

---

## **Data Validation At Each Stage**

### **Stage 1: Frontend Validation**

```javascript
// Before posting, check:
if (!source || !destination) {
  console.warn("Missing source or destination");
  return;
}

if (!aqiData[0] || !aqiData[1]) {
  console.warn("AQI data not loaded");
  return;
}

if (!routes || routes.length === 0) {
  console.warn("No routes calculated");
  return;
}

// If all checks pass, post to backend
```

### **Stage 2: Backend Validation**

```javascript
// authMiddleware checks:
if (!req.user || !req.user.id) {
  return res.status(401).json({ error: "Unauthorized" });
}

// saveSearch checks:
if (!req.body.source || !req.body.destination) {
  return res.status(400).json({ error: "Missing required fields" });
}

// Schema validation (Mongoose):
const search = new SearchHistory(req.body);
await search.validate(); // Will throw if invalid
```

### **Stage 3: Database Validation**

```javascript
// MongoDB indexes ensure:
- userId is indexed (fast queries)
- createdAt is indexed (sort by date)
- _id is unique (no duplicates)

// Schema enforces:
- source: String (required)
- destination: String (required)
- routes: Array (required)
- userId: String (required, indexed)
```

---

## **Performance Metrics**

| Operation          | Time            | Location            |
| ------------------ | --------------- | ------------------- |
| Search calculation | ~1-2s           | Frontend            |
| AQI fetch          | ~500ms per city | API call            |
| Route generation   | ~300ms          | Frontend            |
| Auto-save POST     | <100ms          | Network             |
| Backend save       | <100ms          | MongoDB             |
| Total search time  | ~2-3s           | Frontend            |
| **History fetch**  | **~200ms**      | **GET /api/search** |
| **History render** | **~500ms**      | **Browser**         |

---

## **Troubleshooting Decision Tree**

```
"History is empty"
│
├─ Search shows "✅ Search saved"?
│  │
│  ├─ YES → Backend saved it
│  │  │
│  │  └─ History GET shows 200 status?
│  │     │
│  │     ├─ YES → Check MongoDB
│  │     │  └─ Run: db.searchhistories.countDocuments()
│  │     │
│  │     └─ NO (401/404) → Auth or server issue
│  │        └─ Check: Is backend running?
│  │        └─ Check: Is user logged in?
│  │
│  └─ NO → Frontend didn't save
│     │
│     └─ Check: Backend running?
│        └─ Check: Network tab shows POST /api/search?
│        └─ Check: Response shows error?
│
└─ Not logged in?
   └─ Go to /login first
```

---

## **Verification Checklist**

- [ ] Perform search on /search page
- [ ] See "✅ Search saved" in browser console
- [ ] See "[saveSearch] Saved" in backend terminal
- [ ] Go to /search-history page
- [ ] See "✅ Got data:" in browser console
- [ ] History page displays search card
- [ ] MongoDB shows document: `db.searchhistories.find()`
- [ ] All 3 routes displayed with correct AQI
- [ ] Selected route highlighted

---

**When all checkmarks are complete: ✅ System is working!**
