"""
Seed exercises data to MongoDB with session tags
Run this script to populate the exercises collection with comprehensive exercise data
"""
from database import MongoDB
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Comprehensive exercise list with muscle groups and session tags
EXERCISES = [
    # Chest
    {"name": "Bench Press", "muscle_group": "Chest", "secondary": "Triceps", "sessions": ["Push", "Upper", "Torso", "Anterior Upper", "Chest & Back", "Push A", "Push B", "Hypertrophy", "Strength", "Full Body"]},
    {"name": "Incline Dumbbell Press", "muscle_group": "Upper Chest", "secondary": "Shoulder", "sessions": ["Push", "Upper", "Torso", "Anterior Upper", "Push A", "Push B", "Hypertrophy", "Full Body"]},
    {"name": "Chest Fly", "muscle_group": "Chest", "secondary": "", "sessions": ["Push", "Upper", "Torso", "Hypertrophy", "Accessory", "Full Body"]},
    {"name": "Cable Crossover", "muscle_group": "Chest", "secondary": "", "sessions": ["Push", "Upper", "Torso", "Hypertrophy", "Accessory", "Full Body"]},
    {"name": "Dips", "muscle_group": "Chest", "secondary": "Triceps", "sessions": ["Push", "Upper", "Arms", "Strength", "Hypertrophy", "Full Body"]},
    {"name": "Floor Press", "muscle_group": "Chest", "secondary": "Triceps", "sessions": ["Push", "Upper", "Strength", "Full Body"]},
    {"name": "Close Grip Bench Press", "muscle_group": "Triceps", "secondary": "Chest", "sessions": ["Push", "Upper", "Arms", "Shoulders & Arms", "Push A", "Push B", "Strength", "Full Body"]},
    {"name": "Push Up", "muscle_group": "Chest", "secondary": "", "sessions": ["Push", "Upper", "Active Recovery", "Conditioning", "Full Body"]},
    {"name": "Diamond Push Up", "muscle_group": "Triceps", "secondary": "Chest", "sessions": ["Push", "Upper", "Arms", "Full Body"]},
    {"name": "Landmine Press", "muscle_group": "Shoulder", "secondary": "Chest", "sessions": ["Push", "Upper", "Torso", "Shoulders & Arms", "Full Body"]},
    {"name": "Pullover", "muscle_group": "Chest", "secondary": "Lats", "sessions": ["Torso", "Chest & Back", "Upper", "Full Body"]},
    
    # Back
    {"name": "Barbell Row", "muscle_group": "Back", "secondary": "", "sessions": ["Pull", "Upper", "Torso", "Posterior Upper", "Chest & Back", "Pull A", "Pull B", "Strength", "Hypertrophy", "Full Body"]},
    {"name": "Pull Up", "muscle_group": "Lats", "secondary": "", "sessions": ["Pull", "Upper", "Torso", "Posterior Upper", "Posterior Chain", "Pull A", "Pull B", "Strength", "Hypertrophy", "Full Body"]},
    {"name": "Lat Pulldown", "muscle_group": "Lats", "secondary": "", "sessions": ["Pull", "Upper", "Torso", "Posterior Upper", "Pull A", "Pull B", "Hypertrophy", "Full Body"]},
    {"name": "Seated Cable Row", "muscle_group": "Mid Back", "secondary": "", "sessions": ["Pull", "Upper", "Torso", "Posterior Upper", "Pull A", "Pull B", "Hypertrophy", "Full Body"]},
    {"name": "T-Bar Row", "muscle_group": "Back", "secondary": "", "sessions": ["Pull", "Upper", "Torso", "Posterior Upper", "Strength", "Hypertrophy", "Full Body"]},
    {"name": "Pendlay Row", "muscle_group": "Back", "secondary": "", "sessions": ["Pull", "Upper", "Posterior Upper", "Strength", "Power", "Full Body"]},
    {"name": "Chin Up", "muscle_group": "Lats", "secondary": "Biceps", "sessions": ["Pull", "Upper", "Posterior Upper", "Arms", "Strength", "Full Body"]},
    {"name": "Single Arm Dumbbell Row", "muscle_group": "Back", "secondary": "", "sessions": ["Pull", "Upper", "Posterior Upper", "Hypertrophy", "Accessory", "Full Body"]},
    {"name": "Meadows Row", "muscle_group": "Back", "secondary": "", "sessions": ["Pull", "Upper", "Posterior Upper", "Hypertrophy", "Full Body"]},
    {"name": "Reverse Fly", "muscle_group": "Rear Delt", "secondary": "", "sessions": ["Pull", "Upper", "Posterior Upper", "Accessory", "Full Body"]},
    {"name": "Face Pull", "muscle_group": "Rear Delt", "secondary": "", "sessions": ["Pull", "Upper", "Posterior Upper", "Accessory", "Hypertrophy", "Full Body"]},
    
    # Legs - Quads
    {"name": "Barbell Squat", "muscle_group": "Quads", "secondary": "Glutes", "sessions": ["Legs", "Lower", "Anterior Chain", "Quads & Calves", "Strength", "Hypertrophy", "Power", "Full Body"]},
    {"name": "Leg Press", "muscle_group": "Quads", "secondary": "", "sessions": ["Legs", "Lower", "Anterior Chain", "Quads & Calves", "Hypertrophy", "Full Body"]},
    {"name": "Leg Extension", "muscle_group": "Quads", "secondary": "", "sessions": ["Legs", "Lower", "Anterior Chain", "Quads & Calves", "Hypertrophy", "Accessory", "Full Body"]},
    {"name": "Bulgarian Split Squat", "muscle_group": "Quads", "secondary": "Glutes", "sessions": ["Legs", "Lower", "Anterior Chain", "Quads & Calves", "Hypertrophy", "Full Body"]},
    {"name": "Front Squat", "muscle_group": "Quads", "secondary": "", "sessions": ["Legs", "Lower", "Anterior Chain", "Quads & Calves", "Strength", "Full Body"]},
    {"name": "Goblet Squat", "muscle_group": "Quads", "secondary": "", "sessions": ["Legs", "Lower", "Anterior Chain", "Quads & Calves", "Active Recovery", "Full Body"]},
    {"name": "Step Up", "muscle_group": "Quads", "secondary": "Glutes", "sessions": ["Legs", "Lower", "Anterior Chain", "Hypertrophy", "Full Body"]},
    {"name": "Hack Squat", "muscle_group": "Quads", "secondary": "", "sessions": ["Legs", "Lower", "Anterior Chain", "Quads & Calves", "Hypertrophy", "Full Body"]},
    {"name": "Walking Lunges", "muscle_group": "Quads", "secondary": "Glutes", "sessions": ["Legs", "Lower", "Anterior Chain", "Conditioning", "Full Body"]},
    {"name": "Sissy Squat", "muscle_group": "Quads", "secondary": "", "sessions": ["Legs", "Lower", "Anterior Chain", "Accessory", "Full Body"]},
    
    # Legs - Hamstrings/Glutes
    {"name": "Deadlift", "muscle_group": "Hamstrings", "secondary": "Lower Back", "sessions": ["Pull", "Lower", "Posterior Chain", "Hamstrings & Glutes", "Strength", "Power", "Full Body"]},
    {"name": "Romanian Deadlift", "muscle_group": "Hamstrings", "secondary": "", "sessions": ["Pull", "Lower", "Posterior Chain", "Hamstrings & Glutes", "Hypertrophy", "Full Body"]},
    {"name": "Leg Curl", "muscle_group": "Hamstrings", "secondary": "", "sessions": ["Legs", "Lower", "Posterior Chain", "Hamstrings & Glutes", "Hypertrophy", "Accessory", "Full Body"]},
    {"name": "Hip Thrust", "muscle_group": "Glutes", "secondary": "", "sessions": ["Legs", "Lower", "Posterior Chain", "Hamstrings & Glutes", "Hypertrophy", "Full Body"]},
    {"name": "Good Mornings", "muscle_group": "Hamstrings", "secondary": "Lower Back", "sessions": ["Pull", "Lower", "Posterior Chain", "Hamstrings & Glutes", "Full Body"]},
    {"name": "Glute Ham Raise", "muscle_group": "Hamstrings", "secondary": "", "sessions": ["Legs", "Lower", "Posterior Chain", "Hamstrings & Glutes", "Strength", "Full Body"]},
    {"name": "Sumo Deadlift", "muscle_group": "Glutes", "secondary": "Inner Thigh", "sessions": ["Pull", "Lower", "Posterior Chain", "Hamstrings & Glutes", "Strength", "Full Body"]},
    
    # Shoulder
    {"name": "Overhead Press", "muscle_group": "Shoulder", "secondary": "", "sessions": ["Push", "Upper", "Torso", "Anterior Upper", "Shoulders & Arms", "Strength", "Hypertrophy", "Full Body"]},
    {"name": "Dumbbell Lateral Raise", "muscle_group": "Side Delt", "secondary": "", "sessions": ["Push", "Upper", "Shoulders & Arms", "Accessory", "Hypertrophy", "Full Body"]},
    {"name": "Arnold Press", "muscle_group": "Shoulder", "secondary": "", "sessions": ["Push", "Upper", "Shoulders & Arms", "Hypertrophy", "Full Body"]},
    {"name": "Military Press", "muscle_group": "Shoulder", "secondary": "", "sessions": ["Push", "Upper", "Anterior Upper", "Shoulders & Arms", "Strength", "Full Body"]},
    {"name": "Front Raise", "muscle_group": "Front Delt", "secondary": "", "sessions": ["Push", "Upper", "Anterior Upper", "Shoulders & Arms", "Accessory", "Full Body"]},
    {"name": "Upright Row", "muscle_group": "Shoulder", "secondary": "Traps", "sessions": ["Pull", "Upper", "Posterior Upper", "Shoulders & Arms", "Full Body"]},
    
    # Arms - Triceps
    {"name": "Triceps Pushdown", "muscle_group": "Triceps", "secondary": "", "sessions": ["Push", "Upper", "Arms", "Shoulders & Arms", "Accessory", "Hypertrophy", "Full Body"]},
    {"name": "Skull Crushers", "muscle_group": "Triceps", "secondary": "", "sessions": ["Push", "Upper", "Arms", "Shoulders & Arms", "Hypertrophy", "Full Body"]},
    {"name": "Overhead Dumbbell Extension", "muscle_group": "Triceps", "secondary": "", "sessions": ["Push", "Upper", "Arms", "Shoulders & Arms", "Hypertrophy", "Full Body"]},
    {"name": "JM Press", "muscle_group": "Triceps", "secondary": "", "sessions": ["Push", "Upper", "Arms", "Shoulders & Arms", "Strength", "Full Body"]},
    
    # Arms - Biceps
    {"name": "Bicep Curl", "muscle_group": "Biceps", "secondary": "", "sessions": ["Pull", "Upper", "Arms", "Shoulders & Arms", "Hypertrophy", "Accessory", "Full Body"]},
    {"name": "Hammer Curl", "muscle_group": "Biceps", "secondary": "Brachialis", "sessions": ["Pull", "Upper", "Arms", "Shoulders & Arms", "Hypertrophy", "Full Body"]},
    {"name": "Preacher Curl", "muscle_group": "Biceps", "secondary": "", "sessions": ["Pull", "Upper", "Arms", "Shoulders & Arms", "Hypertrophy", "Full Body"]},
    {"name": "Concentration Curl", "muscle_group": "Biceps", "secondary": "", "sessions": ["Pull", "Upper", "Arms", "Shoulders & Arms", "Accessory", "Full Body"]},
    {"name": "Spider Curl", "muscle_group": "Biceps", "secondary": "", "sessions": ["Pull", "Upper", "Arms", "Hypertrophy", "Full Body"]},
    {"name": "Incline Curl", "muscle_group": "Biceps", "secondary": "", "sessions": ["Pull", "Upper", "Arms", "Hypertrophy", "Full Body"]},
    {"name": "Zottman Curl", "muscle_group": "Biceps", "secondary": "Forearms", "sessions": ["Pull", "Upper", "Arms", "Full Body"]},
    
    # Core
    {"name": "Plank", "muscle_group": "Abs", "secondary": "", "sessions": ["Core", "Anterior Chain", "Active Recovery", "Conditioning", "Full Body"]},
    {"name": "Hanging Leg Raise", "muscle_group": "Abs", "secondary": "", "sessions": ["Core", "Anterior Chain", "Hypertrophy", "Full Body"]},
    {"name": "Russian Twist", "muscle_group": "Obliques", "secondary": "", "sessions": ["Core", "Anterior Chain", "Conditioning", "Full Body"]},
    {"name": "Woodchopper", "muscle_group": "Obliques", "secondary": "", "sessions": ["Core", "Anterior Chain", "Power", "Full Body"]},
    {"name": "Side Plank", "muscle_group": "Obliques", "secondary": "", "sessions": ["Core", "Active Recovery", "Full Body"]},
    {"name": "Ab Wheel Rollout", "muscle_group": "Abs", "secondary": "", "sessions": ["Core", "Anterior Chain", "Strength", "Full Body"]},
    
    # Calves & Other
    {"name": "Standing Calf Raise", "muscle_group": "Calves", "secondary": "", "sessions": ["Legs", "Lower", "Quads & Calves", "Accessory", "Full Body"]},
    {"name": "Calf Press", "muscle_group": "Calves", "secondary": "", "sessions": ["Legs", "Lower", "Quads & Calves", "Accessory", "Full Body"]},
    {"name": "Shrugs", "muscle_group": "Traps", "secondary": "", "sessions": ["Pull", "Upper", "Posterior Upper", "Accessory", "Full Body"]},
    {"name": "Back Extension", "muscle_group": "Lower Back", "secondary": "", "sessions": ["Pull", "Lower", "Posterior Chain", "Active Recovery", "Full Body"]},
    {"name": "Rack Pull", "muscle_group": "Traps", "secondary": "Lower Back", "sessions": ["Pull", "Upper", "Posterior Upper", "Posterior Chain", "Strength", "Full Body"]},
    {"name": "Wrist Curl", "muscle_group": "Forearms", "secondary": "", "sessions": ["Pull", "Upper", "Arms", "Accessory", "Full Body"]},
    {"name": "Farmers Walk", "muscle_group": "Grip", "secondary": "Core", "sessions": ["Full Body", "Posterior Chain", "Conditioning", "Strength"]},
    {"name": "Tibialis Raise", "muscle_group": "Shin", "secondary": "", "sessions": ["Legs", "Lower", "Accessory", "Full Body"]},
    {"name": "Box Jump", "muscle_group": "Explosive Legs", "secondary": "", "sessions": ["Legs", "Lower", "Power", "Conditioning", "Full Body"]},
]

# Session types with descriptions
SESSION_TYPES = [
    {"name": "Push", "description": "Chest/Shoulders/Triceps", "category": "Split"},
    {"name": "Pull", "description": "Back/Biceps/Rear Delts", "category": "Split"},
    {"name": "Legs", "description": "Quads/Hamstrings/Glutes/Calves", "category": "Split"},
    {"name": "Upper", "description": "Entire Upper Body", "category": "Split"},
    {"name": "Lower", "description": "Entire Lower Body", "category": "Split"},
    {"name": "Arms", "description": "Biceps/Triceps/Forearms", "category": "Isolation"},
    {"name": "Chest & Back", "description": "Antagonist Upper", "category": "Antagonist"},
    {"name": "Shoulders & Arms", "description": "Arnold Style", "category": "Specialty"},
    {"name": "Posterior Chain", "description": "Hamstrings/Glutes/Lower Back", "category": "Movement Pattern"},
    {"name": "Anterior Chain", "description": "Quads/Abs/Chest", "category": "Movement Pattern"},
    {"name": "Quads & Calves", "description": "Legs Focus", "category": "Isolation"},
    {"name": "Hamstrings & Glutes", "description": "Hip Focus", "category": "Isolation"},
    {"name": "Torso", "description": "Chest/Back/Shoulders", "category": "Regional"},
    {"name": "Rest", "description": "Recovery", "category": "Recovery"},
    {"name": "Active Recovery", "description": "Light Cardio/Mobility", "category": "Recovery"},
    {"name": "Full Body", "description": "All Muscle Groups", "category": "Full Body"},
    {"name": "Core", "description": "Abs/Obliques/Lower Back", "category": "Isolation"},
    {"name": "Weak Point", "description": "Targeting Lagging Muscles", "category": "Specialty"},
    {"name": "Hypertrophy", "description": "Muscle Growth Focus", "category": "Goal"},
    {"name": "Strength", "description": "Heavy Compound Focus", "category": "Goal"},
    {"name": "Power", "description": "Explosive Movements", "category": "Goal"},
    {"name": "Conditioning", "description": "Cardio/Endurance", "category": "Goal"},
    {"name": "Mobility", "description": "Flexibility/Joint Health", "category": "Recovery"},
    {"name": "Deload", "description": "Light Intensity Week", "category": "Recovery"},
    {"name": "Push A", "description": "Variation 1", "category": "Variation"},
    {"name": "Push B", "description": "Variation 2", "category": "Variation"},
    {"name": "Pull A", "description": "Variation 1", "category": "Variation"},
    {"name": "Pull B", "description": "Variation 2", "category": "Variation"},
    {"name": "Posterior Upper", "description": "Back/Rear Delts", "category": "Regional"},
    {"name": "Anterior Upper", "description": "Chest/Front Delts", "category": "Regional"},
    {"name": "Accessory", "description": "Small Muscle Isolation", "category": "Specialty"},
]

def seed_exercises():
    """Seed exercises to database"""
    try:
        # Connect to MongoDB
        db = MongoDB.connect()
        exercises_collection = db['exercises']
        
        # Clear existing exercises
        result = exercises_collection.delete_many({})
        logger.info(f"🗑️  Cleared {result.deleted_count} existing exercises")
        
        # Insert new exercises
        result = exercises_collection.insert_many(EXERCISES)
        logger.info(f"✅ Successfully seeded {len(result.inserted_ids)} exercises")
        
        # Display sample
        logger.info("\n📋 Sample exercises with sessions:")
        for exercise in exercises_collection.find().limit(5):
            sessions_str = ", ".join(exercise['sessions'][:3])
            logger.info(f"  - {exercise['name']} ({exercise['muscle_group']}) [{sessions_str}...]")
        
        logger.info(f"\n✨ Total exercises in database: {exercises_collection.count_documents({})}")
        
    except Exception as e:
        logger.error(f"❌ Error seeding exercises: {e}")
        raise e

def seed_session_types():
    """Seed session types to database"""
    try:
        db = MongoDB.get_db()
        session_types_collection = db['session_types']
        
        # Clear existing session types
        result = session_types_collection.delete_many({})
        logger.info(f"🗑️  Cleared {result.deleted_count} existing session types")
        
        # Insert session types
        result = session_types_collection.insert_many(SESSION_TYPES)
        logger.info(f"✅ Successfully seeded {len(result.inserted_ids)} session types")
        
        # Display by category
        logger.info("\n📋 Session types by category:")
        categories = {}
        for session in SESSION_TYPES:
            cat = session['category']
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(session['name'])
        
        for cat, sessions in categories.items():
            logger.info(f"  {cat}: {', '.join(sessions)}")
        
    except Exception as e:
        logger.error(f"❌ Error seeding session types: {e}")
        raise e

if __name__ == '__main__':
    logger.info("🌱 Starting database seeding...")
    seed_exercises()
    seed_session_types()
    MongoDB.close()
    logger.info("🎉 Seeding complete!")
