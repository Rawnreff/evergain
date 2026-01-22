# Routes package
from .auth_routes import auth_bp
from .workout_routes import workout_bp
from .exercise_routes import exercise_bp
from .session_routes import session_bp
from .workout_set_routes import workout_set_bp

__all__ = ['auth_bp', 'workout_bp', 'exercise_bp', 'session_bp', 'workout_set_bp']

