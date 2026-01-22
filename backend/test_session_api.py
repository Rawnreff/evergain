"""
Test script for session management endpoints
"""
import requests
import json
import time

BASE_URL = "http://localhost:8080"
USER_ID = "test_user"

def test_session_management():
    """Test complete session management flow"""
    
    print("=" * 60)
    print("SESSION MANAGEMENT API TEST")
    print("=" * 60)
    print()
    
    # Test 1: Get session types
    print("1️⃣ Testing GET /api/sessions/types")
    try:
        response = requests.get(f"{BASE_URL}/api/sessions/types")
        if response.status_code == 200:
            session_types = response.json()
            print(f"   ✅ Success! Found {len(session_types)} session types")
            print(f"   📋 Sample types:")
            for st in session_types[:5]:
                print(f"      - {st['name']}: {st['description']} ({st['category']})")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()
    
    # Test 2: Get categorized session types
    print("2️⃣ Testing GET /api/sessions/types/categorized")
    try:
        response = requests.get(f"{BASE_URL}/api/sessions/types/categorized")
        if response.status_code == 200:
            categorized = response.json()
            print(f"   ✅ Success! Found {len(categorized)} categories")
            for category, types in list(categorized.items())[:3]:
                print(f"   📁 {category}: {len(types)} types")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()
    
    # Test 3: Start a session
    print("3️⃣ Testing POST /api/sessions/start")
    session_id = None
    try:
        response = requests.post(
            f"{BASE_URL}/api/sessions/start",
            json={"user_id": USER_ID, "session_type": "Push"}
        )
        if response.status_code == 201:
            session = response.json()
            session_id = session.get('_id')
            print(f"   ✅ Success! Started Push session")
            print(f"   🏋️ Session ID: {session_id}")
            print(f"   ⏰ Started at: {session.get('started_at')}")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()
    
    # Test 4: Get active session
    print("4️⃣ Testing GET /api/sessions/active")
    try:
        response = requests.get(f"{BASE_URL}/api/sessions/active?user_id={USER_ID}")
        if response.status_code == 200:
            data = response.json()
            if data['active']:
                print(f"   ✅ Active session found!")
                print(f"   📊 Type: {data['session']['session_type']}")
            else:
                print(f"   ℹ️  No active session")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()
    
    # Test 5: Get exercises for session
    print("5️⃣ Testing GET /api/sessions/exercises?session_type=Push")
    try:
        response = requests.get(f"{BASE_URL}/api/sessions/exercises?session_type=Push")
        if response.status_code == 200:
            exercises = response.json()
            print(f"   ✅ Success! Found {len(exercises)} exercises for Push session")
            print(f"   💪 Sample exercises:")
            for ex in exercises[:5]:
                print(f"      - {ex['name']} ({ex['muscle_group']})")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()
    
    # Wait a bit to simulate workout
    print("⏳ Simulating workout... (3 seconds)")
    time.sleep(3)
    
    print()
    
    # Test 6: End session
    print("6️⃣ Testing POST /api/sessions/end")
    try:
        response = requests.post(
            f"{BASE_URL}/api/sessions/end",
            json={"user_id": USER_ID}
        )
        if response.status_code == 200:
            session = response.json()
            print(f"   ✅ Success! Session ended")
            if 'duration_minutes' in session:
                print(f"   ⏱️  Duration: {session['duration_minutes']} minutes")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ Error: {e}")
    
    print()
    
    # Test 7: Get session history
    print("7️⃣ Testing GET /api/sessions/history")
    try:
        response = requests.get(f"{BASE_URL}/api/sessions/history?user_id={USER_ID}")
        if response.status_code == 200:
            history = response.json()
            print(f"   ✅ Success! Found {len(history)} sessions in history")
            if history:
                latest = history[0]
                print(f"   📜 Latest session:")
                print(f"      Type: {latest['session_type']}")
                if 'duration_minutes' in latest:
                    print(f"      Duration: {latest['duration_minutes']} minutes")
        else:
            print(f"   ❌ Failed with status {response.status_code}")
    except Exception as e:
        print(f"   ❌ Error: {e}")

if __name__ == '__main__':
    print()
    print("⚠️  Make sure the backend server is running on port 8080")
    print()
    
    test_session_management()
    
    print()
    print("=" * 60)
    print("✨ Test complete!")
    print("=" * 60)
