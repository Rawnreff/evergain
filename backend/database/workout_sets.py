"""
Workout Sets Database Operations
"""
from database import MongoDB
from config import Config
from models.workout_set import WorkoutSet
from bson import ObjectId
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

def get_workout_sets_collection():
    """Get workout sets collection"""
    db = MongoDB.get_db()
    return db['workout_sets']

def log_workout_set(workout_set: WorkoutSet) -> WorkoutSet:
    """
    Log a workout set to the database
    """
    try:
        collection = get_workout_sets_collection()
        
        # Prepare document
        doc = {
            'session_id': workout_set.session_id,
            'exercise_name': workout_set.exercise_name,
            'weight': workout_set.weight,
            'reps': workout_set.reps,
            'rpe': workout_set.rpe,
            'notes': workout_set.notes,
            'set_number': workout_set.set_number,
            'timestamp': workout_set.timestamp,
            'volume': workout_set.weight * workout_set.reps
        }
        
        # Insert
        result = collection.insert_one(doc)
        workout_set._id = result.inserted_id
        
        logger.info(f"✅ Logged workout set: {workout_set.exercise_name} - {workout_set.weight}kg x {workout_set.reps}")
        
        return workout_set
        
    except Exception as e:
        logger.error(f"❌ Error logging workout set: {e}")
        raise e

def get_session_workout_sets(session_id: str) -> list:
    """
    Get all workout sets for a session
    """
    try:
        collection = get_workout_sets_collection()
        
        sets = list(collection.find(
            {'session_id': session_id}
        ).sort('timestamp', 1))
        
        # Convert ObjectId to string
        for s in sets:
            s['_id'] = str(s['_id'])
            if isinstance(s.get('timestamp'), datetime):
                s['timestamp'] = s['timestamp'].isoformat()
        
        return sets
        
    except Exception as e:
        logger.error(f"❌ Error getting session workout sets: {e}")
        raise e

def get_last_set_for_exercise(session_id: str, exercise_name: str) -> dict:
    """
    Get the last logged set for a specific exercise in a session
    """
    try:
        collection = get_workout_sets_collection()
        
        last_set = collection.find_one(
            {
                'session_id': session_id,
                'exercise_name': exercise_name
            },
            sort=[('timestamp', -1)]
        )
        
        if last_set:
            last_set['_id'] = str(last_set['_id'])
            if isinstance(last_set.get('timestamp'), datetime):
                last_set['timestamp'] = last_set['timestamp'].isoformat()
        
        return last_set
        
    except Exception as e:
        logger.error(f"❌ Error getting last set for exercise: {e}")
        raise e

def count_sets_for_exercise(session_id: str, exercise_name: str) -> int:
    """
    Count the number of sets logged for an exercise in a session
    """
    try:
        collection = get_workout_sets_collection()
        
        count = collection.count_documents({
            'session_id': session_id,
            'exercise_name': exercise_name
        })
        
        return count
        
    except Exception as e:
        logger.error(f"❌ Error counting sets for exercise: {e}")
        raise e

def update_session_stats(session_id: str):
    """
    Update session total_sets and total_volume based on logged sets
    """
    try:
        from database import get_sessions_collection
        
        sets_collection = get_workout_sets_collection()
        sessions_collection = get_sessions_collection()
        
        # Aggregate stats
        pipeline = [
            {'$match': {'session_id': session_id}},
            {'$group': {
                '_id': None,
                'total_sets': {'$sum': 1},
                'total_volume': {'$sum': '$volume'}
            }}
        ]
        
        result = list(sets_collection.aggregate(pipeline))
        
        if result:
            stats = result[0]
            sessions_collection.update_one(
                {'_id': ObjectId(session_id)},
                {'$set': {
                    'total_sets': stats['total_sets'],
                    'total_volume': stats['total_volume']
                }}
            )
            logger.info(f"✅ Updated session stats: {stats['total_sets']} sets, {stats['total_volume']} kg")
        
    except Exception as e:
        logger.error(f"❌ Error updating session stats: {e}")
        raise e
