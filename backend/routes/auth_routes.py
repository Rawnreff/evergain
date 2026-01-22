from flask import Blueprint, request, jsonify
from services.auth_service import AuthService
from models.user import RegisterRequest, LoginRequest
import logging

logger = logging.getLogger(__name__)

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
auth_service = AuthService()

@auth_bp.route('/register', methods=['POST'])
def register():
    """User registration endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Invalid request payload'}), 400
        
        # Create register request
        register_req = RegisterRequest(
            full_name=data.get('full_name'),
            email=data.get('email'),
            password=data.get('password')
        )
        
        # Register user
        result = auth_service.register(register_req)
        
        return jsonify(result), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Registration error: {e}")
        return jsonify({'error': 'Internal server error'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """User login endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Invalid request payload'}), 400
        
        # Create login request
        login_req = LoginRequest(
            email=data.get('email'),
            password=data.get('password')
        )
        
        # Login user
        result = auth_service.login(login_req)
        
        return jsonify(result), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 401
    except Exception as e:
        logger.error(f"Login error: {e}")
        return jsonify({'error': 'Internal server error'}), 500
