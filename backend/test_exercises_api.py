"""
Test script to verify the exercises API endpoint
"""
import requests
import json

BASE_URL = "http://localhost:8080"

def test_exercises_api():
    """Test exercises endpoints"""
    
    print("🧪 Testing Exercises API...\n")
    
    # Test 1: Get all exercises
    print("1️⃣ Testing GET /api/exercises/")
    try:
        response = requests.get(f"{BASE_URL}/api/exercises/")
        if response.status_code == 200:
            exercises = response.json()
            print(f"   ✅ Success! Found {len(exercises)} exercises")
            print(f"   📋 Sample exercises:")
            for ex in exercises[:5]:
                print(f"      - {ex['name']} ({ex['muscle_group']})")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()
    
    # Test 2: Get muscle groups
    print("2️⃣ Testing GET /api/exercises/muscle-groups")
    try:
        response = requests.get(f"{BASE_URL}/api/exercises/muscle-groups")
        if response.status_code == 200:
            muscle_groups = response.json()
            print(f"   ✅ Success! Found {len(muscle_groups)} muscle groups")
            print(f"   💪 Muscle groups: {', '.join(muscle_groups[:10])}")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == '__main__':
    print("=" * 60)
    print("EVERGAIN EXERCISES API TEST")
    print("=" * 60)
    print()
    print("⚠️  Make sure the backend server is running on port 8080")
    print()
    
    test_exercises_api()
    
    print()
    print("=" * 60)
    print("✨ Test complete!")
    print("=" * 60)
