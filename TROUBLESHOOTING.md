# 🔧 Troubleshooting: "Can't Select Workout Session"

## ✅ Diagnostic Results

The backend API is **working correctly**:
- ✅ Backend server running on port 8080
- ✅ Session types API returning data (31 types)
- ✅ Categorized endpoint working (10 categories)
- ✅ All endpoints responding successfully

---

## 🔍 Possible Causes

Since the backend works, the issue is likely in the **frontend**:

### 1. **Wrong API URL for Your Platform**

#### Current Setting:
```typescript
const API_URL = 'http://10.0.2.2:8080/api';
```

This works for **Android Emulator** only!

#### Change Based on Your Platform:

**If using iOS Simulator:**
```typescript
const API_URL = 'http://localhost:8080/api';
```

**If using Physical Device:**
1. Find your computer's IP:
   ```bash
   ipconfig
   ```
2. Use that IP:
   ```typescript
   const API_URL = 'http://192.168.x.x:8080/api';
   ```

---

### 2. **Modal Opens But Is Empty**

If the modal opens but shows no session types:

**Check React Native console for:**
- "Loading session types from..." log
- "Session types loaded: X categories" log
- Any error messages

**If you see errors:**
- Network request failed → Wrong API_URL
- HTTP 404 → Backend route issue
- Connection refused → Backend not running

---

### 3. **Modal Doesn't Open At All**

If tapping "Start Workout Session" does nothing:

**Possible issues:**
- Touch event not firing
- Modal state not updating
- UI rendering issue

**Try this:** Reload the app (Press `r` in Metro bundler)

---

## 🛠️ Quick Fix Steps

### Step 1: Check Your Console
Open React Native console and look for:
```
Loading session types from: http://10.0.2.2:8080/api/sessions/types/categorized
Session types loaded: 10 categories
```

### Step 2: Test API URL
In your browser or Postman, try:
```
http://10.0.2.2:8080/api/sessions/types/categorized
```

Should return JSON with categories.

### Step 3: Verify Platform
**Are you using:**
- [ ] Android Emulator → Keep `10.0.2.2`
- [ ] iOS Simulator → Change to `localhost`
- [ ] Physical Device → Change to your IP

### Step 4: Add Debug Button

Add this temporary code to see if API is reachable:

```typescript
// Add this near the top of logger.tsx, after the imports
const testAPI = async () => {
  try {
    const response = await fetch('http://10.0.2.2:8080/api/sessions/types');
    const data = await response.json();
    Alert.alert('API Test', `Success! Found ${data.length} session types`);
  } catch (error) {
    Alert.alert('API Test Failed', String(error));
  }
};

// Add this button in your render, maybe above "Start Workout Session"
<TouchableOpacity 
  style={{padding: 20, backgroundColor: '#EF4444'}} 
  onPress={testAPI}
>
  <Text style={{color: '#FFF'}}>Test API Connection</Text>
</TouchableOpacity>
```

---

## 📱 Platform-Specific Fixes

### Android Emulator
```typescript
// logger.tsx line 11
const API_URL = 'http://10.0.2.2:8080/api';
```

**Why:** Android treats `localhost` as the emulator itself, not your host machine.

### iOS Simulator
```typescript
// logger.tsx line 11
const API_URL = 'http://localhost:8080/api';
```

**Why:** iOS Simulator can access host's localhost directly.

### Physical Device (Both Android & iOS)
1. Get your IP:
   ```bash
   # Windows
   ipconfig
   
   # Look for IPv4 Address
   # Example: 192.168.1.100
   ```

2. Update URL:
   ```typescript
   const API_URL = 'http://192.168.1.100:8080/api';
   ```

3. **Important:** Both devices must be on same WiFi!

---

## 🎯 Most Likely Issue

Based on your symptoms, the most likely cause is:

**The frontend is trying to connect but using the wrong API URL for your platform.**

### Solution:
1. Determine what you're running on (Android/iOS/Physical)
2. Update line 11 in `logger.tsx` accordingly
3. Reload the app

---

## 📊 Verification Checklist

- [ ] Backend server is running (it is ✅)
- [ ] Database has session types (it does ✅)
- [ ] API endpoints work (they do ✅)
- [ ] API_URL matches your platform
- [ ] App is reloaded after changing API_URL
- [ ] No firewall blocking port 8080
- [ ] Devices on same WiFi (if using physical device)

---

## 🆘 Still Not Working?

If none of the above fixes it:

### 1. Check React Native Logs
```bash
# Android
adb logcat

# iOS
npx react-native log-ios
```

### 2. Enable Remote Debugging
- Shake device/emulator
- Select "Debug"
- Open Chrome DevTools
- Check Console and Network tabs

### 3. Verify Fetch is Working
Add console logs:
```typescript
const loadSessionTypes = async () => {
  console.log('1. Starting to load...');
  try {
    console.log('2. Fetching from:', `${API_URL}/sessions/types/categorized`);
    const response = await fetch(`${API_URL}/sessions/types/categorized`);
    console.log('3. Response status:', response.status);
    const data = await response.json();
    console.log('4. Data received:', Object.keys(data));
    setSessionTypes(data);
    console.log('5. State updated!');
  } catch (error) {
    console.log('ERROR:', error);
  }
};
```

---

## 💡 Expected Behavior

When working correctly:

1. **Tap "Start Workout Session"**
2. **Modal slides up from bottom**
3. **Shows categorized session types:**
   - Split (Push, Pull, Legs, Upper, Lower)
   - Goal (Hypertrophy, Strength, Power)
   - etc.
4. **Each card has gradient background**
5. **Tapping a session type starts the session**

---

## 🎉 Next Steps

Once you confirm your platform and update the API_URL:

1. **Reload the app** (press `r` in Metro)
2. **Check console** for success logs
3. **Try starting a session**
4. **Report back** with what you see!

---

**Most likely fix:** Change line 11 in `logger.tsx` based on your platform!
