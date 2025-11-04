# IMMEDIATE SOLUTION: Get MongoDB Running in 2 Minutes

## Option A: Use MongoDB Atlas (Cloud) - RECOMMENDED FOR YOUR CASE

Your credentials are already set up! Just whitelist your IP address:

### Step 1: Login to MongoDB Atlas

1. Go to: https://account.mongodb.com/account/login
2. Use your existing account (credentials are in your .env files)
3. Click your cluster "Cluster0"

### Step 2: Add Your IP Address

1. Click "Security" in left menu
2. Click "Network Access"
3. Click "Add IP Address"
4. Click "Allow Access from Anywhere" (for development)
5. Click "Confirm"

### Step 3: Test Connection

Wait 2-3 minutes, then restart your backend:

```powershell
cd E:\Airhop-project-main\backend
node server.js
```

You should see: `✅ Connected to MongoDB`

---

## Option B: Local MongoDB with Docker (If Docker Installed)

If you have Docker Desktop installed:

```powershell
docker run -d -p 27017:27017 --name airhop-mongo mongo:latest
```

Then restart backend:

```powershell
cd E:\Airhop-project-main\backend
node server.js
```

---

## Option C: Download MongoDB Community (Takes 10 minutes)

### Windows Step-by-Step:

1. **Download MongoDB**:

   - Visit: https://www.mongodb.com/try/download/community
   - Select: Windows, Latest version
   - Click Download

2. **Run Installer**:

   - Open downloaded `.msi` file
   - Choose "Complete" installation
   - **IMPORTANT**: Enable:
     - ✅ "Install MongoDB as a Service"
     - ✅ "Run service as Network Service user"
   - Click "Install"

3. **Verify Installation**:

   ```powershell
   # In new PowerShell window:
   Get-Service MongoDB

   # Should show: Status: Running
   ```

4. **Restart Backend**:
   ```powershell
   cd E:\Airhop-project-main\backend
   node server.js
   ```

---

## QUICK FIX: Try Option A First (Easiest)

Your credentials are ready. Just:

1. Whitelist your IP in MongoDB Atlas (takes 1 minute)
2. Restart backend
3. Done!

Let me know which option you want to try!
