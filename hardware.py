#!/usr/bin/env python3
"""
Assistive Voice Device for Elderly People
Raspberry Pi Zero 2W optimized version with Porcupine wake word detection
Simplified version with basic functionality
"""

import os
import sys
import time
import json
import wave
import pyaudio
import requests
import threading
import struct
import pvporcupine
import pygame

class AssistiveVoiceDevice:
    def __init__(self):
        # Audio configuration optimized for RPi Zero 2W
        self.SAMPLE_RATE = 16000
        self.CHUNK_SIZE = 320  # 20ms at 16kHz (320 samples)
        self.CHANNELS = 1
        self.FORMAT = pyaudio.paInt16
        
        # Paths
        self.SOUNDS_DIR = "sound"
        self.KEYWORD_PATHS = ["wake_words/Oe-Babu_en_raspberry-pi_v3_0_0.ppn"]
        self.TEMP_AUDIO = "temp_recording.wav"
        
        # Backend configuration
        self.BACKEND_URL = "http://172.19.218.78:5000/audio"
        
        # Initialize components
        self.audio = None
        self.porcupine = None
        self.is_running = False
        self.in_conversation = False
        
        # Threading
        self.playback_thread = None
        self.stop_playback = threading.Event()
        
        # Audio channels separation
        self.music_channel = None
        
        self._initialize_components()
    
    def test_audio_system(self):
        """Placeholder for test audio system functionality"""
        # Tests removed to simplify the code
        pass

    def _initialize_components(self):
        """Initialize all audio and detection components"""
        try:
            # Fix ALSA audio issues on Raspberry Pi
            os.environ['ALSA_PCM_CARD'] = '0'
            os.environ['ALSA_PCM_DEVICE'] = '0'
            
            # Initialize pygame for audio playback with better settings for RPi
            try:
                pygame.mixer.pre_init(
                    frequency=22050,  # Standard rate that works well with RPi
                    size=-16,         # 16-bit signed
                    channels=1,       # Mono
                    buffer=512        # Smaller buffer for RPi
                )
                pygame.mixer.init()
                pygame.mixer.set_num_channels(2)  # Separate channels for different sounds
                print("✓ Pygame audio initialized")
            except Exception as pygame_error:
                print(f"⚠️  Pygame audio warning: {pygame_error}")
                # Continue anyway, we'll use aplay for playback
            
            # Initialize PyAudio with error suppression
            import contextlib
            import sys
            
            # Suppress ALSA error messages during initialization
            with contextlib.redirect_stderr(open(os.devnull, 'w')):
                self.audio = pyaudio.PyAudio()
            
            print("✓ PyAudio initialized")
            
            # Initialize Porcupine with access key
            access_key = "aTRQds8oKftWuELFLg0zYA1gat1XVahB5lfPu/K8lVOGuvrmVWGlLg=="
            
            self.porcupine = pvporcupine.create(
                access_key=access_key,
                keyword_paths=self.KEYWORD_PATHS
            )
            print("✓ Porcupine wake word detection initialized")
            print(f"✓ Audio config: {self.SAMPLE_RATE}Hz, {self.CHUNK_SIZE} samples ({self.CHUNK_SIZE/self.SAMPLE_RATE*1000:.1f}ms frames)")
            
            print("✓ All components initialized successfully")
            
        except Exception as e:
            print(f"✗ Initialization error: {e}")
            sys.exit(1)
    
    def play_sound(self, sound_file, loop=False, blocking=True):
        """Play sound file with optional looping"""
        try:
            sound_path = os.path.join(self.SOUNDS_DIR, sound_file)
            if not os.path.exists(sound_path):
                print(f"✗ Sound file not found: {sound_path}")
                return
            
            if loop:
                # Stop any existing looped playback first (only looped sounds)
                if self.playback_thread and self.playback_thread.is_alive():
                    self.stop_playback.set()
                    self.playback_thread.join(timeout=1.0)
                    self.playback_thread = None
                
                # For looped playback (waiting.wav)
                self.stop_playback.clear()
                self.playback_thread = threading.Thread(
                    target=self._play_looped_sound, 
                    args=(sound_path,),
                    daemon=True
                )
                self.playback_thread.start()
            else:
                # For single playback - use music channel
                pygame.mixer.music.load(sound_path)
                pygame.mixer.music.play()
                
                if blocking:
                    while pygame.mixer.music.get_busy():
                        time.sleep(0.1)
                        
        except Exception as e:
            print(f"✗ Error playing sound {sound_file}: {e}")
    
    def _play_looped_sound(self, sound_path):
        """Play sound in loop until stopped using Sound objects"""
        try:
            sound = pygame.mixer.Sound(sound_path)
            channel = pygame.mixer.Channel(1)  # Use channel 1 for looped sounds
            channel.play(sound, loops=-1)  # Loop indefinitely
            
            while not self.stop_playback.is_set() and channel.get_busy():
                time.sleep(0.1)
                
            channel.stop()
            
        except Exception as e:
            print(f"✗ Error in looped playback: {e}")
    
    def stop_sound(self):
        """Stop looped sounds only (not regular music)"""
        self.stop_playback.set()
        # Stop only the looped sound channel
        pygame.mixer.Channel(1).stop()
        if self.playback_thread and self.playback_thread.is_alive():
            self.playback_thread.join(timeout=1.0)
            self.playback_thread = None
    
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
    
    def record_with_simple_timer(self):
        """Simple 8-second timer recording"""
        print("🎤 Recording with 8-second timer...")
        
        try:
            stream = self.audio.open(
                format=self.FORMAT,
                channels=self.CHANNELS,
                rate=self.SAMPLE_RATE,
                input=True,
                frames_per_buffer=self.CHUNK_SIZE
            )
            
            frames = []
            print("🗣️  Speak now... (8-second recording)")
            
            # Record for exactly 8 seconds
            start_time = time.time()
            recording_duration = 8.0  # 8 seconds as requested
            
            while time.time() - start_time < recording_duration:
                data = stream.read(self.CHUNK_SIZE, exception_on_overflow=False)
                frames.append(data)
                
                elapsed = time.time() - start_time
                remaining = recording_duration - elapsed
                
                # Show countdown every second
                if int(elapsed) != int(elapsed - 0.02):  # Approximate second boundary
                    print(f"⏱️  Recording... {remaining:.1f}s remaining", end='\r')
            
            print(f"\n⏰ 8-second recording complete!")
            
            stream.stop_stream()
            stream.close()
            
            if len(frames) > 0:
                self._save_audio(frames)
                print(f"💾 Audio saved: {len(frames)} frames ({len(frames) * self.CHUNK_SIZE / self.SAMPLE_RATE:.1f}s)")
                return True
            else:
                print("⚠️  No audio recorded")
                return False
                
        except Exception as e:
            print(f"✗ Timer recording error: {e}")
            return False

    # The record_with_timer method has been replaced by record_with_simple_timer

    def record_with_vad(self):
        """Main recording method - simple 8-second timer"""
        return self.record_with_simple_timer()
    
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
        """Send recorded audio to backend and get response with detailed error handling"""
        print("📤 Sending audio to backend...")
        
        try:
            if not os.path.exists(self.TEMP_AUDIO):
                print("✗ No audio file to send")
                return None
            
            # Check file size
            file_size = os.path.getsize(self.TEMP_AUDIO)
            print(f"   Audio file size: {file_size} bytes")
            
            # Try sending with retry logic for better reliability
            max_retries = 2
            timeout_seconds = 45  # Increased timeout for large files
            
            for attempt in range(max_retries + 1):
                try:
                    with open(self.TEMP_AUDIO, 'rb') as audio_file:
                        files = {'audio': audio_file}
                        
                        if attempt > 0:
                            print(f"   Retry attempt {attempt}/{max_retries}")
                        
                        print(f"   Sending to: {self.BACKEND_URL}")
                        response = requests.post(
                            self.BACKEND_URL, 
                            files=files, 
                            timeout=timeout_seconds
                        )
                    
                    print(f"   Response status: {response.status_code}")
                    
                    if response.status_code == 200:
                        try:
                            result = response.json()
                            print(f"✓ Backend response received")
                            
                            # Show what we got back
                            if "full_play_url" in result:
                                print(f"   Audio URL: {result['full_play_url'][:50]}...")
                            else:
                                print(f"   Response keys: {list(result.keys())}")
                            
                            return result
                        except json.JSONDecodeError as json_error:
                            print(f"✗ Invalid JSON response: {json_error}")
                            print(f"   Raw response: {response.text[:200]}...")
                            return None
                            
                    elif response.status_code == 500:
                        print(f"✗ Backend server error (500)")
                        try:
                            error_detail = response.text
                            if error_detail:
                                print(f"   Server error: {error_detail[:200]}...")
                            else:
                                print("   No error details provided by server")
                        except:
                            print("   Could not read error details")
                        return None
                        
                    elif response.status_code == 404:
                        print(f"✗ Backend endpoint not found (404)")
                        print(f"   Check if {self.BACKEND_URL} is correct")
                        return None
                        
                    elif response.status_code == 413:
                        print(f"✗ Audio file too large (413)")
                        print(f"   File size: {file_size} bytes")
                        return None
                        
                    else:
                        print(f"✗ Backend error: {response.status_code}")
                        try:
                            print(f"   Response: {response.text[:200]}...")
                        except:
                            print("   Could not read response")
                        return None
                    
                except requests.exceptions.Timeout:
                    if attempt < max_retries:
                        print(f"   ⚠️  Timeout on attempt {attempt + 1}, retrying...")
                        time.sleep(1)  # Brief delay before retry
                        continue
                    else:
                        print(f"✗ Backend timeout ({timeout_seconds}s) after {max_retries + 1} attempts")
                        print(f"   Backend may be slow or unreachable")
                        return None
                        
                except requests.exceptions.ConnectionError as conn_error:
                    if attempt < max_retries:
                        print(f"   ⚠️  Connection error on attempt {attempt + 1}, retrying...")
                        time.sleep(1)
                        continue
                    else:
                        print(f"✗ Cannot connect to backend after {max_retries + 1} attempts")
                        print(f"   URL: {self.BACKEND_URL}")
                        print(f"   Error: {conn_error}")
                        print(f"   Check if backend server is running")
                        return None
                
                # If we get here, the request succeeded, so break the retry loop
                break
                
        except requests.exceptions.RequestException as req_error:
            print(f"✗ Network error: {req_error}")
            return None
            
        except Exception as e:
            print(f"✗ Backend communication error: {e}")
            return None
    
    def play_response_audio(self, audio_url):
        """Download and play response audio"""
        try:
            print(f"🔊 Playing response audio...")
            
            # Download audio file
            response = requests.get(audio_url, timeout=30)
            if response.status_code != 200:
                print(f"✗ Failed to download audio: {response.status_code}")
                return False
            
            # Save temporary response audio
            temp_response = "temp_response.wav"
            
            with open(temp_response, 'wb') as f:
                f.write(response.content)
                
            # Try to get basic audio info for debugging
            try:
                with wave.open(temp_response, 'rb') as wf:
                    channels = wf.getnchannels()
                    sampwidth = wf.getsampwidth()
                    framerate = wf.getframerate()
                    nframes = wf.getnframes()
                    print(f"   Source: {channels}ch, {sampwidth*8}bit, {framerate}Hz, {nframes} frames")
            except wave.Error as wav_error:
                print(f"   WAV format error: {wav_error}")
                print("   File might not be a standard WAV file")
                
                # Check if it might be a different format
                file_size = os.path.getsize(temp_response)
                print(f"   File size: {file_size} bytes")
            
            # Play audio with pygame (no conversion)
            print("   Using pygame for audio playback...")
            playback_success = False
            
            try:
                pygame.mixer.music.load(temp_response)
                pygame.mixer.music.play()
                
                while pygame.mixer.music.get_busy():
                    time.sleep(0.1)
                
                playback_success = True
                print("✓ Played using pygame")
                
            except Exception as pygame_error:
                print(f"   ⚠️  Pygame failed: {pygame_error}")
            
            # Clean up temporary file
            time.sleep(0.2)
            try:
                if os.path.exists(temp_response):
                    os.remove(temp_response)
            except:
                pass
            
            if playback_success:
                print("✓ Response audio played successfully")
                return True
            else:
                print("✗ Playback failed - audio format may be unsupported")
                return False
            
        except Exception as e:
            print(f"✗ Error playing response audio: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    # Removed wait_for_continued_conversation method as we no longer need it
    
    def cleanup_temp_files(self):
        """Clean up temporary audio files"""
        try:
            if os.path.exists(self.TEMP_AUDIO):
                os.remove(self.TEMP_AUDIO)
        except Exception as e:
            print(f"✗ Error cleaning up: {e}")
    
    def run_conversation_cycle(self):
        """Run a complete conversation cycle"""
        try:
            # Step 1: Play start sound
            self.play_sound("start.wav", blocking=True)
            
            # Step 2: Record user voice
            if not self.record_with_vad():
                self.play_sound("error.wav")
                return False
            
            # Step 3: Play waiting sound while processing
            self.play_sound("waiting.wav", loop=True, blocking=False)
            
            # Step 4: Send to backend
            response = self.send_to_backend()
            
            # Keep waiting sound playing until conversion is complete
            # We'll stop it just before playing the response
            
            if response and "full_play_url" in response:
                # Validate URL before playing
                audio_url = response["full_play_url"]
                if isinstance(audio_url, str) and audio_url.strip():
                    # Step 6: Play response audio
                    # Stop waiting sound just before playback
                    self.stop_sound()
                    if not self.play_response_audio(audio_url):
                        self.play_sound("error.wav")
                        return False
                else:
                    self.stop_sound()
                    print("✗ Invalid audio URL received")
                    self.play_sound("error.wav")
                    return False
            else:
                # Play error sound if no valid response
                self.stop_sound()
                self.play_sound("error.wav")
                return False
            
            # End conversation
            self.play_sound("ending.wav", blocking=True)
            return True
                
        except Exception as e:
            print(f"✗ Error in conversation cycle: {e}")
            self.stop_sound()
            self.play_sound("error.wav")
            return False
        finally:
            self.cleanup_temp_files()
    
    def run(self):
        """Main application loop"""
        print("🚀 Starting Assistive Voice Device...")
        print("📋 System optimized for Raspberry Pi Zero 2W - Simplified Version")
        
        self.is_running = True
        
        try:
            while self.is_running:
                # Wait for wake word
                if self.detect_wake_word():
                    self.in_conversation = True
                    
                    # Run conversation cycle
                    self.run_conversation_cycle()
                    self.in_conversation = False
                
                time.sleep(0.1)  # Small delay to prevent excessive CPU usage
                
        except KeyboardInterrupt:
            print("\n🛑 Shutting down...")
        except Exception as e:
            print(f"✗ Unexpected error: {e}")
        finally:
            self.shutdown()
    
    def shutdown(self):
        """Clean shutdown of all components"""
        print("🔄 Shutting down components...")
        
        self.is_running = False
        
        # Stop all audio
        self.stop_sound()
        pygame.mixer.music.stop()
        pygame.mixer.stop()  # Stop all channels
        
        # Wait for threads to finish
        if self.playback_thread and self.playback_thread.is_alive():
            self.playback_thread.join(timeout=2.0)
        
        # Clean up components
        if self.porcupine:
            self.porcupine.delete()
        
        if self.audio:
            self.audio.terminate()
        
        pygame.mixer.quit()
        self.cleanup_temp_files()
        
        print("✓ Shutdown complete")


def main():
    """Main entry point"""
    print("=" * 50)
    print("🤖 Assistive Voice Device for Elderly People")
    print("🔧 Raspberry Pi Zero 2W Edition - Simplified Version")
    print("=" * 50)
    
    # Show recording mode
    print("📝 Using 8-second timer recording mode")
    print("=" * 50)
    
    # Check required directories
    required_dirs = ["sound", "wake_words"]
    for directory in required_dirs:
        if not os.path.exists(directory):
            print(f"✗ Required directory missing: {directory}")
            print(f"Please create the directory and add required files")
            sys.exit(1)
    
    # Check required sound files
    required_sounds = ["start.wav", "waiting.wav", "ending.wav", "error.wav"]
    for sound in required_sounds:
        sound_path = os.path.join("sound", sound)
        if not os.path.exists(sound_path):
            print(f"⚠️  Warning: Sound file missing: {sound_path}")
    
    # Check wake word file
    wake_word_path = "wake_words/Oe-Babu_en_raspberry-pi_v3_0_0.ppn"
    if not os.path.exists(wake_word_path):
        print(f"✗ Wake word file missing: {wake_word_path}")
        print("Please place the Oe-Babu_en_raspberry-pi_v3_0_0.ppn wake word file in the wake_words directory")
        sys.exit(1)
    
    try:
        device = AssistiveVoiceDevice()
        device.run()
    except Exception as e:
        print(f"✗ Failed to start device: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
