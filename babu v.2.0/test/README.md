# Smart Medicine Assistant for Elderly

A comprehensive medicine reminder and tracking system designed specifically for elderly users, featuring Nepali audio reminders and automatic medicine detection through camera-based pouch recognition.

## Features

### 🔔 Smart Reminders
- Scheduled audio reminders in Nepali language
- Clear instructions including dosage and pouch color
- Automatic daily reset functionality

### 📷 Enhanced Visual Detection
- Advanced camera-based medicine pouch detection
- Majority color analysis for accurate recognition
- Rectangle/square shape detection for better accuracy
- Real-time visual feedback with bounding boxes
- Color percentage display for confidence indication
- Automatic marking of medicines as "taken"

### 👨‍⚕️ Caregiver Dashboard
- Real-time medicine status monitoring
- Easy medicine management interface
- Daily adherence tracking

### 🏠 Local Operation
- No internet dependency for core functions
- JSON-based local data storage
- Privacy-focused design

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the system:**
   ```bash
   python medicine_assistant.py
   ```

3. **Open caregiver dashboard:**
   ```bash
   python caregiver_dashboard.py
   ```

## System Components

- **`medicine_assistant.py`** - Main system with reminders and detection
- **`caregiver_dashboard.py`** - GUI for medicine management
- **`medicine_data.json`** - Local medicine database
- **`test_system.py`** - Testing and validation tools

## Supported Pouch Colors
- Green (हरियो)
- Yellow (पहेंलो)
- Blue (निलो)
- Red (रातो)
- White (सेतो)

## Example Usage

### Adding a Medicine
```json
{
  "name": "Paracetamol",
  "time": "10:00",
  "dosage": 1,
  "pouch": "green"
}
```

### Nepali Audio Examples
- "तपाईंले हरियो प्याकबाट १ वटा गोली लिनुहोस्।" (Take 1 tablet from green pouch)
- "औषधि लिइयो। धन्यवाद!" (Medicine taken. Thank you!)

## Hardware Requirements
- Computer/Raspberry Pi with Python 3.7+
- USB Camera/Webcam
- Speakers for audio output
- Colored medicine pouches

## Documentation
See `setup_instructions.md` for detailed installation and configuration guide.

## Testing
Run the test suite to verify system functionality:
```bash
python test_system.py
```

## License
This project is designed for educational and healthcare assistance purposes.