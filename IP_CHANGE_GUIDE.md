# 🔧 How to Change IP Address - Quick Guide

Ketika IP address laptop kamu berubah, ikuti langkah-langkah berikut:

## Step 1: Check Your Current IP Address

**Windows:**
```bash
ipconfig
```

Cari baris yang bertuliskan:
```
IPv4 Address. . . . . . . . . . . : 10.218.19.73
```

## Step 2: Update Configuration File

Buka file ini: **`evergain/services/apiConfig.ts`**

Ubah IP address di baris 15:

```typescript
export const API_CONFIG = {
    // Your computer's local IP address
    LOCAL_IP: '10.218.19.73',  // ← UBAH IP ADDRESS DISINI!
    
    // Backend port
    PORT: 8080,
    
    // ...
};
```

Ganti `10.218.19.73` dengan IP address baru kamu.

## Step 3: Restart Backend Server (If Running)

Jika backend server sedang berjalan, restart dengan:

1. **Stop server** (tekan `Ctrl+C` di terminal)
2. **Start lagi**:
   ```bash
   cd backend
   .venv\Scripts\activate
   python app.py
   ```

## Step 4: Restart React Native App

Jika app sudah running, restart Expo:

1. **Stop Expo** (tekan `Ctrl+C`)
2. **Start lagi**:
   ```bash
   npm start
   ```

## ⚠️ Important Notes

- **WiFi Network**: Pastikan laptop dan HP kamu terhubung ke WiFi yang SAMA
- **Firewall**: Pastikan Windows Firewall tidak memblokir port 8080
- **Single File**: Kamu HANYA perlu mengubah 1 file (`apiConfig.ts`), tidak perlu ubah file lain!

## 📍 Files Using This Config

Semua file berikut sekarang otomatis menggunakan IP dari `apiConfig.ts`:

- ✅ `app/(tabs)/index.tsx` (Dashboard)
- ✅ `app/(tabs)/history.tsx` (History)
- ✅ `app/(tabs)/logger.tsx` (Logger)
- ✅ `services/authService.ts` (Authentication)
- ✅ `services/api.ts` (Workout API)

Jadi cukup ubah 1 file, semua langsung update! 🎉
