# Smart Medicine Assistant Setup Instructions

## Overview
This system helps elderly people take their medicines on time with Nepali audio reminders and automatic tracking through camera-based pouch detection.

## System Requirements
- Python 3.7 or higher
- Webcam/Camera (for pouch detection)
- Speakers (for audio reminders)
- Internet connection (for text-to-speech)

## Installation Steps

### 1. Install Python Dependencies
```bash
pip install -r requirements.txt
```

### 2. Additional System Dependencies

#### For Windows:
- Install Visual C++ Build Tools if OpenCV installation fails
- Ensure camera drivers are properly installed

#### For Raspberry Pi/Linux:
```bash
sudo apt-get update
sudo apt-get install python3-opencv
sudo apt-get install espeak espeak-data libespeak1 libespeak-dev
sudo apt-get install portaudio19-dev python3-pyaudio
```

### 3. Test Installation
```bash
python test_system.py
```

## File Structure
```
medicine-assistant/
├── medicine_data.json          # Medicine database
├── medicine_assistant.py       # Main system logic
├── caregiver_dashboard.py      # GUI for caregivers
├── test_system.py             # Testing utilities
├── requirements.txt           # Python dependencies
└── setup_instructions.md     # This file
```

## Usage Guide

### For Caregivers

#### 1. Setup Medicines
Run the caregiver dashboard:
```bash
python caregiver_dashboard.py
```

- Use the "Manage Medicines" tab to add medicines
- Specify: name, time, dosage, and pouch color
- Colors supported: green, yellow, blue, red, white

#### 2. Monitor Status
- "Medicine Status" tab shows today's progress
- Green checkmark = taken, Circle = pending
- Refresh button updates the display

### For Daily Operation

#### 1. Start the System
```bash
python medicine_assistant.py
```

#### 2. Menu Options
1. **Start reminder system** - Begins scheduled audio reminders
2. **Start camera detection** - Activates pouch detection
3. **Check medicine status** - Shows current progress
4. **Add new medicine** - Quick medicine addition
5. **Exit** - Close the system

### Camera Detection
- Position camera to clearly see medicine pouches
- Hold pouch in front of camera when taking medicine
- System detects color and marks medicine as taken
- Success message plays in Nepali

## Configuration

### Medicine Data Format
```json
{
  "medicines": [
    {
      "id": 1,
      "name": "Paracetamol",
      "time": "10:00",
      "dosage": 1,
      "pouch": "green",
      "taken": false,
      "last_taken": null
    }
  ]
}
```

### Pouch Colors
Ensure pouches are clearly colored for detection:
- **Green**: HSV range [40-80, 50-255, 50-255]
- **Yellow**: HSV range [20-30, 100-255, 100-255]
- **Blue**: HSV range [100-130, 50-255, 50-255]
- **Red**: HSV range [0-10, 50-255, 50-255]
- **White**: HSV range [0-180, 0-30, 200-255]

## Troubleshooting

### Audio Issues
- Check internet connection for TTS
- Verify speakers are working
- Test with: `python test_system.py` → option 1

### Camera Issues
- Ensure camera is connected and recognized
- Check camera permissions
- Test with: `python test_system.py` → option 3

### Reminder Issues
- Verify system time is correct
- Check medicine times in JSON file
- Test with: `python test_system.py` → option 2

### Common Errors

#### "Could not open camera"
- Check if camera is being used by another application
- Try different camera index (change `cv2.VideoCapture(0)` to `cv2.VideoCapture(1)`)

#### "Module not found" errors
- Reinstall requirements: `pip install -r requirements.txt`
- Use virtual environment if needed

#### Audio playback errors
- Install additional audio codecs
- Check pygame installation: `pip install --upgrade pygame`

## Deployment on Raspberry Pi

### 1. Hardware Setup
- Connect USB camera
- Connect speakers to audio jack
- Ensure stable power supply

### 2. Auto-start Configuration
Create systemd service:
```bash
sudo nano /etc/systemd/system/medicine-assistant.service
```

Add:
```ini
[Unit]
Description=Medicine Assistant
After=network.target

[Service]
Type=simple
User=pi
WorkingDirectory=/home/pi/medicine-assistant
ExecStart=/usr/bin/python3 medicine_assistant.py
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable service:
```bash
sudo systemctl enable medicine-assistant.service
sudo systemctl start medicine-assistant.service
```

## API Integration (Optional)

The system uses Google Text-to-Speech API key: `AIzaSyBMKrxsgXkcLxVvb_KEHqDYCbWkt0zqCA0`

To use your own API key:
1. Get Google Cloud TTS API key
2. Set environment variable: `export GOOGLE_API_KEY=your_key_here`
3. Modify `gtts` initialization in code if needed

## Support

For issues or questions:
1. Check the troubleshooting section
2. Run test suite to identify problems
3. Review system logs for error messages
4. Ensure all dependencies are properly installed