import json
import schedule
import time
import threading
from datetime import datetime
import cv2
import numpy as np
from gtts import gTTS
import pygame
import os
import tempfile

class MedicineAssistant:
    def __init__(self, data_file='medicine_data.json'):
        self.data_file = data_file
        self.medicines = self.load_medicines()
        self.camera = None
        self.last_detection_info = {}
        pygame.mixer.init()
        
    def load_medicines(self):
        """Load medicines from JSON file"""
        try:
            with open(self.data_file, 'r', encoding='utf-8') as f:
                data = json.load(f)
                return data['medicines']
        except FileNotFoundError:
            print("Medicine data file not found!")
            return []
    
    def save_medicines(self):
        """Save medicines back to JSON file"""
        data = {'medicines': self.medicines}
        with open(self.data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    
    def play_nepali_audio(self, text):
        """Convert Nepali text to speech and play it"""
        try:
            # Create temporary file for audio
            with tempfile.NamedTemporaryFile(delete=False, suffix='.mp3') as tmp_file:
                tts = gTTS(text=text, lang='ne')
                tts.save(tmp_file.name)
                
                # Play the audio
                pygame.mixer.music.load(tmp_file.name)
                pygame.mixer.music.play()
                
                # Wait for audio to finish
                while pygame.mixer.music.get_busy():
                    time.sleep(0.1)
                
                # Clean up temporary file
                os.unlink(tmp_file.name)
                
        except Exception as e:
            print(f"Audio playback error: {e}")
            # Fallback to text display
            print(f"Audio: {text}")
    
    def create_reminder_message(self, medicine):
        """Create Nepali reminder message"""
        pouch_colors = {
            'green': 'हरियो',
            'yellow': 'पहेंलो', 
            'blue': 'निलो',
            'red': 'रातो',
            'white': 'सेतो'
        }
        
        color = pouch_colors.get(medicine['pouch'], medicine['pouch'])
        dosage = medicine['dosage']
        name = medicine['name']
        
        if dosage == 1:
            message = f"तपाईंले {color} प्याकबाट {name} को १ वटा गोली लिनुहोस्।"
        else:
            message = f"तपाईंले {color} प्याकबाट {name} को {dosage} वटा गोली लिनुहोस्।"
            
        return message 
   
    def remind_medicine(self, medicine_id):
        """Remind user to take specific medicine"""
        medicine = next((m for m in self.medicines if m['id'] == medicine_id), None)
        if medicine and not medicine['taken']:
            message = self.create_reminder_message(medicine)
            print(f"Reminder: {message}")
            self.play_nepali_audio(message)
    
    def validate_time_format(self, time_str):
        """Validate and fix time format to HH:MM"""
        try:
            # Parse the time to validate it
            time_obj = datetime.strptime(time_str, "%H:%M")
            return time_obj.strftime("%H:%M")
        except ValueError:
            try:
                # Try parsing H:MM format and convert to HH:MM
                time_obj = datetime.strptime(time_str, "%H:%M")
                return time_obj.strftime("%H:%M")
            except ValueError:
                print(f"Invalid time format: {time_str}")
                return None
    
    def setup_reminders(self):
        """Setup scheduled reminders for all medicines"""
        schedule.clear()  # Clear existing schedules
        
        for medicine in self.medicines:
            time_str = medicine['time']
            validated_time = self.validate_time_format(time_str)
            
            if validated_time:
                try:
                    schedule.every().day.at(validated_time).do(
                        self.remind_medicine, medicine['id']
                    )
                    print(f"Scheduled reminder for {medicine['name']} at {validated_time}")
                except Exception as e:
                    print(f"Error scheduling {medicine['name']}: {e}")
            else:
                print(f"Skipping {medicine['name']} due to invalid time format: {time_str}")
    
    def detect_pouch_color(self, frame):
        """Detect pouch color from camera frame using majority color and rectangle detection"""
        # Convert to HSV for better color detection
        hsv = cv2.cvtColor(frame, cv2.COLOR_BGR2HSV)
        height, width = frame.shape[:2]
        
        # Define color ranges for different pouches
        color_ranges = {
            'green': ([40, 50, 50], [80, 255, 255]),
            'yellow': ([20, 100, 100], [30, 255, 255]),
            'blue': ([100, 50, 50], [130, 255, 255]),
            'red': ([0, 50, 50], [10, 255, 255]),
            'white': ([0, 0, 200], [180, 30, 255])
        }
        
        detected_colors = []
        color_info = {}
        
        for color_name, (lower, upper) in color_ranges.items():
            lower = np.array(lower)
            upper = np.array(upper)
            
            # Create mask for the color
            mask = cv2.inRange(hsv, lower, upper)
            
            # Apply morphological operations to clean up the mask
            kernel = np.ones((5, 5), np.uint8)
            mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
            mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
            
            # Find contours
            contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            
            best_contour = None
            best_score = 0
            
            for contour in contours:
                area = cv2.contourArea(contour)
                
                # Filter by minimum area
                if area < 2000:
                    continue
                
                # Get bounding rectangle
                x, y, w, h = cv2.boundingRect(contour)
                
                # Calculate rectangle properties
                aspect_ratio = float(w) / h
                extent = float(area) / (w * h)
                
                # Score based on area, aspect ratio (prefer square-ish), and extent
                area_score = min(area / 10000, 1.0)  # Normalize area score
                aspect_score = 1.0 - abs(aspect_ratio - 1.0)  # Prefer square shapes
                extent_score = extent  # How much of bounding box is filled
                
                # Combined score
                score = area_score * 0.4 + aspect_score * 0.3 + extent_score * 0.3
                
                if score > best_score and score > 0.3:  # Minimum threshold
                    best_score = score
                    best_contour = contour
            
            if best_contour is not None:
                # Calculate majority color percentage in the detected region
                x, y, w, h = cv2.boundingRect(best_contour)
                roi_mask = np.zeros(mask.shape, dtype=np.uint8)
                cv2.fillPoly(roi_mask, [best_contour], 255)
                
                # Count pixels of this color in the region
                color_pixels = cv2.countNonZero(cv2.bitwise_and(mask, roi_mask))
                total_pixels = cv2.countNonZero(roi_mask)
                
                if total_pixels > 0:
                    color_percentage = color_pixels / total_pixels
                    
                    # Only consider if this color is majority (>40%)
                    if color_percentage > 0.4:
                        color_info[color_name] = {
                            'percentage': color_percentage,
                            'area': cv2.contourArea(best_contour),
                            'contour': best_contour,
                            'bbox': (x, y, w, h),
                            'score': best_score
                        }
        
        # Sort by color percentage and area
        if color_info:
            sorted_colors = sorted(color_info.items(), 
                                 key=lambda x: (x[1]['percentage'], x[1]['area']), 
                                 reverse=True)
            
            # Return the most dominant color
            best_color = sorted_colors[0][0]
            detected_colors.append(best_color)
            
            # Store detection info for visualization
            self.last_detection_info = color_info
        
        return detected_colors
    
    def mark_medicine_taken(self, pouch_color):
        """Mark medicine as taken when correct pouch is detected"""
        current_time = datetime.now().strftime("%H:%M")
        
        for medicine in self.medicines:
            if (medicine['pouch'] == pouch_color and 
                not medicine['taken'] and
                abs(self.time_diff_minutes(current_time, medicine['time'])) <= 30):
                
                medicine['taken'] = True
                medicine['last_taken'] = datetime.now().isoformat()
                self.save_medicines()
                
                success_message = f"{medicine['name']} लिइयो। धन्यवाद!"
                print(f"Medicine taken: {medicine['name']}")
                self.play_nepali_audio(success_message)
                return True
        
        return False
    
    def time_diff_minutes(self, time1, time2):
        """Calculate difference between two times in minutes"""
        t1 = datetime.strptime(time1, "%H:%M")
        t2 = datetime.strptime(time2, "%H:%M")
        return abs((t1 - t2).total_seconds() / 60) 
   
    def start_camera_detection(self):
        """Start camera for pouch detection"""
        self.camera = cv2.VideoCapture(0)
        self.last_detection_info = {}
        
        if not self.camera.isOpened():
            print("Error: Could not open camera")
            return
        
        print("Camera started. Press 'q' to quit camera mode.")
        print("Hold medicine pouch in front of camera for detection")
        
        while True:
            ret, frame = self.camera.read()
            if not ret:
                break
            
            # Create a copy for drawing
            display_frame = frame.copy()
            
            # Detect pouch colors
            detected_colors = self.detect_pouch_color(frame)
            
            # Draw detection rectangles and information
            if hasattr(self, 'last_detection_info') and self.last_detection_info:
                for color_name, info in self.last_detection_info.items():
                    x, y, w, h = info['bbox']
                    percentage = info['percentage']
                    
                    # Choose rectangle color based on detected color
                    rect_colors = {
                        'green': (0, 255, 0),
                        'yellow': (0, 255, 255),
                        'blue': (255, 0, 0),
                        'red': (0, 0, 255),
                        'white': (255, 255, 255)
                    }
                    
                    rect_color = rect_colors.get(color_name, (128, 128, 128))
                    
                    # Draw rectangle around detected pouch
                    cv2.rectangle(display_frame, (x, y), (x + w, y + h), rect_color, 3)
                    
                    # Draw filled rectangle for text background
                    cv2.rectangle(display_frame, (x, y - 30), (x + 200, y), rect_color, -1)
                    
                    # Add text with color name and percentage
                    text = f"{color_name.upper()} {percentage:.1%}"
                    cv2.putText(display_frame, text, (x + 5, y - 10), 
                               cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2)
            
            # Display detected colors and status
            y_offset = 30
            for color in detected_colors:
                cv2.putText(display_frame, f"Detected: {color.upper()}", (10, y_offset), 
                           cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
                y_offset += 35
                
                # Try to mark medicine as taken
                if self.mark_medicine_taken(color):
                    cv2.putText(display_frame, "MEDICINE TAKEN!", (10, y_offset), 
                               cv2.FONT_HERSHEY_SIMPLEX, 1.2, (0, 255, 0), 3)
                    y_offset += 40
            
            # Add instructions
            cv2.putText(display_frame, "Hold pouch steady for detection", 
                       (10, display_frame.shape[0] - 60), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            cv2.putText(display_frame, "Press 'q' to quit", 
                       (10, display_frame.shape[0] - 30), 
                       cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2)
            
            # Show frame
            cv2.imshow('Medicine Pouch Detection', display_frame)
            
            # Break on 'q' key press
            if cv2.waitKey(1) & 0xFF == ord('q'):
                break
        
        self.camera.release()
        cv2.destroyAllWindows()
    
    def reset_daily_status(self):
        """Reset taken status for all medicines (call daily)"""
        for medicine in self.medicines:
            medicine['taken'] = False
        self.save_medicines()
        print("Daily medicine status reset")
    
    def get_medicine_status(self):
        """Get current status of all medicines"""
        status = {
            'taken': [],
            'pending': []
        }
        
        for medicine in self.medicines:
            if medicine['taken']:
                status['taken'].append(medicine)
            else:
                status['pending'].append(medicine)
        
        return status
    
    def run_scheduler(self):
        """Run the medicine reminder scheduler"""
        print("Medicine reminder system started...")
        self.setup_reminders()
        
        # Schedule daily reset at midnight
        schedule.every().day.at("00:00").do(self.reset_daily_status)
        
        while True:
            schedule.run_pending()
            time.sleep(1)

def main():
    assistant = MedicineAssistant()
    
    print("Smart Medicine Assistant for Elderly")
    print("====================================")
    print("1. Start reminder system")
    print("2. Start camera detection")
    print("3. Check medicine status")
    print("4. Add new medicine")
    print("5. Exit")
    
    while True:
        choice = input("\nEnter your choice (1-5): ").strip()
        
        if choice == '1':
            print("Starting reminder system...")
            try:
                scheduler_thread = threading.Thread(target=assistant.run_scheduler, daemon=True)
                scheduler_thread.start()
                print("Reminder system running in background. Press Enter to continue...")
                input()
            except Exception as e:
                print(f"Error starting reminder system: {e}")
                print("Please check your medicine data format.")
            
        elif choice == '2':
            assistant.start_camera_detection()
            
        elif choice == '3':
            status = assistant.get_medicine_status()
            print("\n--- Medicine Status ---")
            print("Taken:")
            for med in status['taken']:
                print(f"  ✓ {med['name']} ({med['pouch']} pouch) - {med['last_taken']}")
            print("Pending:")
            for med in status['pending']:
                print(f"  ○ {med['name']} ({med['pouch']} pouch) at {med['time']}")
                
        elif choice == '4':
            # Add new medicine functionality
            name = input("Medicine name: ")
            time_str = input("Time (HH:MM): ")
            dosage = int(input("Dosage (number of tablets): "))
            pouch = input("Pouch color: ").lower()
            
            new_id = max([m['id'] for m in assistant.medicines]) + 1 if assistant.medicines else 1
            new_medicine = {
                'id': new_id,
                'name': name,
                'time': time_str,
                'dosage': dosage,
                'pouch': pouch,
                'taken': False,
                'last_taken': None
            }
            
            assistant.medicines.append(new_medicine)
            assistant.save_medicines()
            print(f"Added {name} to medicine list")
            
        elif choice == '5':
            print("Goodbye!")
            break
            
        else:
            print("Invalid choice. Please try again.")

if __name__ == "__main__":
    main()