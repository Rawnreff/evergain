from database import get_workouts_collection
from models.workout import Workout
from services.ai_service import AIService
import logging

logger = logging.getLogger(__name__)

class WorkoutService:
    """Workout management service"""
    
    def __init__(self):
        self.workouts_collection = get_workouts_collection()
        self.ai_service = AIService()
    
    def submit_workout(self, workout_data):
        """
        Submit a new workout session with AI analysis
        
        Args:
            workout_data: dict with weight, reps, sets, feeling
        
        Returns:
            Workout object with AI analysis
        """
        # Create workout object
        workout = Workout(
            weight=workout_data.get('weight'),
            reps=workout_data.get('reps'),
            sets=workout_data.get('sets'),
            feeling=workout_data.get('feeling', '')
        )
        
        # Get recent history for AI context
        history = self.get_recent_workouts(limit=5)
        
        # AI analysis
        try:
            ai_response = self.ai_service.analyze_workout(workout, history)
            workout.advice = ai_response.advice
            workout.color = ai_response.color
            workout.progress_state = ai_response.status
        except Exception as e:
            logger.error(f"AI analysis failed: {e}")
            # Fallback values
            workout.advice = "Recorded. Keep pushing!"
            workout.color = "#E0E0E0"
            workout.progress_state = "unknown"
        
        # Save to database
        result = self.workouts_collection.insert_one(workout.to_dict())
        workout._id = result.inserted_id
        
        logger.info(f"Workout submitted: {workout.weight}kg x {workout.reps} x {workout.sets}")
        
        return workout
    
    def get_recent_workouts(self, limit=20):
        """
        Get recent workout history
        
        Args:
            limit: Number of workouts to retrieve
        
        Returns:
            List of Workout objects
        """
        workouts_data = self.workouts_collection.find().sort('created_at', -1).limit(limit)
        workouts = [Workout.from_dict(data) for data in workouts_data]
        return workouts
    
    def get_history(self):
        """Get workout history (last 20 sessions)"""
        return self.get_recent_workouts(limit=20)
