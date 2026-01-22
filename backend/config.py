import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/evergain')
    JWT_SECRET = os.getenv('JWT_SECRET', 'SUPER_SECRET_KEY_FOR_EVERGAIN')
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', '')
    PORT = int(os.getenv('PORT', 8080))
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    
    # MongoDB Database Name
    DB_NAME = 'evergain'
    
    # Collections
    USERS_COLLECTION = 'users'
    WORKOUTS_COLLECTION = 'workouts'
    EXERCISES_COLLECTION = 'exercises'
    SESSIONS_COLLECTION = 'sessions'
    SESSION_TYPES_COLLECTION = 'session_types'


