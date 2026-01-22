"""
Workout Set Routes
API endpoints for logging and retrieving workout sets
"""
from flask import Blueprint, request, jsonify
from models.workout_set import WorkoutSet
from database.workout_sets import (
    log_workout_set,
    get_session_workout_sets,
    get_last_set_for_exercise,
    count_sets_for_exercise,
    update_session_stats
)
import logging

logger = logging.getLogger(__name__)

workout_set_bp = Blueprint('workout_set', __name__, url_prefix='/api/workout-sets')

@workout_set_bp.route('/log', methods=['POST'])
def log_set():
    """Log a workout set"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['session_id', 'exercise_name', 'weight', 'reps']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Get set number
        set_number = count_sets_for_exercise(
            data['session_id'],
            data['exercise_name']
        ) + 1
        
        # Create workout set
        workout_set = WorkoutSet(
            session_id=data['session_id'],
            exercise_name=data['exercise_name'],
            weight=float(data['weight']),
            reps=int(data['reps']),
            rpe=int(data['rpe']) if data.get('rpe') else None,
            notes=data.get('notes'),
            set_number=set_number
        )
        
        # Save to database
        saved_set = log_workout_set(workout_set)
        
        # Update session stats
        update_session_stats(data['session_id'])
        
        return jsonify(saved_set.to_json()), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        logger.error(f"❌ Error logging set: {e}")
        return jsonify({'error': 'Failed to log workout set'}), 500

@workout_set_bp.route('/session/<session_id>', methods=['GET'])
def get_session_sets(session_id):
    """Get all workout sets for a session"""
    try:
        sets = get_session_workout_sets(session_id)
        return jsonify(sets), 200
        
    except Exception as e:
        logger.error(f"❌ Error getting session sets: {e}")
        return jsonify({'error': 'Failed to get workout sets'}), 500

@workout_set_bp.route('/last-set', methods=['GET'])
def get_last_set():
    """Get the last set for a specific exercise in a session"""
    try:
        session_id = request.args.get('session_id')
        exercise_name = request.args.get('exercise_name')
        
        if not session_id or not exercise_name:
            return jsonify({'error': 'session_id and exercise_name are required'}), 400
        
        last_set = get_last_set_for_exercise(session_id, exercise_name)
        
        if not last_set:
            return jsonify({'last_set': None}), 200
        
        return jsonify(last_set), 200
        
    except Exception as e:
        logger.error(f"❌ Error getting last set: {e}")
        return jsonify({'error': 'Failed to get last set'}), 500

@workout_set_bp.route('/count', methods=['GET'])
def get_set_count():
    """Get the count of sets for an exercise in a session"""
    try:
        session_id = request.args.get('session_id')
        exercise_name = request.args.get('exercise_name')
        
        if not session_id or not exercise_name:
            return jsonify({'error': 'session_id and exercise_name are required'}), 400
        
        count = count_sets_for_exercise(session_id, exercise_name)
        
        return jsonify({'count': count}), 200
        
    except Exception as e:
        logger.error(f"❌ Error counting sets: {e}")
        return jsonify({'error': 'Failed to count sets'}), 500
