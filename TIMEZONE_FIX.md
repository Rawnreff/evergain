# Timezone Fix - WIB (GMT+7)

## Problem
Database menyimpan waktu dalam UTC (GMT+0), sehingga ketika user memulai session pada pukul 14:29 WIB, yang tersimpan adalah 07:29 UTC. Ini membingungkan karena waktu yang ditampilkan tidak sesuai dengan waktu lokal user.

## Solution
Implementasi timezone conversion yang proper:

### Backend Changes

1. **Storage Strategy**: 
   - Tetap simpan sebagai UTC di database (best practice untuk database)
   - Convert dari WIB ke UTC saat menyimpan
   - Convert dari UTC ke WIB saat menampilkan

2. **Files Modified**:

#### `backend/models/session.py`
- Import timezone utilities: `from datetime import datetime, timezone, timedelta`
- Define WIB timezone: `WIB = timezone(timedelta(hours=7))`
- Modified `__init__()`: Convert WIB time to UTC before storing
- Modified `to_json()`: Convert UTC to WIB when returning to frontend
- Modified `end_session()`: Convert WIB time to UTC before storing
- Modified `add_exercise_log()`: Convert WIB time to UTC before storing

#### `backend/models/workout_set.py`
- Import timezone utilities
- Define WIB timezone
- Modified `__init__()`: Convert WIB time to UTC before storing
- Modified `to_json()`: Convert UTC to WIB when returning to frontend

### How It Works

**When Creating Session:**
```python
# Get current WIB time
wib_now = datetime.now(WIB)  # e.g., 2026-01-22 14:29:00+07:00

# Convert to UTC for storage (remove timezone info for MongoDB)
utc_time = wib_now.astimezone(timezone.utc).replace(tzinfo=None)  # 2026-01-22 07:29:00
```

**When Returning to Frontend:**
```python
# Assume stored datetime is UTC
utc_started = self.started_at.replace(tzinfo=timezone.utc)  # 2026-01-22 07:29:00+00:00

# Convert to WIB
wib_started = utc_started.astimezone(WIB)  # 2026-01-22 14:29:00+07:00

# Return as ISO string
data['started_at'] = wib_started.isoformat()  # "2026-01-22T14:29:00+07:00"
```

### Database Storage
- Database tetap menyimpan dalam UTC (naive datetime tanpa timezone info)
- Contoh: `started_at: 2026-01-22T07:29:00.000+00:00`

### API Response
- API mengembalikan waktu dalam WIB dengan timezone info
- Contoh: `"started_at": "2026-01-22T14:29:00+07:00"`

### Frontend Display
- Frontend sudah menggunakan timezone 'Asia/Jakarta' untuk display
- File: `evergain/app/(tabs)/index.tsx` dan `evergain/app/(tabs)/history.tsx`
- Fungsi: `formatGMT7()` menggunakan `timeZone: 'Asia/Jakarta'`

## Testing

### Test 1: Start Session
```bash
# Start session at 14:54 WIB
curl -X POST http://192.168.1.4:8080/api/sessions/start \
  -H "Content-Type: application/json" \
  -d '{"user_id":"default_user","session_type":"Push"}'

# Response shows WIB time:
# "started_at": "2026-01-22T14:54:52+07:00"
```

### Test 2: End Session
```bash
# End session at 14:55 WIB
curl -X POST http://192.168.1.4:8080/api/sessions/end \
  -H "Content-Type: application/json" \
  -d '{"user_id":"default_user"}'

# Response shows WIB time:
# "started_at": "2026-01-22T14:54:52+07:00"
# "ended_at": "2026-01-22T14:55:09+07:00"
```

### Test 3: Database Check
Database tetap menyimpan dalam UTC:
```
started_at: 2026-01-22T07:54:52.000+00:00  (UTC)
ended_at: 2026-01-22T07:55:09.000+00:00    (UTC)
```

Tapi API response mengembalikan WIB:
```
started_at: 2026-01-22T14:54:52+07:00  (WIB)
ended_at: 2026-01-22T14:55:09+07:00    (WIB)
```

## Benefits

1. **Database Best Practice**: Menyimpan dalam UTC memudahkan handling multi-timezone di masa depan
2. **User-Friendly**: User melihat waktu sesuai timezone lokal mereka (WIB)
3. **Consistent**: Semua timestamp (session, workout_set) menggunakan logic yang sama
4. **Accurate**: Tidak ada lagi perbedaan 7 jam antara waktu actual dan waktu tersimpan

## Files Modified
- `backend/models/session.py`
- `backend/models/workout_set.py`
