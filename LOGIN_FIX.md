# Login Buffering Fix

## Problem
User tidak bisa login di Expo Go, hanya buffering terus setelah klik tombol login.

## Root Cause
IP address di `authService.ts` tidak sesuai dengan IP backend server yang sedang berjalan.

## Solution Applied

### 1. Fixed IP Address
**File**: `evergain/services/authService.ts`

Changed:
```typescript
const LOCAL_IP = '192.168.1.5'; // OLD - Wrong IP
```

To:
```typescript
const LOCAL_IP = '192.168.1.4'; // NEW - Correct IP
```

### 2. Added Error Logging
**File**: `evergain/context/AuthContext.tsx`

Added try-catch and console logging to signIn function:
```typescript
const signIn = async (email: string, pass: string) => {
    try {
        const data = await apiLogin(email, pass);
        console.log('Login response:', data);
        await saveToken(data.token);
        await saveUser(data.user);
        setUser(data.user);
    } catch (error) {
        console.error('SignIn error:', error);
        throw error;
    }
};
```

## Testing

### Backend Test
```bash
# Test login endpoint
curl -X POST http://192.168.1.4:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Expected response:
{
  "token": "eyJhbGci...",
  "user": {
    "id": "...",
    "email": "test@example.com",
    "full_name": "Test User",
    "created_at": "..."
  }
}
```

### Frontend Test
1. Open Expo Go app
2. Navigate to login screen
3. Enter credentials:
   - Email: `test@example.com`
   - Password: `password123`
4. Click "Sign In"
5. Check console logs for:
   - `🌐 API URL: http://192.168.1.4:8080/api | Platform: android`
   - `Login response: {token: ..., user: ...}`
6. Should redirect to main app (tabs)

## Troubleshooting

### If Still Buffering:

1. **Check Backend Server**
   ```bash
   # Check if backend is running
   curl http://192.168.1.4:8080/api/sessions/types
   ```

2. **Check Network Connection**
   - Ensure phone and computer are on same WiFi network
   - Check firewall settings (port 8080 should be open)

3. **Check IP Address**
   ```bash
   # On Windows, get your IP:
   ipconfig
   
   # Look for "IPv4 Address" under your WiFi adapter
   # Update LOCAL_IP in authService.ts if different
   ```

4. **Check Expo Go Console**
   - Open Expo Go app
   - Shake device to open developer menu
   - Select "Debug Remote JS"
   - Check browser console for errors

5. **Clear App Cache**
   - Close Expo Go completely
   - Reopen and reload the app
   - Try login again

### Common Issues:

**Issue**: Network request failed
- **Solution**: Check if backend server is running and accessible

**Issue**: Timeout error
- **Solution**: Check firewall settings, ensure port 8080 is open

**Issue**: Invalid credentials
- **Solution**: Verify user exists in database or register new user first

**Issue**: CORS error (web only)
- **Solution**: Backend should have CORS enabled for development

## Files Modified
- `evergain/services/authService.ts` - Fixed IP address
- `evergain/context/AuthContext.tsx` - Added error logging

## Next Steps
If login still doesn't work:
1. Check Expo Go console logs
2. Verify backend logs show incoming request
3. Test with different user credentials
4. Try registering new user first
