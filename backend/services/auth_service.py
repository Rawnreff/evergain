import bcrypt
import jwt
from datetime import datetime, timedelta
from config import Config
from database import get_users_collection
from models.user import User
import logging

logger = logging.getLogger(__name__)

class AuthService:
    """Authentication service for user registration and login"""
    
    def __init__(self):
        self.users_collection = get_users_collection()
    
    def register(self, register_request):
        """
        Register a new user
        
        Args:
            register_request: RegisterRequest object
        
        Returns:
            dict with token and user info
        
        Raises:
            ValueError: If validation fails or user exists
        """
        # Validate request
        errors = register_request.validate()
        if errors:
            raise ValueError(', '.join(errors))
        
        # Check if user already exists
        existing_user = self.users_collection.find_one({'email': register_request.email})
        if existing_user:
            raise ValueError('Email already registered')
        
        # Hash password
        password_hash = bcrypt.hashpw(
            register_request.password.encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Create new user
        new_user = User(
            email=register_request.email,
            password_hash=password_hash,
            full_name=register_request.full_name
        )
        
        # Save to database
        result = self.users_collection.insert_one(new_user.to_dict())
        new_user._id = result.inserted_id
        
        # Generate JWT token
        token = self._generate_token(str(new_user._id))
        
        logger.info(f"New user registered: {new_user.email}")
        
        return {
            'token': token,
            'user': new_user.to_json()
        }
    
    def login(self, login_request):
        """
        Login user
        
        Args:
            login_request: LoginRequest object
        
        Returns:
            dict with token and user info
        
        Raises:
            ValueError: If credentials are invalid
        """
        # Validate request
        errors = login_request.validate()
        if errors:
            raise ValueError(', '.join(errors))
        
        # Find user by email
        user_data = self.users_collection.find_one({'email': login_request.email})
        if not user_data:
            raise ValueError('Invalid credentials')
        
        user = User.from_dict(user_data)
        
        # Verify password
        if not bcrypt.checkpw(
            login_request.password.encode('utf-8'),
            user.password_hash.encode('utf-8')
        ):
            raise ValueError('Invalid credentials')
        
        # Generate JWT token
        token = self._generate_token(str(user._id))
        
        logger.info(f"User logged in: {user.email}")
        
        return {
            'token': token,
            'user': user.to_json()
        }
    
    def _generate_token(self, user_id):
        """Generate JWT token for user"""
        payload = {
            'user_id': user_id,
            'exp': datetime.utcnow() + timedelta(hours=72)
        }
        token = jwt.encode(payload, Config.JWT_SECRET, algorithm='HS256')
        return token
