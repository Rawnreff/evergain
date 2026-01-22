# Session Management & Exercise Categorization - Complete Guide

## 🎯 Overview
The session management system allows users to:
1. **Start workout sessions** with a specific training split/type
2. **Track exercises** relevant to the current session
3. **End sessions** and view statistics
4. **View session history** and progress over time

---

## 📋 Session Types (31 Total)

### Split Routines (3)
- **Push** - Chest/Shoulders/Triceps
- **Pull** - Back/Biceps/Rear Delts
- **Legs** - Quads/Hamstrings/Glutes/Calves
- **Upper** - Entire Upper Body
- **Lower** - Entire Lower Body

### Isolation Focus (4)
- **Arms** - Biceps/Triceps/Forearms
- **Core** - Abs/Obliques/Lower Back
- **Quads & Calves** - Legs Focus
- **Hamstrings & Glutes** - Hip Focus

### Movement Patterns (2)
- **Posterior Chain** - Hamstrings/Glutes/Lower Back
- **Anterior Chain** - Quads/Abs/Chest

### Regional Focus (3)
- **Torso** - Chest/Back/Shoulders
- **Posterior Upper** - Back/Rear Delts
- **Anterior Upper** - Chest/Front Delts

### Specialty Routines (3)
- **Chest & Back** - Antagonist Upper (Superset Training)
- **Shoulders & Arms** - Arnold Style
- **Weak Point** - Targeting Lagging Muscles
- **Accessory** - Small Muscle Isolation

### Training Goals (5)
- **Hypertrophy** - Muscle Growth Focus (8-12 reps)
- **Strength** - Heavy Compound Focus (1-5 reps)
- **Power** - Explosive Movements
- **Conditioning** - Cardio/Endurance
- **Full Body** - All Muscle Groups

### Recovery (4)
- **Rest** - Recovery Day
- **Active Recovery** - Light Cardio/Mobility
- **Mobility** - Flexibility/Joint Health
- **Deload** - Light Intensity Week

### Variations (4)
- **Push A** - Push Variation 1
- **Push B** - Push Variation 2
- **Pull A** - Pull Variation 1
- **Pull B** - Pull Variation 2

---

## 🏋️ Exercise Categorization

All 71 exercises are tagged with appropriate session types. Here are examples:

### Push Exercises (25)
- Bench Press → [Push, Upper, Torso, Anterior Upper, Chest & Back, Push A, Push B, Hypertrophy, Strength]
- Overhead Press → [Push, Upper, Torso, Anterior Upper, Shoulders & Arms, Strength, Hypertrophy]
- Triceps Pushdown → [Push, Upper, Arms, Shoulders & Arms, Accessory, Hypertrophy]

### Pull Exercises (22)
- Deadlift → [Pull, Lower, Posterior Chain, Hamstrings & Glutes, Strength, Power]
- Pull Up → [Pull, Upper, Torso, Posterior Upper, Posterior Chain, Pull A, Pull B, Strength, Hypertrophy]
- Barbell Row → [Pull, Upper, Torso, Posterior Upper, Chest & Back, Pull A, Pull B, Strength, Hypertrophy]

### Leg Exercises (17)
- Barbell Squat → [Legs, Lower, Anterior Chain, Quads & Calves, Strength, Hypertrophy, Power]
- Hip Thrust → [Legs, Lower, Posterior Chain, Hamstrings & Glutes, Hypertrophy]
- Bulgarian Split Squat → [Legs, Lower, Anterior Chain, Quads & Calves, Hypertrophy]

### Core Exercises (6)
- Plank → [Core, Anterior Chain, Active Recovery, Conditioning]
- Hanging Leg Raise → [Core, Anterior Chain, Hypertrophy]
- Russian Twist → [Core, Anterior Chain, Conditioning]

---

## 🚀 API Endpoints

### Session Management

#### **Start Session**
```http
POST /api/sessions/start
Content-Type: application/json

{
  "user_id": "user123",
  "session_type": "Push"
}
```

**Response:**
```json
{
  "_id": "session_id",
  "user_id": "user123",
  "session_type": "Push",
  "started_at": "2026-01-22T12:00:00",
  "ended_at": null,
  "total_sets": 0,
  "total_volume": 0,
  "exercises_performed": [],
  "is_active": true
}
```

#### **End Session**
```http
POST /api/sessions/end
Content-Type: application/json

{
  "user_id": "user123"
}
```

**Response:**
```json
{
  "_id": "session_id",
  "user_id": "user123",
  "session_type": "Push",
  "started_at": "2026-01-22T12:00:00",
  "ended_at": "2026-01-22T13:30:00",
  "total_sets": 12,
  "total_volume": 1800,
  "exercises_performed": [],
  "is_active": false,
  "duration_minutes": 90.0
}
```

#### **Get Active Session**
```http
GET /api/sessions/active?user_id=user123
```

**Response:**
```json
{
  "active": true,
  "session": {
    "_id": "session_id",
    "session_type": "Push",
    "started_at": "2026-01-22T12:00:00",
    "is_active": true
  }
}
```

#### **Get Session History**
```http
GET /api/sessions/history?user_id=user123&limit=20
```

**Response:**
```json
[
  {
    "_id": "session_id_1",
    "session_type": "Push",
    "started_at": "2026-01-22T12:00:00",
    "ended_at": "2026-01-22T13:30:00",
    "duration_minutes": 90.0,
    "total_sets": 12,
    "total_volume": 1800
  },
  ...
]
```

#### **Get All Session Types**
```http
GET /api/sessions/types
```

**Response:**
```json
[
  {
    "name": "Push",
    "description": "Chest/Shoulders/Triceps",
    "category": "Split"
  },
  {
    "name": "Pull",
    "description": "Back/Biceps/Rear Delts",
    "category": "Split"
  },
  ...
]
```

#### **Get Session Types by Category**
```http
GET /api/sessions/types/categorized
```

**Response:**
```json
{
  "Split": [
    {
      "name": "Push",
      "description": "Chest/Shoulders/Triceps",
      "category": "Split"
    },
    ...
  ],
  "Goal": [
    {
      "name": "Hypertrophy",
      "description": "Muscle Growth Focus",
      "category": "Goal"
    },
    ...
  ]
}
```

#### **Get Exercises for Session Type**
```http
GET /api/sessions/exercises?session_type=Push
```

**Response:**
```json
[
  {
    "name": "Bench Press",
    "muscle_group": "Chest",
    "secondary": "Triceps",
    "sessions": ["Push", "Upper", "Torso", ...]
  },
  {
    "name": "Overhead Press",
    "muscle_group": "Shoulder",
    "secondary": "",
    "sessions": ["Push", "Upper", "Torso", ...]
  },
  ...
]
```

---

## 💡 Frontend Integration Example

### Starting a Session
```typescript
const startWorkoutSession = async (sessionType: string) => {
  try {
    const response = await fetch('http://localhost:8080/api/sessions/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 'user123',
        session_type: sessionType
      })
    });
    
    const session = await response.json();
    console.log('Session started:', session);
  } catch (error) {
    console.error('Failed to start session:', error);
  }
};
```

### Getting Exercises for Current Session
```typescript
const loadExercisesForSession = async (sessionType: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/sessions/exercises?session_type=${sessionType}`
    );
    const exercises = await response.json();
    setExercises(exercises);
  } catch (error) {
    console.error('Failed to load exercises:', error);
  }
};
```

### Checking Active Session
```typescript
const checkActiveSession = async () => {
  try {
    const response = await fetch(
      'http://localhost:8080/api/sessions/active?user_id=user123'
    );
    const data = await response.json();
    
    if (data.active) {
      setCurrentSession(data.session);
      loadExercisesForSession(data.session.session_type);
    }
  } catch (error) {
    console.error('Failed to check active session:', error);
  }
};
```

### Ending a Session
```typescript
const endWorkoutSession = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/sessions/end', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: 'user123' })
    });
    
    const completedSession = await response.json();
    console.log('Session completed:', completedSession);
    console.log(`Duration: ${completedSession.duration_minutes} minutes`);
  } catch (error) {
    console.error('Failed to end session:', error);
  }
};
```

---

## 🎨 Recommended UX Flow

1. **Session Selection Screen**
   - Show categorized session types
   - Display session description
   - "Start Session" button

2. **Active Session Indicator**
   - Show current session type at top of logger
   - Display session duration (live timer)
   - "End Session" button

3. **Exercise Picker**
   - Filter exercises by current session type
   - Group by muscle group
   - Show exercise name + muscle group

4. **Session Summary**
   - Show when session ends
   - Total duration
   - Total sets completed
   - Total volume lifted
   - Exercises performed

---

## 🗄️ Database Schema

### Sessions Collection
```json
{
  "_id": ObjectId,
  "user_id": "string",
  "session_type": "string",
  "started_at": ISODate,
  "ended_at": ISODate | null,
  "total_sets": number,
  "total_volume": number,
  "exercises_performed": [],
  "is_active": boolean
}
```

### Session Types Collection
```json
{
  "name": "string",
  "description": "string",
  "category": "string"
}
```

### Exercises Collection (Updated)
```json
{
  "name": "string",
  "muscle_group": "string",
  "secondary": "string",
  "sessions": ["string", ...]
}
```

---

## ✅ Testing

Run the backend server and test:

```bash
# Start server
cd backend
python app.py

# Test session endpoints
python test_exercises_api.py
```

---

## 🎯 Next Steps

1. ✅ Database seeded with exercises + session tags
2. ✅ Session management API created
3. ⏳ Update frontend logger to:
   - Show session picker modal
   - Track active session
   - Filter exercises by session type
   - Display session stats
   - End session functionality
