# EverGain Backend - Flask + MongoDB

Backend API untuk aplikasi fitness EverGain yang dibangun dengan Flask dan MongoDB.

## 🚀 Tech Stack

- **Framework**: Flask 3.0.0
- **Database**: MongoDB
- **Authentication**: JWT (PyJWT)
- **AI**: Google Gemini AI
- **Password Hashing**: bcrypt
- **CORS**: Flask-CORS

## 📁 Struktur Proyek

```
backend/
├── app.py                 # Main Flask application
├── config.py              # Konfigurasi environment
├── requirements.txt       # Dependencies Python
├── .env                   # Environment variables (tidak di-commit)
├── .env.example           # Template environment variables
├── test_api.py            # Script testing API
├── database/
│   ├── __init__.py
│   └── mongodb.py         # MongoDB connection manager
├── models/
│   ├── __init__.py
│   ├── user.py            # Model User
│   └── workout.py         # Model Workout
├── services/
│   ├── __init__.py
│   ├── auth_service.py    # Service autentikasi
│   ├── workout_service.py # Service workout
│   └── ai_service.py      # Service AI analysis
└── routes/
    ├── __init__.py
    ├── auth_routes.py     # Endpoint autentikasi
    └── workout_routes.py  # Endpoint workout
```

## 🔧 Setup & Installation

### Prerequisites

- Python 3.8 atau lebih baru
- MongoDB (lokal atau MongoDB Atlas)
- pip (Python package manager)

### Steps

1. **Clone repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Setup environment variables**
   
   Copy `.env.example` ke `.env` dan sesuaikan nilai-nilainya:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/evergain
   JWT_SECRET=your_secret_key_here
   GEMINI_API_KEY=your_gemini_api_key
   PORT=8080
   FLASK_ENV=development
   ```

4. **Jalankan MongoDB**
   
   Jika menggunakan MongoDB lokal:
   ```bash
   mongod
   ```
   
   Atau gunakan MongoDB Atlas (cloud).

5. **Jalankan server**
   ```bash
   python app.py
   ```
   
   Server akan berjalan di `http://localhost:8080`

## 📡 API Endpoints

### Health Check
```
GET /
```

### Authentication

#### Register
```
POST /api/auth/register
Content-Type: application/json

{
  "full_name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Workout

#### Submit Workout
```
POST /api/workouts/
Content-Type: application/json

{
  "weight": 80.5,
  "reps": 10,
  "sets": 3,
  "feeling": "Strong and energized!"
}
```

**Response dengan AI Analysis:**
```json
{
  "id": "...",
  "weight": 80.5,
  "reps": 10,
  "sets": 3,
  "feeling": "Strong and energized!",
  "progress_state": "progress_up",
  "advice": "Great progress! Keep pushing safely.",
  "color": "#C6FF5E",
  "created_at": "2026-01-21T13:56:44.371000"
}
```

#### Get Workout History
```
GET /api/workouts/
```

## 🤖 AI Integration

Backend menggunakan **Google Gemini AI** untuk menganalisis progres latihan secara otomatis.

### Color System
- **🟢 Lime Green (#C6FF5E)**: Progress Up - Latihan meningkat
- **🔵 Electric Blue (#00D1FF)**: Stagnant - Perlu optimisasi
- **🔴 Red (#FF5E5E)**: Unsafe - Risiko cedera atau performa menurun

### Features
- Analisis progressive overload
- Saran latihan personal
- Deteksi risiko cedera
- Tracking tren latihan

## 🧪 Testing

Jalankan script testing untuk verify semua endpoint:

```bash
python test_api.py
```

Output akan menampilkan hasil testing untuk:
- Health check
- User registration
- User login
- Workout submission
- Workout history

## 🔒 Security

- Password di-hash menggunakan **bcrypt**
- JWT token untuk autentikasi (72 jam expiry)
- CORS dikonfigurasi untuk React Native frontend
- Environment variables untuk sensitive data

## 📊 Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  email: String,
  password_hash: String,
  full_name: String,
  created_at: DateTime
}
```

### Workouts Collection
```javascript
{
  _id: ObjectId,
  weight: Number,
  reps: Number,
  sets: Number,
  feeling: String,
  progress_state: String,  // "progress_up", "stagnant", "unsafe", "down"
  advice: String,
  color: String,
  created_at: DateTime
}
```

## 🚀 Deployment

### MongoDB Atlas Setup

1. Buat cluster di [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Dapatkan connection string
3. Update `MONGODB_URI` di `.env`

### Production Environment

Update `.env` untuk production:
```env
FLASK_ENV=production
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/evergain
JWT_SECRET=strong_random_secret_key
```

## 🔄 Migration dari Golang

Backend ini adalah hasil migrasi dari Golang + PostgreSQL ke Flask + MongoDB.

**Alasan migrasi:**
- ✅ Integrasi AI lebih mudah dengan Python
- ✅ Schema fleksibel dengan MongoDB
- ✅ Simplified development
- ✅ Better ML/AI pipeline integration

Backup Golang backend tersedia di folder `../backend-golang-backup/`

## 📝 Notes

- Pastikan MongoDB running sebelum start server
- Default port: 8080
- API sudah support CORS untuk React Native
- Gemini API key diperlukan untuk AI features

## 🐛 Troubleshooting

**MongoDB connection failed:**
```
- Pastikan MongoDB service running
- Check connection string di .env
- Verify network access (jika pakai Atlas)
```

**AI analysis tidak bekerja:**
```
- Verify GEMINI_API_KEY di .env
- Check API quota limit
- Review logs untuk error details
```

## 📞 Support

Untuk pertanyaan atau issues, silakan hubungi tim development.

---

**Version:** 2.0.0  
**Tech Stack:** Flask + MongoDB  
**Last Updated:** 2026-01-21
