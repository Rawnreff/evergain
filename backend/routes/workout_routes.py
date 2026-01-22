from flask import Blueprint, request, jsonify
from services.workout_service import WorkoutService
import logging

logger = logging.getLogger(__name__)

workout_bp = Blueprint('workout', __name__, url_prefix='/api/workouts')
workout_service = WorkoutService()

@workout_bp.route('/', methods=['POST'])
def submit_workout():
    """Submit new workout session endpoint"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Invalid input'}), 400
        
        # Validate required fields
        required_fields = ['weight', 'reps', 'sets']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing required field: {field}'}), 400
        
        # Submit workout
        workout = workout_service.submit_workout(data)
        
        return jsonify(workout.to_json()), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"Workout submission error: {e}")
        return jsonify({'error': f'Processing failed: {str(e)}'}), 500

@workout_bp.route('/', methods=['GET'])
def get_history():
    """Get workout history endpoint"""
    try:
        workouts = workout_service.get_history()
        
        # Convert to JSON
        workouts_json = [workout.to_json() for workout in workouts]
        
        return jsonify(workouts_json), 200
        
    except Exception as e:
        logger.error(f"Get history error: {e}")
        return jsonify({'error': 'Failed to fetch history'}), 500
