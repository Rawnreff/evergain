from database import get_sessions_collection, get_session_types_collection
from models.session import Session
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class SessionService:
    """Session management service"""
    
    def __init__(self):
        self.sessions_collection = get_sessions_collection()
        self.session_types_collection = get_session_types_collection()
    
    def start_session(self, user_id, session_type):
        """
        Start a new workout session
        
        Args:
            user_id: User ID
            session_type: Type of workout session (e.g., "Push", "Pull", "Legs")
        
        Returns:
            Session object
        """
        # Check if user has an active session
        active_session = self.get_active_session(user_id)
        if active_session:
            raise ValueError("User already has an active session. Please end it first.")
        
        # Verify session type exists
        if not self.session_types_collection.find_one({"name": session_type}):
            raise ValueError(f"Invalid session type: {session_type}")
        
        # Create new session
        session = Session(
            user_id=user_id,
            session_type=session_type
        )
        
        # Save to database
        result = self.sessions_collection.insert_one(session.to_dict())
        session._id = result.inserted_id
        
        logger.info(f"✅ Started {session_type} session for user {user_id}")
        
        return session
    
    def end_session(self, user_id):
        """
        End current active session
        
        Args:
            user_id: User ID
        
        Returns:
            Updated Session object
        """
        from database.workout_sets import get_session_workout_sets
        
        # Get active session
        active_session = self.get_active_session(user_id)
        if not active_session:
            raise ValueError("No active session found")
        
        # Get all workout sets for this session
        workout_sets = get_session_workout_sets(str(active_session._id))
        
        # Calculate exercises performed (unique exercises with their stats)
        exercises_performed = []
        exercise_stats = {}
        
        for workout_set in workout_sets:
            exercise_name = workout_set['exercise_name']
            
            if exercise_name not in exercise_stats:
                exercise_stats[exercise_name] = {
                    'exercise': exercise_name,
                    'sets': 0,
                    'total_reps': 0,
                    'total_volume': 0,
                    'max_weight': 0
                }
            
            exercise_stats[exercise_name]['sets'] += 1
            exercise_stats[exercise_name]['total_reps'] += workout_set['reps']
            exercise_stats[exercise_name]['total_volume'] += workout_set['volume']
            exercise_stats[exercise_name]['max_weight'] = max(
                exercise_stats[exercise_name]['max_weight'],
                workout_set['weight']
            )
        
        # Convert to list
        exercises_performed = list(exercise_stats.values())
        
        # End the session
        active_session.end_session()
        
        # Update in database with exercises_performed
        self.sessions_collection.update_one(
            {'_id': active_session._id},
            {
                '$set': {
                    'ended_at': active_session.ended_at,
                    'is_active': False,
                    'exercises_performed': exercises_performed
                }
            }
        )
        
        duration = (active_session.ended_at - active_session.started_at).total_seconds() / 60
        logger.info(f"✅ Ended session for user {user_id}. Duration: {duration:.1f} minutes, Exercises: {len(exercises_performed)}")
        
        # Update the session object
        active_session.exercises_performed = exercises_performed
        
        return active_session
    
    def get_active_session(self, user_id):
        """
        Get user's active session if exists
        
        Args:
            user_id: User ID
        
        Returns:
            Session object or None
        """
        session_data = self.sessions_collection.find_one({
            'user_id': user_id,
            'is_active': True
        })
        
        if not session_data:
            return None
        
        return Session.from_dict(session_data)
    
    def get_session_history(self, user_id, limit=20):
        """
        Get user's session history
        
        Args:
            user_id: User ID
            limit: Maximum number of sessions to retrieve
        
        Returns:
            List of Session objects
        """
        sessions_data = self.sessions_collection.find({
            'user_id': user_id
        }).sort('started_at', -1).limit(limit)
        
        sessions = [Session.from_dict(data) for data in sessions_data]
        return sessions
    
    def get_session_types(self):
        """
        Get all available session types
        
        Returns:
            List of session type dictionaries
        """
        session_types = list(self.session_types_collection.find({}, {'_id': 0}))
        return session_types
    
    def get_session_types_by_category(self):
        """
        Get session types grouped by category
        
        Returns:
            Dictionary with categories as keys
        """
        session_types = self.get_session_types()
        
        categorized = {}
        for session_type in session_types:
            category = session_type['category']
            if category not in categorized:
                categorized[category] = []
            categorized[category].append(session_type)
        
        return categorized
    
    def update_session_stats(self, user_id, sets, volume):
        """
        Update session statistics when a workout is logged
        
        Args:
            user_id: User ID
            sets: Number of sets
            volume: Volume (weight * reps * sets)
        """
        active_session = self.get_active_session(user_id)
        if not active_session:
            logger.warning(f"No active session for user {user_id}. Stats not updated.")
            return
        
        # Update session stats
        self.sessions_collection.update_one(
            {'_id': active_session._id},
            {
                '$inc': {
                    'total_sets': sets,
                    'total_volume': volume
                }
            }
        )
        
        logger.info(f"Updated session stats: +{sets} sets, +{volume}kg volume")
