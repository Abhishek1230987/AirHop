# 🚀 AIRHOP Setup Guide - Step by Step

This guide will help you set up AIRHOP for development and testing.

## ⚙️ Prerequisites

- **Node.js** 18.17+ and **pnpm** (https://pnpm.io/)
- **MongoDB** (local or MongoDB Atlas account)
- **OpenWeather API Key** (https://openweathermap.org/api)
- **Google OAuth Credentials** (optional, for Google login)
- **Git** (for cloning/version control)

## 📝 Step-by-Step Setup

### Step 1: Clone/Extract Project

```bash
cd Airhop-project-main
```

### Step 2: Install Root Dependencies

```bash
pnpm install
```

### Step 3: Install Backend Dependencies

```bash
cd backend
pnpm install
cd ..
```

### Step 4: Create Environment Files

#### Create `.env.local` (root directory)

```bash
touch .env.local  # On Windows: use VS Code or create manually
```

**Contents of `.env.local`:**

```env
# OpenWeather API
OPENWEATHER_API_KEY=your_openweather_api_key_here

# Backend URL (for frontend to connect)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

#### Create `backend/.env`

```bash
cd backend
touch .env  # On Windows: use VS Code or create manually
cd ..
```

**Contents of `backend/.env`:**

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
# Option A: MongoDB Atlas (Cloud)
MONGODB_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/?appName=Cluster0

# Option B: Local MongoDB
# MONGODB_URI=mongodb://localhost:27017/airhop

# JWT Secret (use a long random string)
JWT_SECRET=e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855

# Google OAuth (optional, leave blank if not using)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# Frontend URL for OAuth redirects
FRONTEND_URL=http://localhost:3000
```

### Step 5: Get OpenWeather API Key

1. Go to https://openweathermap.org/api
2. Sign up for free account
3. Generate API key from dashboard
4. Copy and paste into `.env.local`

### Step 6: Set Up MongoDB

#### Option A: Use MongoDB Atlas (Recommended for Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up/Log in
3. Create a cluster
4. Create a database user (username/password)
5. Add your IP to IP whitelist (Security > Network Access)
6. Get connection string: Clusters > Connect > Drivers
7. Copy the MongoDB URI
8. Replace username:password in connection string
9. Add `&retryWrites=false` to the connection string
10. Paste into `backend/.env` as `MONGODB_URI`

Example MongoDB URI:

```env
mongodb+srv://my_user:my_password@cluster0.glvubtl.mongodb.net/?appName=Cluster0&retryWrites=false
```

#### Option B: Use Local MongoDB

1. **Windows**: Download from https://www.mongodb.com/try/download/community
2. **macOS**:
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```
3. **Linux**: Follow official MongoDB documentation

Start MongoDB:

```bash
# Windows
mongod --dbpath C:\data\db

# macOS/Linux
mongod
```

Use this connection string in `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/airhop
```

### Step 7: (Optional) Set Up Google OAuth

1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable OAuth 2.0 consent screen
4. Create OAuth 2.0 credentials (Web application)
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/google/callback`
   - `http://localhost:5000/api/auth/google/callback`
6. Copy Client ID and Client Secret
7. Add to `backend/.env`:

```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

## 🎯 Start Development Servers

### Terminal 1: Start Backend

```bash
cd backend
node server.js
```

**Expected output:**

```
[dotenv] injecting env from .env
🔌 Connecting to MongoDB using env: MongoDB_URI
🔍 Mongo URI (redacted): mongodb+srv://<REDACTED>@cluster...
✅ Server running on port 5000
🌤️ Connected to OpenWeather API successfully!
✅ Connected to MongoDB
```

### Terminal 2: Start Frontend

```bash
pnpm dev
```

**Expected output:**

```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
✓ Ready in 2.5s
```

### Access Application

Open http://localhost:3000 in your browser

## ✅ Verify Everything is Working

### Test 1: Check MongoDB Connection

```bash
cd backend
node scripts/listUsers.js
```

**Expected output:**

```
Found 0 users:
```

### Test 2: Create a Test User

```bash
cd backend
node scripts/createUser.js testuser@example.com password123 "Test User"
```

**Expected output:**

```
Created user: { id: '...', email: 'testuser@example.com' }
```

### Test 3: List Users Again

```bash
cd backend
node scripts/listUsers.js
```

**Expected output:**

```
Found 1 users:
{ _id: ..., email: 'testuser@example.com', name: 'Test User' }
```

### Test 4: Test Frontend Signup

1. Visit http://localhost:3000/signup
2. Fill in the form:
   - Email: `testuser2@example.com`
   - Password: `TestPass123!`
   - Name: `Test User 2`
3. Click "Create Account"
4. Should redirect to homepage

### Test 5: Test Search History

1. Ensure you're logged in (from Test 4)
2. On homepage, enter:
   - Starting Point: `Delhi`
   - Destination: `Mumbai`
3. Click "Find Clean Routes"
4. Wait for toast notification: "Search saved"
5. Click "History" in navbar
6. Should see your search in the history list
7. Click "Delete" button to test deletion
8. Should see "Search has been removed from history"

## 🧪 Run E2E Tests

```bash
# Ensure backend and frontend are running in separate terminals
node e2e/pw-e2e-fixed.js --url=http://localhost:3000 --headless=true
```

**Expected output:**

```
Launching browser (headless=true) and visiting http://localhost:3000/signup
Screenshot saved to: E:\Airhop-project-main\e2e\output\signup-1698574392000.png
Test email: e2e_ui_1698574392000@example.com
Token cookie present: true
Listing DB users (backend/scripts/listUsers.js):
Found 2 users: ...
E2E run complete.
```

## 🔧 Common Issues & Solutions

### ❌ "Cannot find module 'express'"

**Solution:**

```bash
cd backend
pnpm install
```

### ❌ "Port 3000 already in use"

**Solution:**

```bash
# Next.js will automatically try port 3001
# Or kill the process using port 3000

# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

### ❌ "MongoDB connection error"

**Solutions:**

1. **If using Atlas**:

   - Check internet connection
   - Verify IP whitelist in MongoDB Atlas
   - Check connection string is correct
   - Ensure `retryWrites=false` is in URI

2. **If using Local MongoDB**:
   - Start MongoDB service: `mongod`
   - Check if running on port 27017
   - Try connection string: `mongodb://localhost:27017/airhop`

### ❌ "OpenWeather API error"

**Solution:**

- Verify API key in `.env.local`
- Check API key is active in OpenWeather dashboard
- Ensure internet connection is working

### ❌ "CORS error" (in browser console)

**Solution:**

- Ensure backend is running on port 5000
- Check `FRONTEND_URL` in `backend/.env` matches your frontend URL
- Verify fetch calls use `credentials: 'include'`

### ❌ "Authentication not working"

**Solution:**

- Check `token` cookie exists in DevTools > Application > Cookies
- Verify JWT_SECRET is set in `backend/.env`
- Ensure auth middleware is applied to routes
- Try logging out and logging back in

### ❌ "Search not saving to history"

**Solution:**

- Ensure user is authenticated (check login)
- Verify MongoDB connection is working
- Check backend logs for errors
- Try running `node scripts/listUsers.js` to test DB

## 📚 Useful Commands

```bash
# Frontend development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run linter

# Backend testing
cd backend
node server.js        # Start backend
node scripts/createUser.js email password name  # Create user
node scripts/listUsers.js                       # List users
node scripts/testAuthRequests.js                # Test auth API

# E2E testing
node e2e/pw-e2e-fixed.js --url=http://localhost:3000 --headless=true

# Database
# MongoDB CLI (if installed)
mongosh  # Connect to local MongoDB
# In MongoDB shell:
# use airhop              # Switch to database
# db.users.find()        # List all users
# db.searchhistories.find()  # List searches
```

## 📖 Project Files Overview

| File                                      | Purpose                          |
| ----------------------------------------- | -------------------------------- |
| `app/page.tsx`                            | Homepage with search bar         |
| `app/login/page.tsx`                      | Login form                       |
| `app/signup/page.tsx`                     | Signup form                      |
| `app/search-history/page.tsx`             | View & manage search history     |
| `components/auth-context.tsx`             | Auth provider and hooks          |
| `components/search-bar.tsx`               | Search input form                |
| `backend/server.js`                       | Express server entry point       |
| `backend/models/User.js`                  | User database schema             |
| `backend/models/SearchHistory.js`         | Search history database schema   |
| `backend/controllers/authController.js`   | Auth logic (signup, login, etc.) |
| `backend/controllers/searchController.js` | Search history logic             |
| `.env.local`                              | Frontend environment variables   |
| `backend/.env`                            | Backend environment variables    |

## 🎓 Next Steps

1. ✅ Complete setup following this guide
2. ✅ Test all features work locally
3. ✅ Create test data (users, searches)
4. ✅ Run E2E tests to verify flow
5. 📝 Review code for improvements
6. 🚀 Deploy to production (Vercel, Render, etc.)

## 🆘 Need Help?

1. Check `README.md` for feature overview
2. Check `IMPLEMENTATION_SUMMARY.md` for technical details
3. Review backend logs: `cd backend && node server.js`
4. Check browser DevTools for network errors
5. Check MongoDB Atlas dashboard for connection issues

## 📧 Support

If you encounter issues:

1. Note the exact error message
2. Check terminal output for clues
3. Verify all environment variables are set
4. Try restarting servers
5. Clear browser cache and cookies

---

**Status**: ✅ Ready for Development

**Last Updated**: November 3, 2025
