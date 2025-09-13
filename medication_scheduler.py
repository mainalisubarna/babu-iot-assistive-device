#!/usr/bin/env python3
"""
Medication Scheduler for elderly care
"""

import json
import time
import threading
from datetime import datetime
from typing import Dict, Optional

class MedicationScheduler:
    def __init__(self, schedule_file="medication_schedule.json"):
        self.schedule_file = schedule_file
        self.schedule = {}
        self.active_reminders = {}
        self.reminder_thread = None
        self.is_running = False
        
        self.color_names_nepali = {
            "red": "rato", "green": "hariyo", "blue": "nilo",
            "yellow": "pahelo", "white": "seto", "black": "kalo"
        }
        
        self._load_schedule()
    
    def _load_schedule(self):
        """Load medication schedule"""
        try:
            with open(self.schedule_file, 'r', encoding='utf-8') as f:
                self.schedule = json.load(f)
            print(f"✓ Loaded {len(self.schedule)} medications")
        except FileNotFoundError:
            print("⚠️  Creating default schedule")
            self._create_default_schedule()
        except Exception as e:
            print(f"✗ Schedule error: {e}")
            self._create_default_schedule()
    
    def _create_default_schedule(self):
        """Create default schedule"""
        self.schedule = {
            "morning_bp": {
                "name": "Blood Pressure Medicine",
                "color": "green",
                "times": ["08:00", "20:00"],
                "dosage": "1 tablet",
                "instructions": "khana khanu aghi"
            },
            "diabetes": {
                "name": "Diabetes Medicine", 
                "color": "red",
                "times": ["07:30", "19:30"],
                "dosage": "1 tablet",
                "instructions": "khana khanu aghi"
            }
        }
        self._save_schedule()
    
    def _save_schedule(self):
        """Save schedule to file"""
        try:
            with open(self.schedule_file, 'w', encoding='utf-8') as f:
                json.dump(self.schedule, f, indent=2, ensure_ascii=False)
        except Exception as e:
            print(f"✗ Save error: {e}")
    
    def get_current_medication(self) -> Optional[Dict]:
        """Get medication due now (within 30 minutes)"""
        current_time = datetime.now()
        
        for med_id, med_info in self.schedule.items():
            for scheduled_time in med_info["times"]:
                scheduled_dt = datetime.strptime(scheduled_time, "%H:%M").replace(
                    year=current_time.year,
                    month=current_time.month, 
                    day=current_time.day
                )
                
                time_diff = abs((current_time - scheduled_dt).total_seconds())
                if time_diff <= 1800:  # 30 minutes
                    return {
                        "id": med_id,
                        "name": med_info["name"],
                        "color": med_info["color"],
                        "color_nepali": self.color_names_nepali.get(med_info["color"]),
                        "dosage": med_info["dosage"],
                        "instructions": med_info.get("instructions", ""),
                        "scheduled_time": scheduled_time
                    }
        return None
    
    def generate_reminder_message(self, medication: Dict) -> str:
        """Generate Nepali reminder message"""
        color_nepali = medication["color_nepali"]
        return f"aushadhi khane bela bhayo, {color_nepali} gulcha liyera aaunu"
    
    def start_scheduler(self):
        """Start the medication scheduler thread"""
        self.is_running = True
        self.reminder_thread = threading.Thread(target=self._scheduler_loop, daemon=True)
        self.reminder_thread.start()
        print("✓ Medication scheduler started")
    
    def stop_scheduler(self):
        """Stop the medication scheduler"""
        self.is_running = False
        if self.reminder_thread:
            self.reminder_thread.join(timeout=2.0)
        print("✓ Medication scheduler stopped")
    
    def _scheduler_loop(self):
        """Main scheduler loop"""
        while self.is_running:
            try:
                current_med = self.get_current_medication()
                if current_med and current_med["id"] not in self.active_reminders:
                    self.active_reminders[current_med["id"]] = {
                        "medication": current_med,
                        "reminder_time": datetime.now(),
                        "acknowledged": False
                    }
                    print(f"🔔 Reminder: {current_med['name']} ({current_med['color']})")
                
                # Clean up old reminders (1 hour)
                current_time = datetime.now()
                expired = [
                    med_id for med_id, reminder in self.active_reminders.items()
                    if (current_time - reminder["reminder_time"]).total_seconds() > 3600
                ]
                for med_id in expired:
                    del self.active_reminders[med_id]
                
                time.sleep(60)
                
            except Exception as e:
                print(f"✗ Scheduler error: {e}")
                time.sleep(60)
    
    def get_active_reminder(self) -> Optional[Dict]:
        """Get the current active medication reminder"""
        for reminder in self.active_reminders.values():
            if not reminder["acknowledged"]:
                return reminder["medication"]
        return None
    
    def acknowledge_reminder(self, med_id: str):
        """Mark a reminder as acknowledged"""
        if med_id in self.active_reminders:
            self.active_reminders[med_id]["acknowledged"] = True
            print(f"✓ Medication reminder acknowledged: {med_id}")
