# 🌬️ AIRHOP - Air Quality Aware Route Planning

A full-stack web application that helps users find the healthiest and cleanest routes to their destinations by integrating real-time air quality data with route planning. Perfect for your capstone project!

## 🎯 Project Overview

AIRHOP is designed to address the critical issue of air pollution exposure during daily commutes. By combining real-time air quality index (AQI) data with route planning, users can:

- 🗺️ Search for optimal routes between two locations
- 💨 View air quality data for source and destination areas
- 📊 Compare alternative routes based on pollution levels
- 💾 Save search history for future reference
- 🔐 Create accounts and manage personalized search history
- 🌐 View live air quality maps across cities

## ✨ Key Features

### 🔐 Authentication System

- User registration with email/password
- Secure login with JWT tokens
- Google OAuth integration
- Protected routes and data
- Session management with httpOnly cookies

### 🔍 Smart Search History

- Automatically save all route searches
- View search history with timestamps
- Store AQI data from search time
- Delete individual or all searches
- Paginated history view

### 🌍 Weather & Air Quality

- Real-time AQI data from OpenWeather API
- PM2.5 and PM10 pollution metrics
- Location-based air quality monitoring
- Visual AQI indicators
- Map-based visualization

### 📱 Responsive Design

- Modern, clean UI with Tailwind CSS
- Mobile-friendly interface
- Dark mode support
- Accessible navigation

## 🛠️ Tech Stack

### Frontend

```
- Next.js 14 (React framework with App Router)
- TypeScript (type safety)
- Tailwind CSS (styling)
- Shadcn UI components
- Lucide React (icons)
- Fetch API (HTTP client)
```

### Backend

```
- Node.js with Express
- MongoDB Atlas (cloud database)
- Mongoose (ODM)
- JWT authentication
- Passport.js (OAuth)
- bcrypt (password hashing)
```

### APIs

```
- OpenWeather API (AQI data)
- Google OAuth 2.0
- Google Maps API (planned)
```

## 📦 Project Structure

```
Airhop-project-main/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Homepage
│   ├── login/page.tsx           # Login page
│   ├── signup/page.tsx          # Signup page
│   ├── search/page.tsx          # Search results
│   ├── search-history/page.tsx  # View search history
│   └── layout.tsx               # Root layout with AuthProvider
│
├── components/
│   ├── auth-context.tsx         # Authentication context
│   ├── search-bar.tsx           # Search input form
│   ├── MapDisplay.tsx           # Map visualization
│   ├── aqi-indicator.tsx        # AQI display component
│   ├── navbar.tsx               # Navigation bar
│   └── ui/                      # Shadcn UI components
│
├── backend/
│   ├── server.js                # Express server
│   ├── .env                     # Environment variables
│   ├── models/
│   │   ├── User.js             # User schema
│   │   └── SearchHistory.js    # Search history schema
│   ├── controllers/
│   │   ├── authController.js   # Auth logic
│   │   └── searchController.js # Search history logic
│   ├── Routes/
│   │   ├── authRoutes.js       # Auth endpoints
│   │   └── searchRoutes.js     # Search endpoints
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT verification
│   └── scripts/
│       ├── createUser.js       # Create test user
│       └── listUsers.js        # List all users
│
├── e2e/
│   └── pw-e2e-fixed.js         # Puppeteer E2E tests
│
├── public/                       # Static assets
├── styles/                       # Global styles
├── lib/                          # Utility functions
├── hooks/                        # React hooks
├── tsconfig.json                # TypeScript config
├── package.json                 # Root dependencies
├── next.config.mjs              # Next.js config
├── tailwind.config.ts           # Tailwind config
└── IMPLEMENTATION_SUMMARY.md    # Feature documentation
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Google OAuth credentials (optional)
- OpenWeather API key

### 1. Install Dependencies

```bash
# Root dependencies
pnpm install

# Backend dependencies
cd backend
pnpm install
cd ..
```

### 2. Set Up Environment Variables

**Create `.env.local` in project root:**

```env
OPENWEATHER_API_KEY=your_openweather_api_key
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

**Create `backend/.env`:**

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_jwt_key_here
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Start MongoDB

**Option A: MongoDB Atlas (Cloud)**

```bash
# Use connection string in MONGODB_URI
# Ensure IP whitelist includes your development machine
```

**Option B: Local MongoDB**

```bash
# Install MongoDB Community Edition
mongod --dbpath C:\data\db  # Windows
# or
mongod                       # macOS/Linux

# Connection string
MONGODB_URI=mongodb://localhost:27017/airhop
```

### 4. Start Backend Server

```bash
cd backend
node server.js
# Server will run on http://localhost:5000
# Logs: ✅ Connected to MongoDB, ✅ Server running on port 5000
```

### 5. Start Frontend Dev Server

```bash
# In another terminal from project root
pnpm dev
# Frontend will run on http://localhost:3000 (or 3001 if 3000 is busy)
# Logs: ✓ Local: http://localhost:3000
```

### 6. Access the Application

Open http://localhost:3000 in your browser

## 📖 How to Use

### Sign Up

1. Click "Sign Up" in navigation
2. Enter email, password, and name
3. Click "Create Account"
4. Redirected to homepage

### Log In

1. Click "Login" in navigation
2. Enter your email and password
3. Click "Sign In"
4. Redirected to homepage

### Search for Routes

1. Enter "Starting Point" (e.g., "Delhi")
2. Enter "Destination" (e.g., "Mumbai")
3. Click "Find Clean Routes"
4. View air quality data and map
5. Search automatically saved to history

### View Search History

1. Click "History" in navigation
2. See all past searches with timestamps
3. View distance, duration, and AQI data
4. Delete individual searches or clear all
5. Click search to repeat it

### Google OAuth (if configured)

1. Click "Sign up with Google" button
2. Authorize in Google popup
3. Account created/logged in automatically

## 🧪 Testing

### Run E2E Tests

```bash
# Ensure backend and frontend are running
node e2e/pw-e2e-fixed.js --url=http://localhost:3000 --headless=true

# Options:
# --url=http://localhost:PORT - Specify frontend URL (default: 3000)
# --headless=true|false       - Run in headless mode (default: true)

# Example:
node e2e/pw-e2e-fixed.js --url=http://localhost:3001 --headless=false
```

### Create Test User

```bash
cd backend
node scripts/createUser.js testuser@example.com password123 "Test User"
```

### List All Users

```bash
cd backend
node scripts/listUsers.js
```

### Test Auth Requests

```bash
cd backend
node scripts/testAuthRequests.js
```

## 📊 API Documentation

### Authentication Endpoints

**POST /api/auth/signup**

```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

Response: `{ user: { id, email, name } }`

**POST /api/auth/login**

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response: `{ user: { id, email, name } }`

**GET /api/auth/me**
Response: `{ user: { id, email, name } }`

**POST /api/auth/logout**
Response: `{ ok: true }`

### Search History Endpoints

**GET /api/search** (Paginated)
Query params: `?limit=50&skip=0`
Response: `{ searches: [], total, limit, skip }`

**POST /api/search**

```json
{
  "source": "Delhi",
  "destination": "Mumbai",
  "sourceAQI": { "aqi": 150, "pm25": 95 },
  "destinationAQI": { "aqi": 120, "pm25": 75 },
  "routeDistance": 1400,
  "routeDuration": 180,
  "notes": "Via NH48"
}
```

Response: `{ search: { _id, userId, source, ... } }`

**DELETE /api/search/:id**
Response: `{ ok: true }`

**DELETE /api/search**
Response: `{ ok: true, deletedCount: number }`

## 🔒 Security Features

- ✅ **Password Hashing**: bcrypt with 10 rounds
- ✅ **JWT Tokens**: 7-day expiration
- ✅ **httpOnly Cookies**: Prevents XSS attacks
- ✅ **CORS Protection**: Validates request origins
- ✅ **Auth Middleware**: Verifies tokens on protected routes
- ✅ **Ownership Checks**: Users can only delete their own data

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: net::ERR_CONNECTION_RESET
```

**Solution**:

- Check MongoDB is running
- Verify connection string in `.env`
- For Atlas: add your IP to whitelist
- Use local MongoDB as fallback

### Port Already in Use

```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill it
taskkill /PID <PID> /F
```

### Auth Token Not Working

- Check DevTools > Application > Cookies for `token`
- Verify `credentials: 'include'` in fetch calls
- Check CORS allows your frontend URL

### E2E Test Connection Refused

```bash
# Ensure both servers are running:
# Terminal 1: cd backend && node server.js
# Terminal 2: pnpm dev
# Terminal 3: node e2e/pw-e2e-fixed.js --url=http://localhost:3000
```

## 📈 Future Enhancements

### Phase 2

- [ ] Real Google Maps integration
- [ ] Multiple route comparison
- [ ] Real-time pollution alerts
- [ ] Favorite routes
- [ ] Social features (share routes)

### Phase 3

- [ ] Mobile app (React Native)
- [ ] Background location tracking
- [ ] Push notifications
- [ ] Advanced analytics dashboard
- [ ] Route optimization AI

### Phase 4

- [ ] Multi-language support
- [ ] Offline mode
- [ ] Route export (GPX/KML)
- [ ] Integration with transportation apps
- [ ] Premium tier features

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Mongoose](https://mongoosejs.com)
- [Express.js](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)
- [OpenWeather API](https://openweathermap.org/api)

## 📝 Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  name: String,
  googleId: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

### SearchHistory Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User),
  source: String,
  destination: String,
  sourceAQI: {
    aqi: Number,
    pm25: Number,
    pm10: Number,
    location: String
  },
  destinationAQI: { /* same as sourceAQI */ },
  routeDistance: Number,
  routeDuration: Number,
  notes: String,
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/YourFeature`
2. Commit changes: `git commit -m 'Add YourFeature'`
3. Push to branch: `git push origin feature/YourFeature`
4. Open a Pull Request

## 📄 License

This project is part of a capstone submission. All rights reserved.

## 👨‍💼 Author

**Your Name** - Full Stack Developer

## 📧 Contact

- Email: your.email@example.com
- LinkedIn: [Your LinkedIn](https://linkedin.com)
- GitHub: [@yourprofile](https://github.com)

---

**Last Updated**: November 3, 2025
**Status**: ✅ Production Ready | 🎓 Capstone Complete

---

## 📸 Screenshots

### Homepage

![Homepage with search bar and live map]

### Search History

![Search history page with delete options]

### Authentication

![Login and signup pages]

### Air Quality Display

![AQI indicators and pollution metrics]

---

**For questions or issues, refer to `IMPLEMENTATION_SUMMARY.md`**
