# Database package
from .mongodb import (
    MongoDB, 
    get_users_collection, 
    get_workouts_collection,
    get_exercises_collection,
    get_sessions_collection,
    get_session_types_collection
)

__all__ = [
    'MongoDB', 
    'get_users_collection', 
    'get_workouts_collection',
    'get_exercises_collection',
    'get_sessions_collection',
    'get_session_types_collection'
]
