"""
Direct test untuk MongoDB query
"""
from database import get_exercises_collection

def test_query():
    print("Testing MongoDB query...")
    
    try:
        exercises_collection = get_exercises_collection()
        print(f"✅ Collection retrieved: {exercises_collection.name}")
        
        # Test count
        total = exercises_collection.count_documents({})
        print(f"✅ Total exercises: {total}")
        
        # Test query untuk Push
        session_type = "Push"
        result = list(exercises_collection.find(
            {'sessions': session_type},
            {'_id': 0}
        ))
        
        print(f"✅ Exercises for {session_type}: {len(result)}")
        
        if result:
            print("\nFirst exercise:")
            print(result[0])
        
        return result
        
    except Exception as e:
        import traceback
        print(f"❌ Error: {e}")
        print(f"Traceback:\n{traceback.format_exc()}")
        return None

if __name__ == '__main__':
    test_query()
