from datetime import datetime
from bson import ObjectId

class User:
    """User model for MongoDB"""
    
    def __init__(self, email, password_hash, full_name, _id=None, created_at=None):
        self._id = _id if _id else ObjectId()
        self.email = email
        self.password_hash = password_hash
        self.full_name = full_name
        self.created_at = created_at if created_at else datetime.utcnow()
    
    def to_dict(self):
        """Convert to dictionary for MongoDB"""
        return {
            '_id': self._id,
            'email': self.email,
            'password_hash': self.password_hash,
            'full_name': self.full_name,
            'created_at': self.created_at
        }
    
    def to_json(self):
        """Convert to JSON response (without password)"""
        return {
            'id': str(self._id),
            'email': self.email,
            'full_name': self.full_name,
            'created_at': self.created_at.isoformat()
        }
    
    @staticmethod
    def from_dict(data):
        """Create User from MongoDB document"""
        if not data:
            return None
        return User(
            _id=data.get('_id'),
            email=data.get('email'),
            password_hash=data.get('password_hash'),
            full_name=data.get('full_name'),
            created_at=data.get('created_at')
        )

class RegisterRequest:
    """User registration request"""
    def __init__(self, full_name, email, password):
        self.full_name = full_name
        self.email = email
        self.password = password
    
    def validate(self):
        """Validate registration data"""
        errors = []
        if not self.email or '@' not in self.email:
            errors.append('Valid email is required')
        if not self.password or len(self.password) < 6:
            errors.append('Password must be at least 6 characters')
        if not self.full_name or len(self.full_name) < 2:
            errors.append('Full name is required')
        return errors

class LoginRequest:
    """User login request"""
    def __init__(self, email, password):
        self.email = email
        self.password = password
    
    def validate(self):
        """Validate login data"""
        errors = []
        if not self.email:
            errors.append('Email is required')
        if not self.password:
            errors.append('Password is required')
        return errors
