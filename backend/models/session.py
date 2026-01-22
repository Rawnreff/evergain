from datetime import datetime, timezone, timedelta
from bson import ObjectId

# WIB Timezone (GMT+7)
WIB = timezone(timedelta(hours=7))

class Session:
    """Workout session model"""
    
    def __init__(self, user_id, session_type, started_at=None, ended_at=None, 
                 total_sets=0, total_volume=0, exercises_performed=None, _id=None):
        self._id = _id
        self.user_id = user_id
        self.session_type = session_type
        # Store as UTC in database, but create from WIB time
        if started_at is None:
            # Get current WIB time and convert to UTC for storage
            wib_now = datetime.now(WIB)
            self.started_at = wib_now.astimezone(timezone.utc).replace(tzinfo=None)
        else:
            self.started_at = started_at
        self.ended_at = ended_at
        self.total_sets = total_sets
        self.total_volume = total_volume
        self.exercises_performed = exercises_performed or []
        self.is_active = ended_at is None
    
    def to_dict(self):
        """Convert to dictionary for MongoDB storage"""
        return {
            'user_id': self.user_id,
            'session_type': self.session_type,
            'started_at': self.started_at,
            'ended_at': self.ended_at,
            'total_sets': self.total_sets,
            'total_volume': self.total_volume,
            'exercises_performed': self.exercises_performed,
            'is_active': self.is_active
        }
    
    def to_json(self):
        """Convert to JSON-serializable dictionary"""
        data = self.to_dict()
        
        # Convert ObjectId to string
        if self._id:
            data['_id'] = str(self._id)
        
        # Convert datetime to WIB timezone and then to ISO format
        if self.started_at:
            # Assume stored datetime is UTC, convert to WIB
            utc_started = self.started_at.replace(tzinfo=timezone.utc)
            wib_started = utc_started.astimezone(WIB)
            data['started_at'] = wib_started.isoformat()
        else:
            data['started_at'] = None
            
        if self.ended_at:
            # Assume stored datetime is UTC, convert to WIB
            utc_ended = self.ended_at.replace(tzinfo=timezone.utc)
            wib_ended = utc_ended.astimezone(WIB)
            data['ended_at'] = wib_ended.isoformat()
        else:
            data['ended_at'] = None
        
        # Calculate duration if ended
        if self.ended_at and self.started_at:
            duration_seconds = (self.ended_at - self.started_at).total_seconds()
            data['duration_minutes'] = round(duration_seconds / 60, 1)
        
        return data
    
    @staticmethod
    def from_dict(data):
        """Create Session object from dictionary"""
        return Session(
            user_id=data.get('user_id'),
            session_type=data.get('session_type'),
            started_at=data.get('started_at'),
            ended_at=data.get('ended_at'),
            total_sets=data.get('total_sets', 0),
            total_volume=data.get('total_volume', 0),
            exercises_performed=data.get('exercises_performed', []),
            _id=data.get('_id')
        )
    
    def end_session(self):
        """Mark session as ended"""
        # Get current WIB time and convert to UTC for storage
        wib_now = datetime.now(WIB)
        self.ended_at = wib_now.astimezone(timezone.utc).replace(tzinfo=None)
        self.is_active = False
    
    def add_exercise_log(self, exercise_name, sets, reps, weight):
        """Add an exercise log to the session"""
        volume = sets * reps * weight
        # Get current WIB time and convert to UTC for storage
        wib_now = datetime.now(WIB)
        logged_at_utc = wib_now.astimezone(timezone.utc).replace(tzinfo=None)
        
        self.exercises_performed.append({
            'exercise': exercise_name,
            'sets': sets,
            'reps': reps,
            'weight': weight,
            'volume': volume,
            'logged_at': logged_at_utc
        })
        self.total_sets += sets
        self.total_volume += volume
