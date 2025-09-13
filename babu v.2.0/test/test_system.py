#!/usr/bin/env python3
"""
Test script for the Smart Medicine Assistant
This script allows you to test various components without hardware
"""

import json
import time
from datetime import datetime, timedelta
from medicine_assistant import MedicineAssistant

def test_audio_system():
    """Test the Nepali audio system"""
    print("Testing Nepali Audio System...")
    assistant = MedicineAssistant()
    
    test_messages = [
        "तपाईंले हरियो प्याकबाट १ वटा गोली लिनुहोस्।",
        "तपाईंले पहेंलो प्याकबाट २ वटा गोली लिनुहोस्।",
        "औषधि लिइयो। धन्यवाद!"
    ]
    
    for message in test_messages:
        print(f"Playing: {message}")
        assistant.play_nepali_audio(message)
        time.sleep(2)

def test_reminder_system():
    """Test the reminder scheduling system"""
    print("Testing Reminder System...")
    assistant = MedicineAssistant()
    
    # Create a test medicine with current time + 1 minute
    current_time = datetime.now()
    test_time = (current_time + timedelta(minutes=1)).strftime("%H:%M")
    
    test_medicine = {
        'id': 999,
        'name': 'Test Medicine',
        'time': test_time,
        'dosage': 1,
        'pouch': 'green',
        'taken': False,
        'last_taken': None
    }
    
    # Add test medicine temporarily
    assistant.medicines.append(test_medicine)
    assistant.setup_reminders()
    
    print(f"Test reminder set for {test_time}")
    print("Waiting for reminder... (Press Ctrl+C to stop)")
    
    try:
        import schedule
        for i in range(120):  # Wait up to 2 minutes
            schedule.run_pending()
            time.sleep(1)
            if i % 10 == 0:
                print(f"Waiting... {120-i} seconds remaining")
    except KeyboardInterrupt:
        print("Test stopped by user")
    
    # Remove test medicine
    assistant.medicines = [m for m in assistant.medicines if m['id'] != 999]

def test_color_detection():
    """Test color detection without camera"""
    print("Testing Color Detection Logic...")
    assistant = MedicineAssistant()
    
    # First, reset all medicines to not taken for testing
    print("Resetting medicine status for testing...")
    for medicine in assistant.medicines:
        medicine['taken'] = False
    assistant.save_medicines()
    
    # Show current medicine status
    print("\nCurrent medicines:")
    for medicine in assistant.medicines:
        status = "Taken" if medicine['taken'] else "Pending"
        print(f"- {medicine['name']} ({medicine['pouch']} pouch) at {medicine['time']}: {status}")
    
    # Test color detection with time window override for testing
    print("\nTesting color detection (overriding time restrictions for demo)...")
    test_colors = ['green', 'yellow', 'blue', 'red']
    
    for color in test_colors:
        print(f"\nSimulating {color} pouch detection...")
        
        # Find medicine with this pouch color
        matching_medicine = None
        for medicine in assistant.medicines:
            if medicine['pouch'] == color and not medicine['taken']:
                matching_medicine = medicine
                break
        
        if matching_medicine:
            # Override time restriction for testing
            original_method = assistant.mark_medicine_taken
            
            def test_mark_medicine_taken(pouch_color):
                from datetime import datetime
                for medicine in assistant.medicines:
                    if (medicine['pouch'] == pouch_color and not medicine['taken']):
                        medicine['taken'] = True
                        medicine['last_taken'] = datetime.now().isoformat()
                        assistant.save_medicines()
                        
                        success_message = f"{medicine['name']} लिइयो। धन्यवाद!"
                        print(f"✓ Medicine taken: {medicine['name']}")
                        # Skip audio for testing
                        return True
                return False
            
            # Use test method
            result = test_mark_medicine_taken(color)
            if result:
                print(f"✓ {matching_medicine['name']} marked as taken for {color} pouch")
            else:
                print(f"○ Failed to mark medicine for {color} pouch")
        else:
            print(f"○ No pending medicine found for {color} pouch")
        
        time.sleep(0.5)
    
    # Show final status
    print("\nFinal medicine status:")
    for medicine in assistant.medicines:
        status = "✓ Taken" if medicine['taken'] else "○ Pending"
        print(f"- {medicine['name']} ({medicine['pouch']} pouch): {status}")

def test_data_persistence():
    """Test JSON data loading and saving"""
    print("Testing Data Persistence...")
    
    # Create test data
    test_data = {
        "medicines": [
            {
                "id": 1,
                "name": "Test Medicine 1",
                "time": "09:00",
                "dosage": 1,
                "pouch": "green",
                "taken": False,
                "last_taken": None
            },
            {
                "id": 2,
                "name": "Test Medicine 2",
                "time": "15:00",
                "dosage": 2,
                "pouch": "yellow",
                "taken": True,
                "last_taken": datetime.now().isoformat()
            }
        ]
    }
    
    # Save test data
    with open('test_medicine_data.json', 'w') as f:
        json.dump(test_data, f, indent=2)
    
    # Load with assistant
    assistant = MedicineAssistant('test_medicine_data.json')
    
    print(f"Loaded {len(assistant.medicines)} medicines")
    for med in assistant.medicines:
        status = "Taken" if med['taken'] else "Pending"
        print(f"- {med['name']}: {status}")
    
    # Test status retrieval
    status = assistant.get_medicine_status()
    print(f"Status summary: {len(status['taken'])} taken, {len(status['pending'])} pending")
    
    # Cleanup
    import os
    os.remove('test_medicine_data.json')
    print("Test data cleaned up")

def simulate_daily_workflow():
    """Simulate a complete daily workflow"""
    print("Simulating Daily Workflow...")
    assistant = MedicineAssistant()
    
    print("1. Morning: Checking medicine status")
    status = assistant.get_medicine_status()
    print(f"Pending medicines: {len(status['pending'])}")
    
    print("2. Simulating medicine taking...")
    for medicine in assistant.medicines[:2]:  # Take first 2 medicines
        if not medicine['taken']:
            print(f"Taking {medicine['name']} from {medicine['pouch']} pouch")
            assistant.mark_medicine_taken(medicine['pouch'])
    
    print("3. Evening: Final status check")
    status = assistant.get_medicine_status()
    print(f"Taken: {len(status['taken'])}, Pending: {len(status['pending'])}")
    
    print("4. Resetting for next day")
    assistant.reset_daily_status()
    status = assistant.get_medicine_status()
    print(f"After reset - Pending: {len(status['pending'])}")

def main():
    """Main test menu"""
    print("Smart Medicine Assistant - Test Suite")
    print("====================================")
    
    tests = {
        '1': ('Test Audio System', test_audio_system),
        '2': ('Test Reminder System', test_reminder_system),
        '3': ('Test Color Detection Logic', test_color_detection),
        '4': ('Test Data Persistence', test_data_persistence),
        '5': ('Simulate Daily Workflow', simulate_daily_workflow),
        '6': ('Run All Tests', lambda: [test() for _, test in tests.values() if test != main])
    }
    
    while True:
        print("\nAvailable Tests:")
        for key, (name, _) in tests.items():
            print(f"{key}. {name}")
        print("0. Exit")
        
        choice = input("\nSelect test (0-6): ").strip()
        
        if choice == '0':
            print("Goodbye!")
            break
        elif choice in tests:
            print(f"\n--- {tests[choice][0]} ---")
            try:
                tests[choice][1]()
            except Exception as e:
                print(f"Test failed with error: {e}")
            print("--- Test Complete ---")
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()