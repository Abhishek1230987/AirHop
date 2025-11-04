# 🎯 **QUICK REFERENCE - HISTORY FEATURE**

## **Visual System Architecture**

```
┌─────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                          │
│                  http://localhost:3000                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐      ┌────────────────────────┐      │
│  │   Search Page        │      │   History Page         │      │
│  │  /search             │      │  /search-history       │      │
│  │                      │      │                        │      │
│  │  1. Enter cities     │      │  1. Load searches      │      │
│  │  2. Calculate routes │      │  2. Display cards      │      │
│  │  3. POST to backend  │      │  3. Show all details   │      │
│  │  4. Save to localStorage    │                        │      │
│  └──────────────────────┘      └────────────────────────┘      │
│           │                              ▲                      │
│           │ POST /api/search            │ GET /api/search      │
│           │ {search data}                │                      │
│           ▼                              │                      │
├──────────────────────────────────────────┼───────────────────────┤
│                   BACKEND (Express)                             │
│                http://localhost:5000                            │
├──────────────────────────────────────────┼───────────────────────┤
│           │                              │                      │
│           ▼                              ▼                      │
│  ┌─────────────────────────────────────────────────┐           │
│  │  Routes: /api/search                           │           │
│  │  - POST: saveSearch()  ← save new search      │           │
│  │  - GET: getSearchHistory() ← retrieve search   │           │
│  │  - DELETE: deleteSearch()                      │           │
│  └─────────────────────────────────────────────────┘           │
│           │                              │                      │
│           │ authMiddleware                                      │
│           │ (verify JWT token)                                  │
│           ▼                              ▼                      │
│  ┌─────────────────────────────────────────────────┐           │
│  │  MongoDB (airhop database)                     │           │
│  │  Collection: searchhistories                   │           │
│  │  Documents: All user searches                  │           │
│  └─────────────────────────────────────────────────┘           │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## **Quick Lookup Table**

### **API Endpoints**

| Endpoint          | Method | Purpose           | Auth        | Response              |
| ----------------- | ------ | ----------------- | ----------- | --------------------- |
| `/api/search`     | POST   | Save a search     | ✅ Required | `{success, searchId}` |
| `/api/search`     | GET    | Get all searches  | ✅ Required | `{searches, total}`   |
| `/api/search/:id` | DELETE | Delete one search | ✅ Required | `{success}`           |

### **Frontend Routes**

| Route             | Purpose           | Status     |
| ----------------- | ----------------- | ---------- |
| `/login`          | User login        | ✅ Working |
| `/signup`         | User registration | ✅ Working |
| `/search`         | Search interface  | ✅ Working |
| `/search-history` | View all searches | ✅ Working |

### **Console Log Patterns**

**What to look for in browser console (F12):**

| Message                        | Meaning                       | Status     |
| ------------------------------ | ----------------------------- | ---------- |
| `📤 Sending search data`       | Frontend about to POST        | ✅ Good    |
| `✅ Search saved successfully` | Received success from backend | ✅ Good    |
| `❌ Error saving search`       | Backend returned error        | ❌ Problem |
| `📥 [SearchHistory] Fetching`  | About to fetch history        | ✅ Good    |
| `✅ [SearchHistory] Got data`  | Received searches from API    | ✅ Good    |
| `❌ Response status: 401`      | Not authenticated             | ❌ Problem |
| `❌ Response status: 404`      | Backend not found             | ❌ Problem |

**What to look for in backend terminal:**

| Message                           | Meaning                        | Status     |
| --------------------------------- | ------------------------------ | ---------- |
| `✅ [saveSearch] Saved search`    | Successfully saved to DB       | ✅ Good    |
| `✅ [getSearchHistory] Retrieved` | Successfully retrieved from DB | ✅ Good    |
| `❌ No userId found`              | User not authenticated         | ❌ Problem |
| `MongoDB connection error`        | Database not connected         | ❌ Problem |

---

## **Troubleshooting Flowchart**

```
Start: History is empty

Q1: Did you perform a search?
├─ NO → Perform a search first
└─ YES ↓

Q2: Browser console shows "✅ Search saved"?
├─ NO → Check browser console for error
│       - 401? Need to login
│       - 404? Backend not running
│       - Network error? Backend down
└─ YES ↓

Q3: Backend terminal shows "[saveSearch] Saved"?
├─ NO → Backend not receiving requests
│       - Check: Is backend running?
│       - Check: Port 5000 available?
└─ YES ↓

Q4: Go to history page, see "✅ [SearchHistory] Got data"?
├─ NO → GET endpoint issue
│       - Check: Network tab shows response
│       - Check: Status code 200?
└─ YES ↓

Q5: History page displays search cards?
├─ NO → Frontend rendering issue
│       - Check: Console shows data
│       - Check: Page fully loaded
└─ YES ↓

SUCCESS! ✅ System working!
```

---

## **File Location Reference**

```
e:\Airhop-project-main\
├── app/
│   ├── search/
│   │   └── page.tsx ................ Search interface
│   └── search-history/
│       └── page.tsx ................ History display
├── backend/
│   ├── middleware/
│   │   └── authMiddleware.js ........ Authentication
│   ├── controllers/
│   │   └── searchController.js ...... API logic
│   ├── models/
│   │   └── SearchHistory.js ......... DB schema
│   └── server.js ................... Backend entry
├── READY_TO_TEST.md ................ Quick start
├── VERIFICATION_CHECKLIST.md ....... Step-by-step check
├── COMPLETE_DATA_FLOW.md ........... Detailed docs
└── test-complete-flow.ps1 .......... Test script
```

---

## **Database Query Cheat Sheet**

```powershell
# Connect to MongoDB
mongo

# Select database
use airhop

# Count all searches
db.searchhistories.countDocuments()

# View all searches
db.searchhistories.find().pretty()

# View searches for specific user
db.searchhistories.find({ userId: "user@email.com" }).pretty()

# Count searches for user
db.searchhistories.countDocuments({ userId: "user@email.com" })

# View most recent search
db.searchhistories.find().sort({ createdAt: -1 }).limit(1).pretty()

# Delete all searches (dangerous!)
db.searchhistories.deleteMany({})

# Delete searches for one user
db.searchhistories.deleteMany({ userId: "user@email.com" })
```

---

## **Environment Variables Needed**

```bash
# Backend (.env in backend/ folder)
OPENWEATHER_API_KEY=your_key_here
JWT_SECRET=your_secret_key
MONGODB_URI=mongodb://localhost:27017/airhop  # Optional (uses default if not set)
PORT=5000

# Frontend (.env.local in root)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

---

## **Ports Reference**

```
Service          Port    Status
─────────────────────────────────
MongoDB          27017   Terminal 1
Backend API      5000    Terminal 2
Frontend         3000    Terminal 3
```

---

## **Critical File Changes Summary**

| File                              | Lines   | Change                    |
| --------------------------------- | ------- | ------------------------- |
| `app/search/page.tsx`             | 260-380 | Added POST to /api/search |
| `app/search-history/page.tsx`     | 55-95   | Added logging to fetch    |
| `backend/searchController.js`     | 1-100   | Enhanced logging          |
| `backend/authMiddleware.js`       | All     | Multiple token sources    |
| `backend/models/SearchHistory.js` | All     | Extended schema           |

---

## **Success Checklist**

```
□ MongoDB running (mongod shows waiting for connections)
□ Backend running (npm start shows ✅ Server running)
□ Frontend running (pnpm dev shows ✓ Ready)
□ Can login at http://localhost:3000/login
□ Can search at http://localhost:3000/search
□ Browser console shows "✅ Search saved"
□ Backend terminal shows "[saveSearch] Saved"
□ Go to http://localhost:3000/search-history
□ Browser console shows "✅ Got data"
□ History page displays search card
```

When all checked: **SYSTEM WORKING! ✅**

---

## **One-Minute Test**

```powershell
# Terminal 1
mongod

# Terminal 2 (wait for Terminal 1 ready)
cd backend
npm start

# Terminal 3 (wait for Terminal 2 ready)
pnpm dev

# Browser:
# 1. Go to localhost:3000/login → login
# 2. Go to localhost:3000/search → search Delhi→Mumbai
# 3. Check console (F12): should see "✅ Search saved"
# 4. Go to localhost:3000/search-history
# 5. Should see your search displayed

# Expected: ✅ SUCCESS
```

---

## **Most Common Issues**

| Issue             | Check               | Fix                        |
| ----------------- | ------------------- | -------------------------- |
| History empty     | Did you search?     | Perform a search first     |
| 401 error         | Logged in?          | Go to /login and login     |
| 404 error         | Backend running?    | Run `npm start` in backend |
| CORS error        | Backend restarted?  | Restart backend            |
| MongoDB error     | mongod running?     | Start MongoDB: `mongod`    |
| No searches in DB | saveSearch working? | Check search console logs  |

---

## **Getting Help**

When something doesn't work:

1. **Check Console (F12)** - Browser console logs show what frontend is doing
2. **Check Terminal** - Backend terminal logs show what API is doing
3. **Check MongoDB** - Run `db.searchhistories.find()` to see if data exists
4. **Check Network Tab (F12)** - Shows API requests and responses
5. **Share the logs** - Copy console logs, backend logs, any error messages

---

**Ready to test? Start with "READY_TO_TEST.md" or run test-complete-flow.ps1**
