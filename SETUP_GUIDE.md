# 🚀 Quick Setup Guide - EverGain Logger

## Prerequisites
- Backend server running on port 8080
- MongoDB running locally
- React Native development environment set up

---

## 📋 Step-by-Step Setup

### 1. **Seed the Database**

```bash
cd backend
python seed_exercises.py
```

**Expected Output:**
```
🌱 Starting database seeding...
✅ Connected to MongoDB database: evergain
🗑️  Cleared X existing exercises
✅ Successfully seeded 71 exercises
✅ Successfully seeded 31 session types
🎉 Seeding complete!
```

---

### 2. **Start Backend Server**

```bash
cd backend
python app.py
```

**Expected Output:**
```
🚀 Starting EverGain Backend on port 8080
✅ MongoDB connection initialized
 * Running on http://0.0.0.0:8080
```

---

### 3. **Configure Frontend API URL**

Open `evergain\app\(tabs)\logger.tsx` and update the API_URL:

#### For Windows + Android Emulator:
```typescript
const API_URL = 'http://10.0.2.2:8080/api';
```

#### For Mac/Windows + iOS Simulator:
```typescript
const API_URL = 'http://localhost:8080/api';
```

#### For Physical Device:
1. Find your computer's IP address:
   - Windows: `ipconfig` (look for IPv4)
   - Mac: `ifconfig` (look for inet)
   
2. Update API_URL:
```typescript
const API_URL = 'http://YOUR_IP_ADDRESS:8080/api';
// Example: const API_URL = 'http://192.168.1.100:8080/api';
```

---

### 4. **Start Frontend**

```bash
cd evergain
npx expo start
```

Then:
- Press `a` for Android
- Press `i` for iOS
- Scan QR code for physical device

---

## 🧪 Test the Integration

### Test 1: Session Picker
1. Open the logger tab
2. Tap "Start Workout Session"
3. Modal should show all session types categorized
4. Select "Push"
5. Session should start successfully

### Test 2: Exercise Picker
1. With active session, tap exercise selector
2. Should see only Push exercises (25-30 exercises)
3. Exercises grouped by muscle (Chest, Shoulders, Triceps)
4. Select "Bench Press"
5. Exercise should be selected

### Test 3: Rest Timer
1. Long press rest timer button
2. Settings modal opens
3. Select different preset or enter custom value
4. Tap "Set Duration"
5. Modal closes

### Test 4: Log Set
1. Enter weight: 60
2. Enter reps: 8
3. Volume should show "480 kg"
4. Tap "Log Set"
5. Alert shows "Set Logged!"
6. Rest timer starts automatically

### Test 5: End Session
1. Tap stop button in session card
2. Confirmation appears
3. Tap "End Session"
4. Summary shows duration, sets, volume
5. Session clears

---

## 🐛 Troubleshooting

### Problem: "Failed to check active session"

**Solution:**
- Check if backend server is running
- Verify API_URL is correct for your setup
- Check network connection
- Look at backend console for errors

### Problem: "No exercises showing in picker"

**Solution:**
- Verify database was seeded successfully
- Check backend logs for API errors
- Test endpoint: `http://localhost:8080/api/sessions/exercises?session_type=Push`

### Problem: Rest timer not counting down

**Solution:**
- Check console for JavaScript errors
- Ensure timer state is properly initialized
- Restart the app

### Problem: "Invalid session type" error

**Solution:**
- Ensure session types were seeded
- Test endpoint: `http://localhost:8080/api/sessions/types`
- Re-run seed script

---

## 📱 Network Configuration

### Android Emulator Setup:
The Android emulator treats `localhost` as the emulator itself, not your host machine.

**Use this instead:**
```typescript
const API_URL = 'http://10.0.2.2:8080/api';
```

### Firewall Issues:
If using physical device, ensure:
1. Device and computer on same Wi-Fi network
2. Firewall allows port 8080
3. CORS is enabled in backend (already configured)

---

## 🔍 Debugging Tips

### Check Backend Status:
```bash
curl http://localhost:8080/
```

Should return:
```json
{
  "status": "running",
  "message": "EverGain Backend is running!",
  "version": "2.0.0",
  "tech_stack": "Flask + MongoDB"
}
```

### Test Session API:
```bash
# In backend folder
python test_session_api.py
```

### Check MongoDB Data:
```bash
mongosh
use evergain
db.exercises.count()  # Should show 71
db.session_types.count()  # Should show 31
```

### React Native Debugging:
- Open Metro bundler console for errors
- Use React Native Debugger
- Check device logs with `adb logcat` (Android)

---

## 📊 Expected Data Counts

After successful setup:

| Collection | Count |
|------------|-------|
| exercises | 71 |
| session_types | 31 |
| sessions | 0 (empty initially) |
| workouts | 0 (empty initially) |
| users | 1 (if seeded) |

---

## ✅ Success Checklist

- [ ] Backend server running on port 8080
- [ ] MongoDB running and accessible
- [ ] Database seeded with 71 exercises
- [ ] Database seeded with 31 session types
- [ ] Frontend API_URL configured correctly
- [ ] Expo development server running
- [ ] Logger screen loads without errors
- [ ] Can start a workout session
- [ ] Session picker shows categorized types
- [ ] Exercise picker shows filtered exercises
- [ ] Rest timer works
- [ ] Can log sets
- [ ] Can end session

---

## 🎯 Next Steps

Once everything is working:

1. **Test all session types**
   - Try Push, Pull, Legs
   - Test specialty sessions
   - Verify exercise filtering works for each

2. **Test full workout flow**
   - Start session
   - Log multiple exercises
   - Use rest timer
   - End session
   - Verify stats

3. **Customize**
   - Adjust default rest timer (currently 90s)
   - Modify color schemes
   - Add/remove session types
   - Customize UI elements

4. **Integrate workout logging**
   - Connect to `/api/workouts` endpoint
   - Save set data to database
   - Load previous workout data
   - Implement progression tracking

---

## 📚 Additional Resources

- **Backend API Docs**: `backend/SESSION_MANAGEMENT.md`
- **Exercise Reference**: `backend/SESSION_REFERENCE.md`
- **Logger Features**: `evergain/LOGGER_FEATURES.md`
- **Flask Documentation**: https://flask.palletsprojects.com/
- **React Native Docs**: https://reactnative.dev/

---

## 🆘 Need Help?

If you encounter issues:

1. Check the logs (backend console + Metro bundler)
2. Verify all services are running
3. Test API endpoints manually with curl
4. Review error messages carefully
5. Ensure all dependencies are installed

---

**Happy Coding! 🚀💪**
