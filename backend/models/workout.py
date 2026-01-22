from datetime import datetime
from bson import ObjectId

class Workout:
    """Workout model for MongoDB"""
    
    def __init__(self, weight, reps, sets, feeling, 
                 progress_state='', advice='', color='', 
                 _id=None, created_at=None):
        self._id = _id if _id else ObjectId()
        self.weight = float(weight)
        self.reps = int(reps)
        self.sets = int(sets)
        self.feeling = feeling
        self.progress_state = progress_state
        self.advice = advice
        self.color = color
        self.created_at = created_at if created_at else datetime.utcnow()
    
    def to_dict(self):
        """Convert to dictionary for MongoDB"""
        return {
            '_id': self._id,
            'weight': self.weight,
            'reps': self.reps,
            'sets': self.sets,
            'feeling': self.feeling,
            'progress_state': self.progress_state,
            'advice': self.advice,
            'color': self.color,
            'created_at': self.created_at
        }
    
    def to_json(self):
        """Convert to JSON response"""
        return {
            'id': str(self._id),
            'weight': self.weight,
            'reps': self.reps,
            'sets': self.sets,
            'feeling': self.feeling,
            'progress_state': self.progress_state,
            'advice': self.advice,
            'color': self.color,
            'created_at': self.created_at.isoformat()
        }
    
    @staticmethod
    def from_dict(data):
        """Create Workout from MongoDB document"""
        if not data:
            return None
        return Workout(
            _id=data.get('_id'),
            weight=data.get('weight'),
            reps=data.get('reps'),
            sets=data.get('sets'),
            feeling=data.get('feeling'),
            progress_state=data.get('progress_state', ''),
            advice=data.get('advice', ''),
            color=data.get('color', ''),
            created_at=data.get('created_at')
        )

class AIResponse:
    """AI analysis response"""
    def __init__(self, status, advice, color, risk):
        self.status = status  # "progress_up", "stagnant", "unsafe", "down"
        self.advice = advice
        self.color = color
        self.risk = risk
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'status': self.status,
            'advice': self.advice,
            'color': self.color,
            'risk': self.risk
        }
