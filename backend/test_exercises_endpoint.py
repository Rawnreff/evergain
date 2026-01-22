"""
Test the exercises endpoint to diagnose the issue
"""
import sys
import traceback
from database import MongoDB, get_exercises_collection

def test_direct_query():
    """Test querying exercises directly"""
    try:
        print("🔍 Testing direct database query...")
        
        # Connect to MongoDB
        db = MongoDB.connect()
        print("✅ Connected to MongoDB")
        
        # Get exercises collection
        exercises_collection = get_exercises_collection()
        print(f"✅ Got exercises collection")
        
        # Count total exercises
        total = exercises_collection.count_documents({})
        print(f"📊 Total exercises in collection: {total}")
        
        # Test query for Hypertrophy
        session_type = "Hypertrophy"
        print(f"\n🔍 Querying exercises for session type: {session_type}")
        
        exercises = list(exercises_collection.find(
            {'sessions': session_type},
            {'_id': 0}
        ))
        
        print(f"✅ Found {len(exercises)} exercises for {session_type}")
        
        if exercises:
            print("\n📋 Sample exercises:")
            for ex in exercises[:5]:
                print(f"  - {ex['name']} ({ex['muscle_group']})")
        
        return exercises
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print(f"Traceback:\n{traceback.format_exc()}")
        return None
    finally:
        MongoDB.close()

if __name__ == '__main__':
    test_direct_query()
