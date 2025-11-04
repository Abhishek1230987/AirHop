# MongoDB Atlas Cluster Setup Guide

## QUICK SETUP (5 Minutes)

### Step 1: Create MongoDB Atlas Account (if you don't have one)

1. Go to: https://www.mongodb.com/cloud/atlas
2. Click **Sign Up**
3. Fill in your email and create a password
4. Verify your email
5. Log in to your account

### Step 2: Create a New Cluster

1. In MongoDB Atlas dashboard, click **Create**
2. Choose **Database Deployment**
3. Select **Build a Cluster**
4. Choose **Free** tier (M0 - good for development)
5. Select your preferred **Cloud Provider** (AWS, Google Cloud, or Azure)
6. Select a **Region** closest to you
7. Click **Create Cluster**
8. Wait 3-5 minutes for cluster to deploy ⏳

### Step 3: Set Up Network & User Access

#### Network Access

1. Click **Network Access** in the left menu
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (for development only!)
4. Confirm

#### Database User

1. Click **Database Access** in the left menu
2. Click **Add New Database User**
3. **Username**: `airhop_user`
4. **Password**: Create a strong password (copy it down!)
5. **Database User Privileges**: Select `Read and write to any database`
6. Click **Add User**

### Step 4: Get Connection String

1. Click **Databases** in the left menu
2. Your new cluster should appear - click **Connect**
3. Click **Drivers**
4. Select **Node.js** as driver
5. Copy the connection string (it looks like: `mongodb+srv://airhop_user:PASSWORD@cluster.mongodb.net/airhop?retryWrites=true&w=majority`)
6. **Replace `PASSWORD` with the password you created in Step 3**

### Step 5: Update Environment File

Replace `PASSWORD` in this string with your actual password:

```
mongodb+srv://airhop_user:PASSWORD@cluster.mongodb.net/airhop?retryWrites=true&w=majority
```

## Your Connection String Format

Once you have it, it should look like:

```
mongodb+srv://airhop_user:YourActualPassword123@cluster0.abc123.mongodb.net/airhop?retryWrites=true&w=majority
```

## Next Steps

1. Provide the connection string to me
2. I'll update your `.env.local` file
3. Restart the backend
4. Everything will work!

## Troubleshooting

### "Authentication failed"

- Check the password is correct (copy from Step 3)
- Verify username is `airhop_user`

### "Connection timeout"

- Make sure you added your IP in Network Access
- Try "Allow Access from Anywhere"

### "Database doesn't exist"

- MongoDB creates database automatically on first write
- Don't worry, it will be created when you use the app

---

**Once you complete these steps, send me your connection string and I'll handle the rest!**
