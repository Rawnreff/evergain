"""
Test workout sets API endpoints
"""
import requests
import json

API_URL = "http://192.168.1.4:8080/api"

def test_log_workout_set():
    """Test logging a workout set"""
    print("\n💪 Testing log workout set...")
    
    # First, start a session
    session_response = requests.post(
        f"{API_URL}/sessions/start",
        json={"user_id": "test_user", "session_type": "Hypertrophy"}
    )
    session = session_response.json()
    session_id = session['_id']
    print(f"✅ Started session: {session_id}")
    
    # Log a workout set
    set_data = {
        "session_id": session_id,
        "exercise_name": "Bench Press",
        "weight": 60,
        "reps": 10,
        "rpe": 7,
        "notes": "Felt good, controlled tempo"
    }
    
    response = requests.post(
        f"{API_URL}/workout-sets/log",
        json=set_data
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 201:
        logged_set = response.json()
        print(f"✅ Logged set: {logged_set['exercise_name']} - {logged_set['weight']}kg x {logged_set['reps']} @ RPE {logged_set['rpe']}")
        print(f"Set number: {logged_set['set_number']}")
        print(f"Volume: {logged_set['volume']} kg")
        return session_id
    else:
        print(f"❌ Error: {response.text}")
        return None

def test_get_session_sets(session_id):
    """Test getting all sets for a session"""
    print(f"\n📋 Testing get session sets for {session_id}...")
    
    response = requests.get(f"{API_URL}/workout-sets/session/{session_id}")
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        sets = response.json()
        print(f"✅ Found {len(sets)} sets")
        for s in sets:
            print(f"  - Set {s['set_number']}: {s['exercise_name']} - {s['weight']}kg x {s['reps']}")
        return True
    else:
        print(f"❌ Error: {response.text}")
        return False

def test_get_last_set(session_id):
    """Test getting last set for an exercise"""
    print(f"\n🔍 Testing get last set...")
    
    response = requests.get(
        f"{API_URL}/workout-sets/last-set",
        params={"session_id": session_id, "exercise_name": "Bench Press"}
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        last_set = response.json()
        if last_set:
            print(f"✅ Last set: {last_set['weight']}kg x {last_set['reps']} @ RPE {last_set.get('rpe', 'N/A')}")
        else:
            print("No previous set found")
        return True
    else:
        print(f"❌ Error: {response.text}")
        return False

def test_count_sets(session_id):
    """Test counting sets for an exercise"""
    print(f"\n🔢 Testing count sets...")
    
    response = requests.get(
        f"{API_URL}/workout-sets/count",
        params={"session_id": session_id, "exercise_name": "Bench Press"}
    )
    
    print(f"Status: {response.status_code}")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Set count: {data['count']}")
        return True
    else:
        print(f"❌ Error: {response.text}")
        return False

def test_multiple_sets(session_id):
    """Test logging multiple sets"""
    print(f"\n📊 Testing multiple sets...")
    
    sets_to_log = [
        {"weight": 60, "reps": 10, "rpe": 7},
        {"weight": 65, "reps": 8, "rpe": 8},
        {"weight": 70, "reps": 6, "rpe": 9},
    ]
    
    for set_data in sets_to_log:
        response = requests.post(
            f"{API_URL}/workout-sets/log",
            json={
                "session_id": session_id,
                "exercise_name": "Bench Press",
                **set_data
            }
        )
        if response.status_code == 201:
            logged = response.json()
            print(f"✅ Set {logged['set_number']}: {logged['weight']}kg x {logged['reps']}")
        else:
            print(f"❌ Failed to log set: {response.text}")
            return False
    
    return True

def test_session_stats_update(session_id):
    """Test that session stats are updated"""
    print(f"\n📈 Testing session stats update...")
    
    response = requests.get(f"{API_URL}/sessions/active?user_id=test_user")
    
    if response.status_code == 200:
        data = response.json()
        if data['active']:
            session = data['session']
            print(f"✅ Session stats:")
            print(f"  Total sets: {session['total_sets']}")
            print(f"  Total volume: {session['total_volume']} kg")
            return True
    
    print(f"❌ Error: {response.text}")
    return False

if __name__ == '__main__':
    print("=" * 60)
    print("🧪 WORKOUT SETS API TESTS")
    print("=" * 60)
    
    # Test logging a set
    session_id = test_log_workout_set()
    
    if session_id:
        # Test getting session sets
        test_get_session_sets(session_id)
        
        # Test getting last set
        test_get_last_set(session_id)
        
        # Test counting sets
        test_count_sets(session_id)
        
        # Test logging multiple sets
        test_multiple_sets(session_id)
        
        # Test session stats update
        test_session_stats_update(session_id)
        
        # Get all sets again
        test_get_session_sets(session_id)
        
        # Clean up - end session
        print("\n🏁 Ending session...")
        requests.post(f"{API_URL}/sessions/end", json={"user_id": "test_user"})
        print("✅ Session ended")
    
    print("\n" + "=" * 60)
    print("✅ All tests completed!")
