"""
Test complete session flow with workout sets
"""
import requests
import json

API_URL = "http://192.168.1.4:8080/api"

def test_complete_session_flow():
    """Test complete session flow"""
    print("\n" + "="*60)
    print("🧪 TESTING COMPLETE SESSION FLOW")
    print("="*60)
    
    # 1. Start session
    print("\n1️⃣ Starting session...")
    response = requests.post(
        f"{API_URL}/sessions/start",
        json={"user_id": "test_user", "session_type": "Hypertrophy"}
    )
    session = response.json()
    session_id = session['_id']
    print(f"✅ Session started: {session_id}")
    
    # 2. Log multiple sets for different exercises
    print("\n2️⃣ Logging workout sets...")
    
    exercises = [
        {"name": "Bench Press", "sets": [
            {"weight": 60, "reps": 10, "rpe": 7},
            {"weight": 65, "reps": 8, "rpe": 8},
            {"weight": 70, "reps": 6, "rpe": 9}
        ]},
        {"name": "Cable Crossover", "sets": [
            {"weight": 30, "reps": 12, "rpe": 7},
            {"weight": 32, "reps": 10, "rpe": 8}
        ]},
        {"name": "Lat Pulldown", "sets": [
            {"weight": 50, "reps": 12, "rpe": 7},
            {"weight": 55, "reps": 10, "rpe": 8},
            {"weight": 60, "reps": 8, "rpe": 9}
        ]}
    ]
    
    total_logged = 0
    for exercise in exercises:
        print(f"\n  📋 {exercise['name']}:")
        for set_data in exercise['sets']:
            response = requests.post(
                f"{API_URL}/workout-sets/log",
                json={
                    "session_id": session_id,
                    "exercise_name": exercise['name'],
                    **set_data
                }
            )
            if response.status_code == 201:
                logged = response.json()
                print(f"    ✅ Set {logged['set_number']}: {logged['weight']}kg × {logged['reps']} @ RPE {logged.get('rpe', 'N/A')}")
                total_logged += 1
            else:
                print(f"    ❌ Failed: {response.text}")
    
    print(f"\n  Total sets logged: {total_logged}")
    
    # 3. Check active session stats
    print("\n3️⃣ Checking active session stats...")
    response = requests.get(f"{API_URL}/sessions/active?user_id=test_user")
    data = response.json()
    if data['active']:
        session = data['session']
        print(f"  ✅ Total Sets: {session['total_sets']}")
        print(f"  ✅ Total Volume: {session['total_volume']} kg")
    
    # 4. Get workout sets for session
    print("\n4️⃣ Getting workout sets...")
    response = requests.get(f"{API_URL}/sessions/{session_id}/workout-sets")
    workout_sets = response.json()
    print(f"  ✅ Found {len(workout_sets)} workout sets")
    
    # Group by exercise
    by_exercise = {}
    for ws in workout_sets:
        ex = ws['exercise_name']
        if ex not in by_exercise:
            by_exercise[ex] = []
        by_exercise[ex].append(ws)
    
    for ex, sets in by_exercise.items():
        print(f"    {ex}: {len(sets)} sets")
    
    # 5. End session
    print("\n5️⃣ Ending session...")
    response = requests.post(
        f"{API_URL}/sessions/end",
        json={"user_id": "test_user"}
    )
    
    if response.status_code == 200:
        completed = response.json()
        print(f"  ✅ Session ended successfully")
        print(f"  Duration: {completed.get('duration_minutes', 0):.1f} minutes")
        print(f"  Total Sets: {completed['total_sets']}")
        print(f"  Total Volume: {completed['total_volume']} kg")
        print(f"  Exercises Performed: {len(completed.get('exercises_performed', []))}")
        
        # Show exercises performed
        if completed.get('exercises_performed'):
            print("\n  📊 Exercise Summary:")
            for ex in completed['exercises_performed']:
                print(f"    • {ex['exercise']}: {ex['sets']} sets, {ex['total_reps']} reps, {ex['total_volume']} kg volume")
    
    # 6. Get session history
    print("\n6️⃣ Getting session history...")
    response = requests.get(f"{API_URL}/sessions/history?user_id=test_user&limit=1")
    history = response.json()
    
    if history:
        last_session = history[0]
        print(f"  ✅ Last session found:")
        print(f"    Session Type: {last_session['session_type']}")
        print(f"    Duration: {last_session.get('duration_minutes', 0):.1f} min")
        print(f"    Total Sets: {last_session['total_sets']}")
        print(f"    Total Volume: {last_session['total_volume']} kg")
        print(f"    Exercises: {len(last_session.get('exercises_performed', []))}")
        
        # Verify exercises_performed is populated
        if last_session.get('exercises_performed'):
            print("\n  ✅ exercises_performed is populated:")
            for ex in last_session['exercises_performed']:
                print(f"    • {ex['exercise']}: {ex['sets']} sets")
        else:
            print("\n  ❌ exercises_performed is EMPTY!")
    
    print("\n" + "="*60)
    print("✅ TEST COMPLETE")
    print("="*60)

if __name__ == '__main__':
    test_complete_session_flow()
