# EverGain Quick Start Guide

## Prerequisites

1. **MongoDB** - Must be installed and running
2. **Python 3.8+** - For the backend
3. **Node.js & npm** - For the frontend
4. **Expo CLI** - For running the mobile app

## Backend Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure Environment

Create a `.env` file in the `backend` directory (or use `.env.example` as template):

```env
MONGODB_URI=mongodb://localhost:27017/evergain
JWT_SECRET=your_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
PORT=8080
FLASK_ENV=development
```

### 3. Seed the Database

```bash
cd backend
python seed_exercises.py
```

Expected output:
```
✅ Successfully seeded 71 exercises
✅ Successfully seeded 31 session types
```

### 4. Start the Backend Server

```bash
cd backend
python app.py
```

Expected output:
```
✅ MongoDB connection initialized
🚀 Starting EverGain Backend on port 8080
 * Running on http://192.168.1.4:8080
```

**Important:** Keep this terminal window open! The backend must be running for the app to work.

### 5. Test the Backend (Optional)

```bash
cd backend
python test_all_endpoints.py
```

You should see all tests passing.

## Frontend Setup

### 1. Install Dependencies

```bash
cd evergain
npm install
```

### 2. Update API URL

Find your computer's IP address:
- **Windows:** `ipconfig` (look for IPv4 Address)
- **Mac/Linux:** `ifconfig` or `ip addr`

Update the API URL in `evergain/app/(tabs)/logger.tsx`:

```typescript
const API_URL = 'http://YOUR_IP_ADDRESS:8080/api';
```

Replace `YOUR_IP_ADDRESS` with your actual IP (e.g., `192.168.1.4`).

### 3. Start the Frontend

```bash
cd evergain
npx expo start
```

### 4. Run on Device/Emulator

- **Android Emulator:** Press `a`
- **iOS Simulator:** Press `i`
- **Physical Device:** Scan the QR code with Expo Go app

## Troubleshooting

### Backend Issues

**Problem:** "Cannot connect to MongoDB"
- **Solution:** Make sure MongoDB is running: `mongod` or start MongoDB service

**Problem:** "Port 8080 already in use"
- **Solution:** Change the port in `backend/config.py` or kill the process using port 8080

**Problem:** "No exercises found"
- **Solution:** Run the seed script: `cd backend && python seed_exercises.py`

### Frontend Issues

**Problem:** "Network request failed" or "Connection Error"
- **Solution:** 
  1. Make sure backend is running
  2. Check that the API URL in `logger.tsx` matches your computer's IP
  3. Make sure your phone/emulator is on the same network as your computer

**Problem:** "HTTP 500 error when loading exercises"
- **Solution:** 
  1. Check backend logs for errors
  2. Restart the backend server
  3. Run `python test_all_endpoints.py` to verify backend is working

## Development Workflow

1. **Start MongoDB** (if not already running)
2. **Start Backend:** `cd backend && python app.py`
3. **Start Frontend:** `cd evergain && npx expo start`
4. **Make changes** and test
5. **Backend changes:** Server auto-reloads
6. **Frontend changes:** App auto-refreshes

## Testing

### Backend Tests

```bash
cd backend
python test_all_endpoints.py
```

### Direct Database Test

```bash
cd backend
python test_exercises_endpoint.py
```

## Common Commands

### Backend

```bash
# Start server
python app.py

# Seed database
python seed_exercises.py

# Run tests
python test_all_endpoints.py
```

### Frontend

```bash
# Start Expo
npx expo start

# Clear cache and restart
npx expo start -c

# Run on Android
npx expo start --android

# Run on iOS
npx expo start --ios
```

## Project Structure

```
evergain/
├── backend/              # Flask backend
│   ├── app.py           # Main application
│   ├── config.py        # Configuration
│   ├── database/        # MongoDB connection
│   ├── models/          # Data models
│   ├── routes/          # API endpoints
│   ├── services/        # Business logic
│   └── seed_exercises.py # Database seeding
│
└── evergain/            # React Native frontend
    ├── app/             # Screens and navigation
    ├── components/      # Reusable components
    ├── services/        # API client
    └── constants/       # Theme and colors
```

## Next Steps

1. ✅ Backend is running
2. ✅ Database is seeded
3. ✅ Frontend is connected
4. 🎯 Start using the app!

Try starting a workout session and logging some exercises. Enjoy your fitness journey with EverGain! 💪
