# MongoDB Installation - Complete Guide for Windows

## Fastest Solution (5 minutes)

### STEP 1: Download MongoDB Community Edition

1. Go to: **https://www.mongodb.com/try/download/community**
2. Select:
   - **OS**: Windows
   - **Version**: Latest (7.0 or 8.0)
3. Click **DOWNLOAD** button
4. Save the `.msi` file

### STEP 2: Install MongoDB

1. **Run the downloaded `.msi` file**
2. Click through the installer:

   - Accept License
   - Choose **Complete** installation
   - Click **Next**

3. **IMPORTANT - Service Configuration**:

   - ✅ Check "Install MongoDB as a Service"
   - Keep default service name
   - Click **Next**
   - ✅ Check "Run the MongoDB service"
   - Click **Install**

4. Wait for installation to complete (~2 minutes)

### STEP 3: Verify Installation

Open PowerShell and run:

```powershell
mongod --version
```

You should see something like:

```
db version v8.0.0
```

### STEP 4: Start MongoDB Service

MongoDB should auto-start, but to verify:

```powershell
Get-Service MongoDB
```

Should show: `Status: Running`

If not running:

```powershell
Start-Service MongoDB
```

### STEP 5: Restart Your Backend Server

```powershell
cd E:\Airhop-project-main\backend
node server.js
```

You should now see:

```
✅ Connected to MongoDB
🌤️ Connected to OpenWeather API successfully!
```

---

## Alternative: Use MongoDB Atlas (Cloud)

Your credentials are already set up! Just whitelist your IP:

1. Go to: **https://account.mongodb.com/account/login**
2. Login with your credentials
3. Click your cluster: **"Cluster0"**
4. Go to **Security** → **Network Access**
5. Click **Add IP Address**
6. Choose **Allow Access from Anywhere** (for development)
7. Click **Confirm**

Wait 2-3 minutes, then update `.env.local`:

```properties
# Use Atlas instead of local
MongoDB_URI=mongodb+srv://warp012346_db_user:Wb3wgIAWGmz0JYN6@cluster0.glvubtl.mongodb.net/?appName=Cluster0&retryWrites=false
```

Then restart backend:

```powershell
cd E:\Airhop-project-main\backend
node server.js
```

---

## Troubleshooting

### "mongod: command not found"

- MongoDB is not installed
- Follow **STEP 1-2** above

### "MongoDB service not running"

- Run: `Start-Service MongoDB`
- If error, reinstall MongoDB

### "Connect ECONNREFUSED"

- MongoDB process is stopped
- Run: `Start-Service MongoDB`

### "Port 27017 already in use"

- Stop other MongoDB: `Stop-Service MongoDB`
- Or use different port in backend/.env

---

## Quick Check: Is MongoDB Running?

```powershell
# Check service status
Get-Service MongoDB | Select-Object Name, Status

# Output should be:
# Name    Status
# ----    ------
# MongoDB Running
```

---

## 🚀 After MongoDB is Running

### Terminal 1: Start Backend

```powershell
cd E:\Airhop-project-main\backend
node server.js
```

### Terminal 2: Start Frontend

```powershell
cd E:\Airhop-project-main
pnpm dev
```

### Terminal 3: Open Browser

```
http://localhost:3000
```

### Test the App

1. Sign up with email
2. Search for a route (e.g., Delhi to Mumbai)
3. View search history
4. Delete searches

---

## Getting Help

**Still having issues?**

Check these files:

- `QUICK_MONGODB_FIX.md` - Quick reference
- `backend/.env` - MongoDB URI configuration
- `.env.local` - Frontend configuration

---

**You're just one installation away from full project functionality!** 🚀
