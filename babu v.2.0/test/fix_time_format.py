#!/usr/bin/env python3
"""
Quick fix script to ensure all medicine times are in proper HH:MM format
"""

import json
from datetime import datetime

def fix_time_format(data_file='medicine_data.json'):
    """Fix time format in medicine data"""
    try:
        # Load current data
        with open(data_file, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        fixed_count = 0
        
        for medicine in data['medicines']:
            original_time = medicine['time']
            
            try:
                # Try to parse and reformat
                if ':' in original_time:
                    parts = original_time.split(':')
                    if len(parts) == 2:
                        hour = int(parts[0])
                        minute = int(parts[1])
                        
                        # Ensure valid time
                        if 0 <= hour <= 23 and 0 <= minute <= 59:
                            # Format as HH:MM
                            new_time = f"{hour:02d}:{minute:02d}"
                            if new_time != original_time:
                                medicine['time'] = new_time
                                print(f"Fixed {medicine['name']}: {original_time} → {new_time}")
                                fixed_count += 1
                        else:
                            print(f"Invalid time for {medicine['name']}: {original_time}")
                    else:
                        print(f"Invalid time format for {medicine['name']}: {original_time}")
                else:
                    print(f"No colon found in time for {medicine['name']}: {original_time}")
                    
            except ValueError as e:
                print(f"Error processing {medicine['name']} time '{original_time}': {e}")
        
        # Save fixed data
        if fixed_count > 0:
            with open(data_file, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            print(f"\nFixed {fixed_count} time formats and saved to {data_file}")
        else:
            print("No time format issues found.")
            
        return True
        
    except FileNotFoundError:
        print(f"File {data_file} not found!")
        return False
    except Exception as e:
        print(f"Error fixing time formats: {e}")
        return False

if __name__ == "__main__":
    print("Medicine Time Format Fixer")
    print("=========================")
    fix_time_format()