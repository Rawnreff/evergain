"""
Quick diagnostic script to test all session endpoints
Run this to verify the backend is working correctly
"""
import requests
import json

API_URL = "http://localhost:8080/api"

print("=" * 60)
print("🔍 EVERGAIN API DIAGNOSTIC")
print("=" * 60)
print()

# Test 1: Health check
print("1️⃣ Testing Health Check...")
try:
    response = requests.get("http://localhost:8080/")
    if response.status_code == 200:
        print("   ✅ Backend is running")
        print(f"   Status: {response.json()['status']}")
    else:
        print(f"   ❌ Unexpected status: {response.status_code}")
except Exception as e:
    print(f"   ❌ Backend not reachable: {e}")
    exit(1)

print()

# Test 2: Session types (flat)
print("2️⃣ Testing GET /api/sessions/types...")
try:
    response = requests.get(f"{API_URL}/sessions/types")
    if response.status_code == 200:
        types = response.json()
        print(f"   ✅ Found {len(types)} session types")
    else:
        print(f"   ❌ Failed: {response.status_code}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print()

# Test 3: Session types (categorized) - THIS IS WHAT THE APP USES
print("3️⃣ Testing GET /api/sessions/types/categorized...")
try:
    response = requests.get(f"{API_URL}/sessions/types/categorized")
    if response.status_code == 200:
        categorized = response.json()
        print(f"   ✅ Found {len(categorized)} categories:")
        for category, types in categorized.items():
            print(f"      - {category}: {len(types)} types")
        
        # Save response for inspection
        with open('session_types_response.json', 'w') as f:
            json.dump(categorized, f, indent=2)
        print("   📄 Saved response to: session_types_response.json")
    else:
        print(f"   ❌ Failed: {response.status_code}")
        print(f"   Response: {response.text}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print()

# Test 4: Active session check
print("4️⃣ Testing GET /api/sessions/active...")
try:
    response = requests.get(f"{API_URL}/sessions/active?user_id=default_user")
    if response.status_code == 200:
        data = response.json()
        print(f"   ✅ Active: {data['active']}")
        if data['active']:
            print(f"   Session: {data['session']['session_type']}")
    else:
        print(f"   ❌ Failed: {response.status_code}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print()

# Test 5: Exercises for a session
print("5️⃣ Testing GET /api/sessions/exercises?session_type=Push...")
try:
    response = requests.get(f"{API_URL}/sessions/exercises?session_type=Push")
    if response.status_code == 200:
        exercises = response.json()
        print(f"   ✅ Found {len(exercises)} exercises for Push")
        print(f"   Sample: {exercises[0]['name'] if exercises else 'None'}")
    else:
        print(f"   ❌ Failed: {response.status_code}")
except Exception as e:
    print(f"   ❌ Error: {e}")

print()
print("=" * 60)
print("✨ Diagnostic Complete!")
print()
print("📋 If all tests passed:")
print("   - Backend is working correctly")
print("   - Issue is likely in the frontend")
print("   - Check React Native console logs")
print("   - Try different API_URL in logger.tsx:")
print("     • Android Emulator: http://10.0.2.2:8080/api")
print("     • iOS Simulator: http://localhost:8080/api")
print("     • Physical Device: http://YOUR_IP:8080/api")
print("=" * 60)
