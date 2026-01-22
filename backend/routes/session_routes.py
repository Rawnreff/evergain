from flask import Blueprint, request, jsonify
from services.session_service import SessionService
import logging

logger = logging.getLogger(__name__)

session_bp = Blueprint('session', __name__, url_prefix='/api/sessions')
session_service = SessionService()

@session_bp.route('/start', methods=['POST'])
def start_session():
    """Start a new workout session"""
    try:
        data = request.get_json()
        
        # Validate input
        if not data or 'session_type' not in data:
            return jsonify({'error': 'session_type is required'}), 400
        
        # TODO: Get user_id from JWT token
        # For now, using a default user_id
        user_id = data.get('user_id', 'default_user')
        session_type = data['session_type']
        
        # Start session
        session = session_service.start_session(user_id, session_type)
        
        return jsonify(session.to_json()), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Start session error: {e}")
        return jsonify({'error': 'Failed to start session'}), 500

@session_bp.route('/end', methods=['POST'])
def end_session():
    """End current active session"""
    try:
        data = request.get_json()
        
        # TODO: Get user_id from JWT token
        user_id = data.get('user_id', 'default_user') if data else 'default_user'
        
        # End session
        session = session_service.end_session(user_id)
        
        return jsonify(session.to_json()), 200
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"End session error: {e}")
        return jsonify({'error': 'Failed to end session'}), 500

@session_bp.route('/active', methods=['GET'])
def get_active_session():
    """Get user's active session"""
    try:
        # TODO: Get user_id from JWT token
        user_id = request.args.get('user_id', 'default_user')
        
        # Get active session
        session = session_service.get_active_session(user_id)
        
        if not session:
            return jsonify({'active': False, 'session': None}), 200
        
        return jsonify({
            'active': True,
            'session': session.to_json()
        }), 200
        
    except Exception as e:
        logger.error(f"Get active session error: {e}")
        return jsonify({'error': 'Failed to get active session'}), 500

@session_bp.route('/history', methods=['GET'])
def get_session_history():
    """Get user's session history"""
    try:
        # TODO: Get user_id from JWT token
        user_id = request.args.get('user_id', 'default_user')
        limit = int(request.args.get('limit', 20))
        
        # Get history
        sessions = session_service.get_session_history(user_id, limit)
        
        # Convert to JSON
        sessions_json = [session.to_json() for session in sessions]
        
        return jsonify(sessions_json), 200
        
    except Exception as e:
        logger.error(f"Get session history error: {e}")
        return jsonify({'error': 'Failed to get session history'}), 500

@session_bp.route('/<session_id>/workout-sets', methods=['GET'])
def get_session_workout_sets_route(session_id):
    """Get all workout sets for a specific session"""
    try:
        from database.workout_sets import get_session_workout_sets
        
        workout_sets = get_session_workout_sets(session_id)
        
        return jsonify(workout_sets), 200
        
    except Exception as e:
        logger.error(f"Get session workout sets error: {e}")
        return jsonify({'error': 'Failed to get workout sets'}), 500

@session_bp.route('/types', methods=['GET'])
def get_session_types():
    """Get all available session types"""
    try:
        session_types = session_service.get_session_types()
        
        return jsonify(session_types), 200
        
    except Exception as e:
        logger.error(f"Get session types error: {e}")
        return jsonify({'error': 'Failed to get session types'}), 500

@session_bp.route('/types/categorized', methods=['GET'])
def get_session_types_categorized():
    """Get session types grouped by category"""
    try:
        categorized = session_service.get_session_types_by_category()
        
        return jsonify(categorized), 200
        
    except Exception as e:
        logger.error(f"Get categorized session types error: {e}")
        return jsonify({'error': 'Failed to get categorized session types'}), 500

@session_bp.route('/exercises', methods=['GET'])
def get_exercises_for_session():
    """Get exercises filtered by session type"""
    import traceback
    try:
        logger.info("📋 Exercises endpoint called")
        from database import get_exercises_collection
        
        session_type = request.args.get('session_type')
        logger.info(f"📋 Session type parameter: {session_type}")
        
        if not session_type:
            logger.error("❌ No session_type parameter provided")
            return jsonify({'error': 'session_type parameter is required'}), 400
        
        logger.info("📋 Getting exercises collection...")
        exercises_collection = get_exercises_collection()
        logger.info(f"✅ Got exercises collection: {exercises_collection}")
        
        # Find exercises that include this session type
        logger.info(f"📋 Querying for exercises with session type: {session_type}")
        exercises = list(exercises_collection.find(
            {'sessions': session_type},
            {'_id': 0}
        ))
        
        logger.info(f"✅ Found {len(exercises)} exercises for {session_type}")
        return jsonify(exercises), 200
        
    except Exception as e:
        logger.error(f"❌ Get exercises for session error: {e}")
        logger.error(f"❌ Error type: {type(e).__name__}")
        logger.error(f"❌ Traceback: {traceback.format_exc()}")
        return jsonify({'error': f'Failed to get exercises for session: {str(e)}'}), 500

