from flask import Blueprint, jsonify
from database import get_exercises_collection
import logging

logger = logging.getLogger(__name__)

exercise_bp = Blueprint('exercise', __name__, url_prefix='/api/exercises')

@exercise_bp.route('/', methods=['GET'])
def get_exercises():
    """Get all exercises endpoint"""
    try:
        exercises_collection = get_exercises_collection()
        exercises = list(exercises_collection.find({}, {'_id': 0}))
        
        logger.info(f"Fetched {len(exercises)} exercises")
        
        return jsonify(exercises), 200
        
    except Exception as e:
        logger.error(f"Get exercises error: {e}")
        return jsonify({'error': 'Failed to fetch exercises'}), 500

@exercise_bp.route('/muscle-groups', methods=['GET'])
def get_muscle_groups():
    """Get list of all muscle groups"""
    try:
        exercises_collection = get_exercises_collection()
        
        # Get unique muscle groups
        muscle_groups = exercises_collection.distinct('muscle_group')
        muscle_groups.sort()
        
        return jsonify(muscle_groups), 200
        
    except Exception as e:
        logger.error(f"Get muscle groups error: {e}")
        return jsonify({'error': 'Failed to fetch muscle groups'}), 500
