# MongoDB Local Setup Guide for AIRHOP Project

## Problem

Your network/firewall is blocking MongoDB Atlas SSL/TLS connections. The solution is to use a **local MongoDB installation**.

## Option 1: MongoDB Community Edition (Recommended for Development)

### Windows Installation

#### Step 1: Download MongoDB Community Edition

1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - **Version**: Latest (e.g., 7.0 or later)
   - **OS**: Windows
   - **Package**: MSI
3. Click Download

#### Step 2: Run the Installer

1. Run the `.msi` file you downloaded
2. Choose **Complete** installation
3. **Important**: When prompted, check:
   - ✅ **Install MongoDB as a Service**
   - ✅ **Run the MongoDB service**
4. Click Install
5. MongoDB will automatically start as a Windows Service

#### Step 3: Verify Installation

Run this in PowerShell:

```powershell
mongod --version
```

You should see output like:

```
db version v7.0.0
```

#### Step 4: Verify MongoDB is Running

Run this in PowerShell:

```powershell
Get-Service MongoDB
```

Look for Status: **Running**

If not running, start it:

```powershell
Start-Service MongoDB
```

### Alternative: Run MongoDB Manually (Without Service)

If you don't want MongoDB running as a service, you can start it manually each time:

1. Create a data directory:

```powershell
mkdir C:\data\db
```

2. Start MongoDB:

```powershell
mongod --dbpath C:\data\db
```

Keep this terminal window open while developing.

---

## Option 2: Docker (If You Have Docker Installed)

If you have Docker installed, run MongoDB in a container:

```powershell
docker run -d -p 27017:27017 --name airhop-mongodb mongo:latest
```

To stop it later:

```powershell
docker stop airhop-mongodb
```

---

## Step 5: Update Backend Configuration

Your `.env` file is already configured for local MongoDB:

```properties
MongoDB_URI=mongodb://localhost:27017/airhop
MONGODB_URI=mongodb://localhost:27017/airhop
```

This should work once MongoDB is running locally.

---

## Step 6: Start Your Backend Server

```powershell
cd E:\Airhop-project-main\backend
node server.js
```

You should see:

```
✅ Server running on port 5000
✅ Connected to MongoDB
🌤️ Connected to OpenWeather API successfully!
```

---

## Troubleshooting

### "Connect ECONNREFUSED 127.0.0.1:27017"

**Solution**: MongoDB is not running. Start it:

```powershell
Start-Service MongoDB
# or manually: mongod --dbpath C:\data\db
```

### "mongod: command not found"

**Solution**: MongoDB is not installed or not in PATH

- Reinstall MongoDB Community Edition
- Or add MongoDB to your system PATH

### Port 27017 is Already in Use

**Solution**: Change the port in `.env`:

```properties
MongoDB_URI=mongodb://localhost:27018/airhop
```

Then run MongoDB on that port:

```powershell
mongod --dbpath C:\data\db --port 27018
```

---

## GUI Tools to Manage MongoDB (Optional)

### MongoDB Compass (Official)

1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://localhost:27017`
3. Browse databases, collections, and documents visually

### VS Code Extension

- Install: MongoDB extension by MongoDB
- Connect to local MongoDB
- Query and manage data directly from VS Code

---

## Once MongoDB is Running

Your AIRHOP project will have full functionality:

- ✅ User authentication
- ✅ Search history storage
- ✅ Search history retrieval
- ✅ Delete search history

---

## Next Steps

1. **Install MongoDB Community Edition** (Option 1 recommended)
2. **Verify it's running**: `mongod --version` and `Get-Service MongoDB`
3. **Restart your backend server**: `node server.js` from `backend/` folder
4. **Start frontend**: `pnpm dev` from root folder
5. **Test the app**: http://localhost:3000

If you have any issues, provide the error message and I'll help troubleshoot!
