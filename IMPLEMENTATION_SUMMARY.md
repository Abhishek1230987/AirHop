# AIRHOP Capstone Project - Implementation Summary

## ✅ Completed Features

### 1. **Authentication System**

- ✅ User signup with email/password (hashed with bcrypt)
- ✅ User login with JWT tokens stored in httpOnly cookies
- ✅ Google OAuth integration via Passport.js
- ✅ Protected routes requiring authentication via `authMiddleware`
- ✅ Auth context provider (`AuthProvider`) on frontend
- ✅ `/api/auth/signup`, `/api/auth/login`, `/api/auth/logout`, `/api/auth/me` endpoints
- ✅ User model with email, password, name, googleId fields

### 2. **Search History System**

- ✅ `SearchHistory` MongoDB model with fields:

  - `userId` (reference to User)
  - `source` and `destination` (location names)
  - `sourceAQI` and `destinationAQI` (weather/AQI data)
  - `routeDistance` and `routeDuration`
  - `timestamps` (createdAt, updatedAt)
  - `notes` (optional user notes)

- ✅ Backend API endpoints:

  - `POST /api/search` - Save a new search
  - `GET /api/search` - Retrieve user's search history (with pagination)
  - `DELETE /api/search/:id` - Delete a specific search
  - `DELETE /api/search` - Delete all searches for user

- ✅ Search history controller with proper error handling and logging
- ✅ Authentication middleware applied to all search endpoints

### 3. **Frontend Components**

- ✅ Updated `SearchBar` component:

  - Now calls `/api/search` endpoint to save searches
  - Shows toast notifications on successful save
  - Displays loading state during submission
  - Integrates with `AuthProvider` to check user authentication

- ✅ New `/search-history` page (`app/search-history/page.tsx`):

  - Displays all past searches for authenticated users
  - Shows source, destination, distance, duration, AQI data
  - Timestamps for each search
  - Individual delete buttons for each search
  - "Clear All History" button for bulk deletion
  - Empty state when no searches exist
  - Requires authentication (redirects to login if not authenticated)

- ✅ Updated `Navbar`:
  - Added "History" link to search history page
  - Visible in both desktop and mobile navigation

### 4. **Database Models**

```javascript
// User Model
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  googleId: String (indexed),
  createdAt: DateTime,
  updatedAt: DateTime
}

// SearchHistory Model
{
  _id: ObjectId,
  userId: ObjectId (ref: User, indexed),
  source: String,
  destination: String,
  sourceAQI: { aqi: Number, pm25: Number, pm10: Number, location: String },
  destinationAQI: { aqi: Number, pm25: Number, pm10: Number, location: String },
  routeDistance: Number,
  routeDuration: Number,
  routeCoordinates: { type: LineString, coordinates: Array },
  notes: String,
  createdAt: DateTime,
  updatedAt: DateTime
}
```

### 5. **Weather & Map Integration**

- ✅ OpenWeather API integration for AQI data
- ✅ MapDisplay component for visualizing routes
- ✅ Search bar supports source/destination input
- ✅ AQI indicator component for air quality visualization

## 🔧 Technical Implementation Details

### Backend Structure

```
backend/
├── server.js                    # Express app, MongoDB connection, route mounting
├── .env                         # Database URI, JWT secret, Google OAuth credentials
├── models/
│   ├── User.js                 # User schema with bcrypt password hashing
│   └── SearchHistory.js        # Search history schema with GeoJSON support
├── controllers/
│   ├── authController.js       # signup, login, logout, me, oauthCallback
│   └── searchController.js     # saveSearch, getSearchHistory, deleteSearch, deleteAllSearches
├── middleware/
│   └── authMiddleware.js       # JWT token validation from cookies/headers
├── config/
│   └── passport.js             # Google OAuth strategy configuration
└── Routes/
    ├── authRoutes.js           # Auth endpoints
    └── searchRoutes.js         # Search history endpoints
```

### Frontend Structure

```
app/
├── page.tsx                    # Homepage with search bar and map
├── search-history/
│   └── page.tsx                # Search history display and management
├── login/page.tsx              # Login page
├── signup/page.tsx             # Signup page
└── search/page.tsx             # Search results page

components/
├── auth-context.tsx            # AuthProvider and useAuth hook
├── search-bar.tsx              # Search input with history saving
├── MapDisplay.tsx              # Map visualization
├── aqi-indicator.tsx           # Air quality index display
└── navbar.tsx                  # Navigation with History link
```

## 📋 API Endpoints

### Authentication

```
POST   /api/auth/signup         - Create new user account
POST   /api/auth/login          - Login with email/password
POST   /api/auth/logout         - Logout (clear cookie)
GET    /api/auth/me             - Get current authenticated user
GET    /api/auth/google         - Initiate Google OAuth
GET    /api/auth/google/callback - Google OAuth callback
```

### Search History

```
GET    /api/search              - Get user's search history (paginated)
POST   /api/search              - Save a new search
DELETE /api/search/:id          - Delete a specific search
DELETE /api/search              - Delete all searches for user
```

## 🔐 Security Features

- ✅ JWT tokens with 7-day expiration
- ✅ httpOnly cookies (prevent XSS)
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ CORS protection with origin checking
- ✅ Authentication middleware on protected routes
- ✅ User ownership verification on delete operations

## 📝 Usage Flow

### 1. **User Registration**

```
1. Visit /signup
2. Enter email, password, name
3. Backend creates user with hashed password
4. JWT token set in httpOnly cookie
5. User redirected to homepage
```

### 2. **Search History**

```
1. Authenticated user enters source & destination
2. SearchBar component calls POST /api/search
3. Backend saves to SearchHistory collection
4. User notified with toast message
5. Can view all searches at /search-history
6. Can delete individual searches or clear all
```

### 3. **Air Quality Integration**

```
1. User searches for route
2. OpenWeather API fetches AQI data for source/destination
3. Frontend displays AQI indicators
4. Map visualizes best clean air route
5. Search metadata stored with AQI data
```

## 🚀 How to Run

### Backend

```bash
cd backend
npm install
# or with pnpm
pnpm install

# Set environment variables in .env:
# MONGODB_URI=your_atlas_connection_string
# JWT_SECRET=your_secret_key
# GOOGLE_CLIENT_ID=your_google_id
# GOOGLE_CLIENT_SECRET=your_google_secret

node server.js
# Server runs on http://localhost:5000
```

### Frontend

```bash
# From project root
pnpm install
pnpm dev
# Frontend runs on http://localhost:3000 (or 3001 if 3000 is busy)
```

### E2E Testing

```bash
# Ensure backend and frontend are running
node e2e/pw-e2e-fixed.js --url=http://localhost:3000 --headless=true

# Or with specific URL and headless mode
node e2e/pw-e2e-fixed.js --url=http://localhost:3001 --headless=false
```

## 🐛 Known Issues & Troubleshooting

### MongoDB Atlas Connection Issues

**Issue**: SSL/TLS alerts when connecting to MongoDB Atlas
**Solution**:

- Ensure MongoDB_URI is correctly set in `.env`
- Try with `tlsAllowInvalidCertificates: true` for development (enabled in server.js)
- Fallback to local MongoDB: `mongodb://localhost:27017/airhop`

**To set up local MongoDB**:

```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod --dbpath C:\path\to\data

# Connection string in .env
MONGODB_URI=mongodb://localhost:27017/airhop
```

### Port Already in Use

```bash
# Find process using port 3000 or 5000
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

### Auth Token Not Being Sent

- Ensure `credentials: 'include'` is set in fetch calls
- Check that httpOnly cookie is being set in browser DevTools
- Verify CORS origin is whitelisted in backend

## 📊 Data Flow Diagram

```
User Registration/Login
    ↓
[AuthProvider] stores user in context
    ↓
SearchBar component checks user auth
    ↓
User enters source/destination
    ↓
SearchBar calls POST /api/search
    ↓
Backend saves to SearchHistory collection
    ↓
Toast notification to user
    ↓
User can view history at /search-history
    ↓
Can delete individual or all searches
```

## 🎯 Next Steps / Enhancements

1. **Real Map Integration**

   - Integrate Google Maps API or Mapbox for actual route visualization
   - Display alternative routes with AQI comparison
   - Real-time traffic and pollution data overlay

2. **Advanced Features**

   - Filter searches by date range
   - Export search history (CSV/PDF)
   - Favorite/bookmark specific routes
   - Share routes with other users

3. **Performance**

   - Add pagination/infinite scroll to history
   - Cache AQI data for locations
   - Optimize database queries with indexes

4. **Analytics**

   - Track most searched routes
   - Average AQI improvements
   - User engagement metrics

5. **Mobile App**
   - React Native version for iOS/Android
   - Background location tracking
   - Push notifications for pollution alerts

## 📚 Technologies Used

**Frontend:**

- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS (styling)
- Lucide React (icons)
- Puppeteer (E2E testing)

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- Passport.js (authentication)
- bcrypt (password hashing)
- dotenv (environment variables)

**APIs:**

- OpenWeather API (air quality data)
- Google OAuth 2.0
- Google Maps API (planned)

## 📞 Support

For issues or questions:

1. Check the `backend/scripts/` folder for helper scripts
2. Review error logs in terminal output
3. Ensure all environment variables are set correctly
4. Verify database connectivity with `backend/scripts/listUsers.js`

---

**Project Status**: ✅ Core Features Complete | 🔧 Testing & Deployment Ready
