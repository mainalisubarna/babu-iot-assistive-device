#!/usr/bin/env python3
"""
Assistive Voice Device for Elderly People with Medication Reminders
"""

import os
import sys
import time
import json
import wave
import pyaudio
import requests
import threading
import pvporcupine
import pygame
from medication_scheduler import MedicationScheduler
from color_detection import ColorDetector

class AssistiveVoiceDevice:
    def __init__(self):
        # Audio settings
        self.SAMPLE_RATE = 16000
        self.CHUNK_SIZE = 320
        self.CHANNELS = 1
        self.FORMAT = pyaudio.paInt16
        
        # File paths
        self.SOUNDS_DIR = "sound"
        self.KEYWORD_PATHS = ["wake_words/Oe-Babu_en_raspberry-pi_v3_0_0.ppn"]
        self.TEMP_AUDIO = "temp_recording.wav"
        self.BACKEND_URL = "http://172.19.218.78:5000/audio"
        
        # Core components
        self.audio = None
        self.porcupine = None
        self.is_running = False
        self.in_conversation = False
        
        # Audio playback
        self.playback_thread = None
        self.stop_playback = threading.Event()
        
        # Medication system
        self.medication_scheduler = None
        self.color_detector = None
        self.medication_mode = False
        self.pending_medication = None
        
        self._setup_components()
    
    def _setup_components(self):
        """Setup all system components"""
        try:
            self._setup_audio()
            self._setup_wake_word()
            self._setup_medication_system()
            print("✓ All components initialized")
        except Exception as e:
            print(f"✗ Setup error: {e}")
            sys.exit(1)
    
    def _setup_audio(self):
        """Initialize audio systems"""
        # Setup pygame for sound playback
        pygame.mixer.pre_init(frequency=22050, size=-16, channels=1, buffer=512)
        pygame.mixer.init()
        pygame.mixer.set_num_channels(2)
        
        # Setup PyAudio for recording
        import contextlib
        with contextlib.redirect_stderr(open(os.devnull, 'w')):
            self.audio = pyaudio.PyAudio()
        
        print("✓ Audio systems ready")
    
    def _setup_wake_word(self):
        """Initialize wake word detection"""
        access_key = "aTRQds8oKftWuELFLg0zYA1gat1XVahB5lfPu/K8lVOGuvrmVWGlLg=="
        self.porcupine = pvporcupine.create(
            access_key=access_key,
            keyword_paths=self.KEYWORD_PATHS
        )
        print("✓ Wake word detection ready")
    
    def _setup_medication_system(self):
        """Initialize medication reminder system"""
        try:
            self.medication_scheduler = MedicationScheduler()
            self.color_detector = ColorDetector()
            self.medication_scheduler.start_scheduler()
            print("✓ Medication system ready")
        except Exception as e:
            print(f"⚠️  Medication system failed: {e}")
            print("   Continuing with basic functionality")
    
    def play_sound(self, sound_file, loop=False, blocking=True):
        """Play sound file"""
        try:
            sound_path = os.path.join(self.SOUNDS_DIR, sound_file)
            if not os.path.exists(sound_path):
                print(f"✗ Sound not found: {sound_file}")
                return
            
            if loop:
                self._start_looped_sound(sound_path)
            else:
                pygame.mixer.music.load(sound_path)
                pygame.mixer.music.play()
                if blocking:
                    while pygame.mixer.music.get_busy():
                        time.sleep(0.1)
        except Exception as e:
            print(f"✗ Sound error: {e}")
    
    def _start_looped_sound(self, sound_path):
        """Start looped sound in background"""
        self.stop_sound()
        self.stop_playback.clear()
        self.playback_thread = threading.Thread(
            target=self._play_loop, args=(sound_path,), daemon=True
        )
        self.playback_thread.start()
    
    def _play_loop(self, sound_path):
        """Play sound in loop"""
        try:
            sound = pygame.mixer.Sound(sound_path)
            channel = pygame.mixer.Channel(1)
            channel.play(sound, loops=-1)
            
            while not self.stop_playback.is_set() and channel.get_busy():
                time.sleep(0.1)
            channel.stop()
        except Exception as e:
            print(f"✗ Loop error: {e}")
    
    def stop_sound(self):
        """Stop looped sounds"""
        self.stop_playback.set()
        pygame.mixer.Channel(1).stop()
        if self.playback_thread and self.playback_thread.is_alive():
            self.playback_thread.join(timeout=1.0)
    
    def detect_wake_word(self):
        """Listen for wake word using Porcupine"""
        print("🎧 Listening for wake word...")
        
        try:
            stream = self.audio.open(
                format=self.FORMAT,
                channels=self.CHANNELS,
                rate=self.SAMPLE_RATE,
                input=True,
                frames_per_buffer=self.porcupine.frame_length
            )
            
            while self.is_running and not self.in_conversation:
                pcm = stream.read(self.porcupine.frame_length, exception_on_overflow=False)
                pcm = [int.from_bytes(pcm[i:i+2], byteorder='little', signed=True) 
                       for i in range(0, len(pcm), 2)]
                
                keyword_index = self.porcupine.process(pcm)
                if keyword_index >= 0:
                    print("🎯 Wake word detected!")
                    stream.stop_stream()
                    stream.close()
                    return True
                    
            stream.stop_stream()
            stream.close()
            return False
            
        except Exception as e:
            print(f"✗ Wake word detection error: {e}")
            return False
    
    def record_audio(self):
        """Record 8 seconds of audio"""
        print("🎤 Recording for 8 seconds...")
        
        try:
            stream = self.audio.open(
                format=self.FORMAT, channels=self.CHANNELS,
                rate=self.SAMPLE_RATE, input=True,
                frames_per_buffer=self.CHUNK_SIZE
            )
            
            frames = []
            start_time = time.time()
            
            while time.time() - start_time < 8.0:
                data = stream.read(self.CHUNK_SIZE, exception_on_overflow=False)
                frames.append(data)
                
                remaining = 8.0 - (time.time() - start_time)
                print(f"⏱️  {remaining:.1f}s remaining", end='\r')
            
            print("\n✓ Recording complete")
            stream.stop_stream()
            stream.close()
            
            if frames:
                self._save_audio(frames)
                return True
            return False
                
        except Exception as e:
            print(f"✗ Recording error: {e}")
            return False
    
    def _save_audio(self, frames):
        """Save recorded frames to WAV file"""
        try:
            with wave.open(self.TEMP_AUDIO, 'wb') as wf:
                wf.setnchannels(self.CHANNELS)
                wf.setsampwidth(self.audio.get_sample_size(self.FORMAT))
                wf.setframerate(self.SAMPLE_RATE)
                wf.writeframes(b''.join(frames))
        except Exception as e:
            print(f"✗ Error saving audio: {e}")
    
    def send_to_backend(self):
        """Send audio to backend and get response"""
        print("📤 Sending to backend...")
        
        if not os.path.exists(self.TEMP_AUDIO):
            print("✗ No audio file")
            return None
        
        try:
            with open(self.TEMP_AUDIO, 'rb') as f:
                response = requests.post(
                    self.BACKEND_URL, 
                    files={'audio': f}, 
                    timeout=30
                )
            
            if response.status_code == 200:
                result = response.json()
                print("✓ Backend response received")
                return result
            else:
                print(f"✗ Backend error: {response.status_code}")
                return None
                
        except Exception as e:
            print(f"✗ Backend error: {e}")
            return None
    
    def play_response_audio(self, audio_url):
        """Download and play response audio"""
        try:
            print("🔊 Playing response...")
            
            response = requests.get(audio_url, timeout=30)
            if response.status_code != 200:
                print(f"✗ Download failed: {response.status_code}")
                return False
            
            temp_file = "temp_response.wav"
            with open(temp_file, 'wb') as f:
                f.write(response.content)
            
            pygame.mixer.music.load(temp_file)
            pygame.mixer.music.play()
            
            while pygame.mixer.music.get_busy():
                time.sleep(0.1)
            
            # Cleanup
            try:
                os.remove(temp_file)
            except:
                pass
            
            print("✓ Response played")
            return True
            
        except Exception as e:
            print(f"✗ Playback error: {e}")
            return False
    
    # Removed wait_for_continued_conversation method as we no longer need it
    
    def cleanup_temp_files(self):
        """Clean up temporary audio files"""
        try:
            if os.path.exists(self.TEMP_AUDIO):
                os.remove(self.TEMP_AUDIO)
        except Exception as e:
            print(f"✗ Error cleaning up: {e}")
    
    def check_medication_reminder(self):
        """Check for medication reminders"""
        if not self.medication_scheduler:
            return False
            
        reminder = self.medication_scheduler.get_active_reminder()
        if reminder:
            self.pending_medication = reminder
            self.medication_mode = True
            
            message = self.medication_scheduler.generate_reminder_message(reminder)
            print(f"💊 {message}")
            self.play_sound("medication_reminder.wav", blocking=True)
            return True
        return False
    
    def validate_medication_pouch(self):
        """Validate medication pouch color"""
        if not self.pending_medication or not self.color_detector:
            return False
        
        expected_color = self.pending_medication["color"]
        print(f"🔍 Show {expected_color} pouch to camera...")
        
        time.sleep(2)  # Give user time to position pouch
        
        is_valid = self.color_detector.validate_pouch_color(expected_color)
        
        if is_valid:
            # Save verification photo
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            self.color_detector.capture_verification_image(f"med_{timestamp}.jpg")
            
            # Mark as taken
            self.medication_scheduler.acknowledge_reminder(self.pending_medication["id"])
            print("✅ Correct pouch validated!")
            return True
        else:
            print("❌ Wrong or no pouch detected")
            return False
    
    def run_medication_cycle(self):
        """Handle medication reminder cycle"""
        try:
            if not self.pending_medication:
                return False
            
            print(f"💊 {self.pending_medication['name']}")
            
            # Validate pouch color
            if not self.validate_medication_pouch():
                self.play_sound("error.wav")
                return False
            
            # Record any questions
            self.play_sound("start.wav", blocking=True)
            if not self.record_audio():
                self.play_sound("error.wav")
                return False
            
            # Process with backend
            self.play_sound("waiting.wav", loop=True, blocking=False)
            response = self.send_to_backend()
            self.stop_sound()
            
            if response and "full_play_url" in response:
                if not self.play_response_audio(response["full_play_url"]):
                    self.play_sound("error.wav")
                    return False
            else:
                self.play_sound("ending.wav", blocking=True)
            
            print("✅ Medication cycle complete")
            return True
                
        except Exception as e:
            print(f"✗ Medication error: {e}")
            self.stop_sound()
            self.play_sound("error.wav")
            return False
        finally:
            self.medication_mode = False
            self.pending_medication = None
            self.cleanup_temp_files()
    
    def run_conversation_cycle(self):
        """Handle normal conversation cycle"""
        try:
            self.play_sound("start.wav", blocking=True)
            
            if not self.record_audio():
                self.play_sound("error.wav")
                return False
            
            self.play_sound("waiting.wav", loop=True, blocking=False)
            response = self.send_to_backend()
            self.stop_sound()
            
            if response and "full_play_url" in response:
                if not self.play_response_audio(response["full_play_url"]):
                    self.play_sound("error.wav")
                    return False
            else:
                self.play_sound("error.wav")
                return False
            
            self.play_sound("ending.wav", blocking=True)
            return True
                
        except Exception as e:
            print(f"✗ Conversation error: {e}")
            self.stop_sound()
            self.play_sound("error.wav")
            return False
        finally:
            self.cleanup_temp_files()
    
    def run(self):
        """Main application loop"""
        print("🚀 Starting Assistive Voice Device")
        print("💊 Medication reminders enabled")
        
        self.is_running = True
        
        try:
            while self.is_running:
                # Check for medication reminders
                if not self.in_conversation and self.check_medication_reminder():
                    print("💊 Medication reminder!")
                    if self.detect_wake_word():
                        self.in_conversation = True
                        self.run_medication_cycle()
                        self.in_conversation = False
                    continue
                
                # Normal conversation
                if self.detect_wake_word():
                    self.in_conversation = True
                    
                    if self.medication_mode:
                        self.run_medication_cycle()
                    else:
                        self.run_conversation_cycle()
                    
                    self.in_conversation = False
                
                time.sleep(0.1)
                
        except KeyboardInterrupt:
            print("\n🛑 Shutting down...")
        except Exception as e:
            print(f"✗ Error: {e}")
        finally:
            self.shutdown()
    
    def shutdown(self):
        """Clean shutdown"""
        print("🔄 Shutting down...")
        
        self.is_running = False
        self.stop_sound()
        pygame.mixer.quit()
        
        if self.playback_thread and self.playback_thread.is_alive():
            self.playback_thread.join(timeout=2.0)
        
        if self.medication_scheduler:
            self.medication_scheduler.stop_scheduler()
        
        if self.color_detector:
            self.color_detector.cleanup()
        
        if self.porcupine:
            self.porcupine.delete()
        
        if self.audio:
            self.audio.terminate()
        
        self.cleanup_temp_files()
        print("✓ Shutdown complete")


def main():
    """Main entry point"""
    print("🤖 Assistive Voice Device for Elderly People")
    print("=" * 50)
    
    # Check directories
    for directory in ["sound", "wake_words"]:
        if not os.path.exists(directory):
            print(f"✗ Missing directory: {directory}")
            sys.exit(1)
    
    # Check wake word file
    wake_word_path = "wake_words/Oe-Babu_en_raspberry-pi_v3_0_0.ppn"
    if not os.path.exists(wake_word_path):
        print(f"✗ Missing wake word file: {wake_word_path}")
        sys.exit(1)
    
    # Check sound files
    sounds = ["start.wav", "waiting.wav", "ending.wav", "error.wav", "medication_reminder.wav"]
    for sound in sounds:
        if not os.path.exists(f"sound/{sound}"):
            print(f"⚠️  Missing sound: {sound}")
    
    try:
        device = AssistiveVoiceDevice()
        device.run()
    except Exception as e:
        print(f"✗ Startup error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
