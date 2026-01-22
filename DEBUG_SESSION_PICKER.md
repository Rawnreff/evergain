# 🔍 Session Picker Debug Guide

## What I Changed:

1. ✅ Added **"Loading Sessions..."** screen in modal
2. ✅ Shows API URL being used
3. ✅ Added **"Retry Loading"** button
4. ✅ Auto-reload when modal opens and empty  
5. ✅ Console logs for debugging

---

## How to Debug:

### 1. **Reload the App**
Press `r` in Metro bundler terminal

### 2. **Check Console Logs**

When you open the app, you should see:
```
🚀 Logger screen mounted
📡 API_URL: http://10.0.2.2:8080/api
Loading session types from: http://10.0.2.2:8080/api/sessions/types/categorized
Session types loaded: 10 categories
```

### 3. **Open Session Picker**

Tap "Start Workout Session" button.

**If modal is empty**, you'll see:
- "Loading Sessions..."
- "Connecting to: http://10.0.2.2:8080/api"
- "Retry Loading" button
- "Check console for error messages"

### 4. **Check Console Again**

Look for:
```
📋 Session picker opened but empty, loading session types...
Loading session types from: ...
```

---

## What Each Message Means:

### ✅ SUCCESS:
```
Session types loaded: 10 categories
```
→ **Good!** Data loaded, modal will show sessions

### ❌ ERROR:
```
Failed to load session types: [TypeError: Network request failed]
```
→ **Wrong API_URL** for your platform

```
Failed to load session types: [Error: HTTP 404: Not Found]
```
→ **Backend route issue**

```
Connection Error alert appears
```
→ **Can't reach backend**

---

## Quick Fixes:

### If you see "Network request failed":

**1. Check your platform:**
   - Running on **Android Emulator**? → Use `http://10.0.2.2:8080/api`
   - Running on **iOS Simulator**? → Use `http://localhost:8080/api`
   - Running on **Physical Device**? → Use `http://YOUR_IP:8080/api`

**2. Update logger.tsx line 11:**
```typescript
const API_URL = 'http://10.0.2.2:8080/api'; // ← Change this
```

**3. Reload app** (press `r`)

---

### If modal shows "Loading Sessions..." forever:

**1. Check if backend is running:**
```bash
curl http://localhost:8080/
```

Should return: `{"status": "running", ...}`

**2. Test the endpoint directly:**
```bash
curl http://localhost:8080/api/sessions/types
```

Should return JSON array with sessions

**3. Tap "Retry Loading"** button in modal

---

### If you see HTTP 404 or 500 errors:

**Backend issue** - check terminal running `python app.py` for errors

---

## Expected Behavior When Working:

1. **App loads** → Console shows: "Session types loaded: 10 categories"
2. **Tap "Start Workout Session"** → Modal opens
3. **Modal shows categories:**
   - Split
   - Goal  
   - Isolation
   - Recovery
   - Specialty
   - Full Body
   - Movement Pattern
   - Regional
   - Variation
   - Antagonist
4. **Each category has session cards** with gradients
5. **Tap a session** → Session starts!

---

## Console Commands to Test:

### Test from your device/emulator:

**Android Emulator:**
```bash
adb shell am start -a android.intent.action.VIEW -d "http://10.0.2.2:8080/api/sessions/types"
```

**iOS Simulator:**
```bash
xcrun simctl openurl booted "http://localhost:8080/api/sessions/types"
```

---

## Still Not Working?

### Enable remote debugging:
1. Shake device/emulator
2. Tap "Debug"
3. Open Chrome DevTools
4. Check Network tab for failed requests
5. See exact error message

### Check backend logs:
Look at terminal running `python app.py` - any errors there?

---

## Most Common Issue:

**Using wrong API_URL!**

| Platform | Correct URL |
|----------|-------------|
| Android Emulator | `http://10.0.2.2:8080/api` |
| iOS Simulator | `http://localhost:8080/api` |
| Physical Device | `http://YOUR_COMPUTER_IP:8080/api` |

---

**After fixing API_URL, reload app and try again!** 🚀
