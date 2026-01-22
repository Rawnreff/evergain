"""
Workout Set Model
Represents a single set of an exercise during a workout session
"""
from datetime import datetime, timezone, timedelta
from typing import Optional

# WIB Timezone (GMT+7)
WIB = timezone(timedelta(hours=7))

class WorkoutSet:
    def __init__(
        self,
        session_id: str,
        exercise_name: str,
        weight: float,
        reps: int,
        rpe: Optional[int] = None,
        notes: Optional[str] = None,
        set_number: int = 1,
        timestamp: Optional[datetime] = None,
        _id: Optional[str] = None
    ):
        self._id = _id
        self.session_id = session_id
        self.exercise_name = exercise_name
        self.weight = weight
        self.reps = reps
        self.rpe = rpe
        self.notes = notes
        self.set_number = set_number
        # Store as UTC in database, but create from WIB time
        if timestamp is None:
            wib_now = datetime.now(WIB)
            self.timestamp = wib_now.astimezone(timezone.utc).replace(tzinfo=None)
        else:
            self.timestamp = timestamp
    
    def to_json(self):
        """Convert to JSON-serializable dict"""
        # Convert timestamp to WIB if it's a datetime
        timestamp_str = None
        if isinstance(self.timestamp, datetime):
            # Assume stored datetime is UTC, convert to WIB
            utc_timestamp = self.timestamp.replace(tzinfo=timezone.utc)
            wib_timestamp = utc_timestamp.astimezone(WIB)
            timestamp_str = wib_timestamp.isoformat()
        elif self.timestamp:
            timestamp_str = self.timestamp
            
        return {
            '_id': str(self._id) if self._id else None,
            'session_id': self.session_id,
            'exercise_name': self.exercise_name,
            'weight': self.weight,
            'reps': self.reps,
            'rpe': self.rpe,
            'notes': self.notes,
            'set_number': self.set_number,
            'timestamp': timestamp_str,
            'volume': self.weight * self.reps
        }
    
    @staticmethod
    def from_dict(data: dict):
        """Create WorkoutSet from dictionary"""
        return WorkoutSet(
            _id=data.get('_id'),
            session_id=data['session_id'],
            exercise_name=data['exercise_name'],
            weight=float(data['weight']),
            reps=int(data['reps']),
            rpe=int(data['rpe']) if data.get('rpe') else None,
            notes=data.get('notes'),
            set_number=int(data.get('set_number', 1)),
            timestamp=data.get('timestamp')
        )
