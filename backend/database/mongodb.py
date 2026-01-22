from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
from config import Config
import logging

logger = logging.getLogger(__name__)

class MongoDB:
    client = None
    db = None
    
    @classmethod
    def connect(cls):
        """Initialize MongoDB connection"""
        try:
            cls.client = MongoClient(Config.MONGODB_URI)
            # Test connection
            cls.client.admin.command('ping')
            cls.db = cls.client[Config.DB_NAME]
            logger.info(f"✅ Connected to MongoDB database: {Config.DB_NAME}")
            return cls.db
        except ConnectionFailure as e:
            logger.error(f"❌ Failed to connect to MongoDB: {e}")
            raise e
    
    @classmethod
    def get_db(cls):
        """Get database instance"""
        if cls.db is None or cls.client is None:
            cls.connect()
        else:
            # Check if connection is still alive
            try:
                cls.client.admin.command('ping')
            except Exception:
                # Connection is dead, reconnect
                logger.warning("⚠️ MongoDB connection lost, reconnecting...")
                cls.connect()
        return cls.db
    
    @classmethod
    def close(cls):
        """Close MongoDB connection"""
        if cls.client:
            cls.client.close()
            logger.info("MongoDB connection closed")

# Collection accessors
def get_users_collection():
    """Get users collection"""
    db = MongoDB.get_db()
    return db[Config.USERS_COLLECTION]

def get_workouts_collection():
    """Get workouts collection"""
    db = MongoDB.get_db()
    return db[Config.WORKOUTS_COLLECTION]

def get_exercises_collection():
    """Get exercises collection"""
    db = MongoDB.get_db()
    return db[Config.EXERCISES_COLLECTION]

def get_sessions_collection():
    """Get sessions collection"""
    db = MongoDB.get_db()
    return db[Config.SESSIONS_COLLECTION]

def get_session_types_collection():
    """Get session types collection"""
    db = MongoDB.get_db()
    return db[Config.SESSION_TYPES_COLLECTION]


