#!/usr/bin/env python3
"""
Test script for improved color detection with majority color analysis
"""

import cv2
import numpy as np
from medicine_assistant import MedicineAssistant

def test_color_detection_live():
    """Test color detection with live camera feed"""
    print("Testing Improved Color Detection")
    print("===============================")
    print("This will open your camera to test the new color detection system")
    print("Features:")
    print("- Majority color analysis")
    print("- Rectangle detection for square/rectangular pouches")
    print("- Visual feedback with bounding boxes")
    print("- Color percentage display")
    print("\nPress 'q' to quit the test")
    
    assistant = MedicineAssistant()
    
    # Start camera detection
    assistant.start_camera_detection()

def create_test_image():
    """Create a test image with colored rectangles for testing"""
    # Create a blank image
    img = np.zeros((480, 640, 3), dtype=np.uint8)
    
    # Add colored rectangles
    # Green rectangle
    cv2.rectangle(img, (50, 50), (150, 150), (0, 255, 0), -1)
    
    # Yellow rectangle
    cv2.rectangle(img, (200, 50), (300, 150), (0, 255, 255), -1)
    
    # Blue rectangle
    cv2.rectangle(img, (350, 50), (450, 150), (255, 0, 0), -1)
    
    # Red rectangle
    cv2.rectangle(img, (50, 200), (150, 300), (0, 0, 255), -1)
    
    # White rectangle
    cv2.rectangle(img, (200, 200), (300, 300), (255, 255, 255), -1)
    
    # Add some noise
    noise = np.random.randint(0, 50, img.shape, dtype=np.uint8)
    img = cv2.add(img, noise)
    
    return img

def test_static_image():
    """Test color detection on a static test image"""
    print("Testing with static image...")
    
    assistant = MedicineAssistant()
    test_img = create_test_image()
    
    # Test detection
    detected_colors = assistant.detect_pouch_color(test_img)
    
    print(f"Detected colors: {detected_colors}")
    
    # Show the test image with detection results
    display_img = test_img.copy()
    
    # Draw detection info if available
    if hasattr(assistant, 'last_detection_info') and assistant.last_detection_info:
        for color_name, info in assistant.last_detection_info.items():
            x, y, w, h = info['bbox']
            percentage = info['percentage']
            
            # Choose rectangle color
            rect_colors = {
                'green': (0, 255, 0),
                'yellow': (0, 255, 255),
                'blue': (255, 0, 0),
                'red': (0, 0, 255),
                'white': (255, 255, 255)
            }
            
            rect_color = rect_colors.get(color_name, (128, 128, 128))
            
            # Draw rectangle
            cv2.rectangle(display_img, (x, y), (x + w, y + h), rect_color, 3)
            
            # Add text
            text = f"{color_name.upper()} {percentage:.1%}"
            cv2.putText(display_img, text, (x, y - 10), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, rect_color, 2)
    
    # Display the image
    cv2.imshow('Color Detection Test', display_img)
    print("Press any key to close the test image...")
    cv2.waitKey(0)
    cv2.destroyAllWindows()

def benchmark_detection():
    """Benchmark the detection performance"""
    print("Benchmarking detection performance...")
    
    assistant = MedicineAssistant()
    test_img = create_test_image()
    
    import time
    
    # Warm up
    for _ in range(5):
        assistant.detect_pouch_color(test_img)
    
    # Benchmark
    start_time = time.time()
    num_tests = 100
    
    for _ in range(num_tests):
        detected_colors = assistant.detect_pouch_color(test_img)
    
    end_time = time.time()
    avg_time = (end_time - start_time) / num_tests
    
    print(f"Average detection time: {avg_time*1000:.2f} ms")
    print(f"FPS capability: {1/avg_time:.1f} FPS")

def main():
    """Main test menu"""
    print("Color Detection Test Suite")
    print("=========================")
    
    tests = {
        '1': ('Test Live Camera Detection', test_color_detection_live),
        '2': ('Test Static Image Detection', test_static_image),
        '3': ('Benchmark Performance', benchmark_detection),
        '4': ('Run All Tests', lambda: [test_static_image(), benchmark_detection()])
    }
    
    while True:
        print("\nAvailable Tests:")
        for key, (name, _) in tests.items():
            print(f"{key}. {name}")
        print("0. Exit")
        
        choice = input("\nSelect test (0-4): ").strip()
        
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