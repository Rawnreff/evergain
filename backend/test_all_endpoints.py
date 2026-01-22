"""
Test all critical endpoints to ensure they work
"""
import requests
import json

API_URL = "http://192.168.1.4:8080/api"

def test_health():
    """Test health check"""
    print("\n🏥 Testing health check...")
    try:
        response = requests.get("http://192.168.1.4:8080/")
        print(f"✅ Status: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_session_types():
    """Test session types endpoint"""
    print("\n📋 Testing session types...")
    try:
        response = requests.get(f"{API_URL}/sessions/types/categorized")
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        print(f"Categories: {list(data.keys())}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_exercises_for_session():
    """Test exercises endpoint"""
    print("\n🏋️ Testing exercises for Hypertrophy session...")
    try:
        response = requests.get(f"{API_URL}/sessions/exercises?session_type=Hypertrophy")
        print(f"✅ Status: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ Error response: {response.text}")
            return False
            
        data = response.json()
        
        # Check if data is a list
        if not isinstance(data, list):
            print(f"❌ Expected list, got: {type(data)}")
            print(f"Response: {data}")
            return False
            
        print(f"Found {len(data)} exercises")
        if data:
            print(f"Sample: {data[0]['name']} ({data[0]['muscle_group']})")
        return response.status_code == 200 and len(data) > 0
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return False

def test_start_session():
    """Test starting a session"""
    print("\n▶️ Testing start session...")
    try:
        response = requests.post(
            f"{API_URL}/sessions/start",
            json={"user_id": "test_user", "session_type": "Hypertrophy"}
        )
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        print(f"Session ID: {data.get('_id', 'N/A')}")
        print(f"Session Type: {data.get('session_type', 'N/A')}")
        return response.status_code == 201
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_active_session():
    """Test getting active session"""
    print("\n🔍 Testing get active session...")
    try:
        response = requests.get(f"{API_URL}/sessions/active?user_id=test_user")
        print(f"✅ Status: {response.status_code}")
        data = response.json()
        print(f"Active: {data.get('active', False)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_end_session():
    """Test ending a session"""
    print("\n⏹️ Testing end session...")
    try:
        response = requests.post(
            f"{API_URL}/sessions/end",
            json={"user_id": "test_user"}
        )
        print(f"✅ Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Duration: {data.get('duration_minutes', 'N/A')} minutes")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("🧪 EVERGAIN API ENDPOINT TESTS")
    print("=" * 60)
    
    results = {
        "Health Check": test_health(),
        "Session Types": test_session_types(),
        "Exercises": test_exercises_for_session(),
        "Start Session": test_start_session(),
        "Active Session": test_active_session(),
        "End Session": test_end_session(),
    }
    
    print("\n" + "=" * 60)
    print("📊 TEST RESULTS")
    print("=" * 60)
    
    for test_name, passed in results.items():
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{test_name:.<40} {status}")
    
    total = len(results)
    passed = sum(results.values())
    print(f"\nTotal: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Backend is working correctly.")
    else:
        print(f"\n⚠️ {total - passed} test(s) failed. Check the errors above.")
