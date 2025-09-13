#!/usr/bin/env python3
"""
Color Detection using Gemini API for medication pouches
"""

import cv2
import base64
import time
import requests
import json
import os
from typing import Optional
from io import BytesIO
from PIL import Image

class ColorDetector:
    def __init__(self, camera_index=0):
        self.camera_index = camera_index
        self.cap = None
        self.gemini_api_key = self._load_api_key()
        
        if self.gemini_api_key:
            self.gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={self.gemini_api_key}"
        else:
            self.gemini_url = None
        
        self.color_names = {"red", "green", "blue", "yellow", "white", "black"}
        self._setup_camera()
    
    def _load_api_key(self):
        """Load Gemini API key"""
        # Try environment variable
        api_key = os.getenv('GEMINI_API_KEY')
        if api_key:
            return api_key
        
        # Try config file
        try:
            with open('gemini_config.json', 'r') as f:
                return json.load(f).get('api_key')
        except FileNotFoundError:
            print("⚠️  Gemini API key not found")
            return None
    
    def _setup_camera(self):
        """Setup camera"""
        try:
            self.cap = cv2.VideoCapture(self.camera_index)
            if not self.cap.isOpened():
                raise Exception("Cannot open camera")
            
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
            self.cap.set(cv2.CAP_PROP_FPS, 15)
            
            # Warm up camera
            for _ in range(3):
                ret, frame = self.cap.read()
                if ret:
                    break
                time.sleep(0.1)
            
            print("✓ Camera ready")
            
            if self.gemini_api_key:
                print("✓ Gemini API ready")
            else:
                print("⚠️  Gemini API key missing")
            
        except Exception as e:
            print(f"✗ Camera setup failed: {e}")
            self.cap = None
    
    def _capture_image_base64(self):
        """Capture and encode image"""
        if not self.cap:
            return None
        
        ret, frame = self.cap.read()
        if not ret:
            return None
        
        # Convert to RGB and encode
        frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        pil_image = Image.fromarray(frame_rgb)
        
        buffer = BytesIO()
        pil_image.save(buffer, format='JPEG', quality=85)
        return base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    def detect_color(self):
        """Detect dominant color using Gemini API"""
        if not self.cap or not self.gemini_api_key:
            print("✗ Camera or API not available")
            return None
        
        print("📷 Detecting color...")
        
        image_base64 = self._capture_image_base64()
        if not image_base64:
            return None
        
        prompt = """Identify the most dominant color in this image. 
        
Respond with ONLY ONE word in lowercase:
red, green, blue, yellow, white, black, or none

Focus on medication pouches or containers if visible."""

        payload = {
            "contents": [{
                "parts": [
                    {"text": prompt},
                    {"inline_data": {"mime_type": "image/jpeg", "data": image_base64}}
                ]
            }]
        }
        
        try:
            response = requests.post(
                self.gemini_url,
                headers={'Content-Type': 'application/json'},
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                try:
                    text = result['candidates'][0]['content']['parts'][0]['text'].strip().lower()
                    if text in self.color_names:
                        print(f"✓ Detected: {text}")
                        return text
                    elif text == "none":
                        print("✗ No clear color")
                        return None
                    else:
                        print(f"⚠️  Unexpected response: {text}")
                        return None
                except (KeyError, IndexError):
                    print("✗ Invalid response format")
                    return None
            else:
                print(f"✗ API error: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"✗ Detection error: {e}")
            return None
    
    def validate_pouch_color(self, expected_color: str) -> bool:
        """Validate medication pouch color"""
        print(f"🔍 Expecting {expected_color} pouch")
        
        time.sleep(2)  # Give user time to position pouch
        
        # Try 3 times for better accuracy
        votes = {}
        for i in range(3):
            print(f"   Attempt {i+1}/3")
            color = self.detect_color()
            if color:
                votes[color] = votes.get(color, 0) + 1
            time.sleep(1)
        
        if not votes:
            print("❌ No color detected")
            return False
        
        detected = max(votes, key=votes.get)
        confidence = votes[detected] / 3 * 100
        
        print(f"✓ Result: {detected} ({confidence:.0f}% confidence)")
        
        if detected == expected_color and confidence >= 50:
            print("✅ Correct pouch!")
            return True
        else:
            print("❌ Wrong or unclear pouch")
            return False
    
    def capture_verification_image(self, filename="verification.jpg"):
        """Save verification photo"""
        if not self.cap:
            return False
        
        try:
            ret, frame = self.cap.read()
            if ret:
                cv2.imwrite(filename, frame)
                print(f"📸 Saved: {filename}")
                return True
        except Exception as e:
            print(f"✗ Photo error: {e}")
        return False
    
    def cleanup(self):
        """Clean up resources"""
        try:
            if self.cap:
                self.cap.release()
                print("✓ Camera cleaned up")
        except Exception as e:
            print(f"⚠️  Cleanup error: {e}")
        finally:
            self.cap = None
