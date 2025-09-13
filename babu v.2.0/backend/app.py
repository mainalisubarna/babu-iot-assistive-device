# app.py
# Entry point for Flask REST API backend for Raspberry Pi AI Nepali Companion

from flask import Flask, request, jsonify
import random
import json

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({'message': 'Nepali AI Companion Backend Running'})

import os
import tempfile
import uuid
from flask import send_file
import requests
from datetime import datetime

from dotenv import load_dotenv
load_dotenv()

GROQ_API_KEY = os.getenv('GROQ_API_KEY')
OLLAMA_HOST = os.getenv('OLLAMA_HOST', 'http://localhost:11434')

# Create outputs directory for audio files
OUTPUTS_DIR = os.path.join(os.path.dirname(__file__), 'outputs')
os.makedirs(OUTPUTS_DIR, exist_ok=True)

# Contact database
CONTACTS = {
    'subarna': {'name': 'Subarna', 'number': '9744259833'},
    'prashanta': {'name': 'Prashanta', 'number': '9765951631'},
    'kriansh': {'name': 'Kriansh', 'number': '9764359618'}
}

"""Load HEADLINES and NEPALI_DATE_DATA from environment (.env)"""
# Expected env vars: HEADLINES_JSON (list JSON), NEPALI_DATE_DATA_JSON (object JSON)
HEADLINES = []
NEPALI_DATE_DATA = {}

HEADLINES_JSON = os.getenv('HEADLINES_JSON', '[]')
NEPALI_DATE_DATA_JSON = os.getenv('NEPALI_DATE_DATA_JSON', '{}')
try:
    HEADLINES = json.loads(HEADLINES_JSON)
except Exception as e:
    print(f"[DEBUG] Failed to parse HEADLINES_JSON: {e}")
    HEADLINES = []
try:
    NEPALI_DATE_DATA = json.loads(NEPALI_DATE_DATA_JSON)
except Exception as e:
    print(f"[DEBUG] Failed to parse NEPALI_DATE_DATA_JSON: {e}")
    NEPALI_DATE_DATA = {}

# Emergency contact
EMERGENCY_CONTACT = CONTACTS['kriansh']

"""NEPALI_DATE_DATA is loaded from NEPALI_DATE_DATA_JSON env variable"""

# Helper: Transcribe Nepali audio using SpeechRecognition
from speech_recognition import Recognizer, AudioFile
from pydub import AudioSegment
import io

def transcribe_audio(audio_file):
    recognizer = Recognizer()
    # Convert to wav if necessary (SpeechRecognition prefers wav/pcm)
    audio_file.seek(0)
    audio_data = audio_file.read()
    audio_file.seek(0)
    # If not wav, convert using pydub
    if not audio_file.filename.lower().endswith('.wav'):
        audio = AudioSegment.from_file(io.BytesIO(audio_data))
        wav_io = io.BytesIO()
        audio.export(wav_io, format="wav")
        wav_io.seek(0)
        audio_source = AudioFile(wav_io)
    else:
        audio_source = AudioFile(io.BytesIO(audio_data))
    with audio_source as source:
        audio = recognizer.record(source)
    # Nepali language code is 'ne-NP' (Google Speech API)
    try:
        text = recognizer.recognize_google(audio, language='ne-NP')
    except Exception as e:
        raise RuntimeError(f"Speech recognition failed: {e}")
    return text

# Helper: Find closest matching contact using AI
def find_contact_with_ai(text):
    """Use AI to find the closest matching contact name from the database"""
    contact_names = [contact['name'] for contact in CONTACTS.values()]
    contact_prompt = f"""
    Given the following Nepali text requesting a phone call and the available contacts, determine which contact the user wants to call.
    
    Text: "{text}"
    Available contacts: {', '.join(contact_names)}
    
    Respond with ONLY the exact contact name from the list above that best matches the request. If no clear match, respond with "NONE".
    """
    
    url = 'https://api.groq.com/openai/v1/chat/completions'
    headers = {'Authorization': f'Bearer {GROQ_API_KEY}', 'Content-Type': 'application/json'}
    data = {
        'model': 'openai/gpt-oss-20b',
        'messages': [{'role': 'user', 'content': contact_prompt}],
        'max_tokens': 20
    }
    
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        ai_response = response.json()['choices'][0]['message']['content'].strip()
        
        # Find the contact that matches AI response
        for contact in CONTACTS.values():
            if contact['name'].lower() == ai_response.lower():
                return contact
        return None
    except Exception as e:
        print(f"[DEBUG] AI contact matching failed: {e}")
        return None

# Helper: Get today's Nepali date info
def get_nepali_date_info():
    """Get today's Nepali date, tithi and events in specific format"""
    today = datetime.now().strftime("%A, %B %d, %Y")
    
    if today in NEPALI_DATE_DATA:
        data = NEPALI_DATE_DATA[today]
        # Format: date, tithi and events
        response = f"{data['nepali_date']}, {data['tithi']} र {data['events']}"
        return response
    else:
        return "माफ गर्नुहोस्, आजको नेपाली मिति र तिथिको जानकारी उपलब्ध छैन।"

# Helper: Generate fake Nepal news
def generate_nepal_news():
    """Return a random pre-defined Nepali news headline."""
    try:
        return random.choice(HEADLINES)
    except Exception as e:
        print(f"[DEBUG] Selecting headline failed: {e}")
        return HEADLINES[0]

# Helper: Generate a combined news string with up to N headlines
def generate_nepal_news_combined(n=3):
    """Return a single string combining up to n headlines from HEADLINES.
    Falls back gracefully if fewer than n are available.
    """
    try:
        if not HEADLINES:
            return "माफ गर्नुहोस्, अहिले समाचार शीर्षक उपलब्ध छैन।"
        # Pick up to n unique headlines if possible
        if len(HEADLINES) >= n:
            selected = random.sample(HEADLINES, n)
        else:
            selected = HEADLINES[:]
        # Join headlines with clear separators
        combined = " | ".join(selected)
        return combined
    except Exception as e:
        print(f"[DEBUG] Combining headlines failed: {e}")
        return generate_nepal_news()

# Helper: Detect intent from Nepali text
def detect_intent(text):
    intent_prompt = f"""
    Analyze the following Nepali text and classify it into one of these intents:
    - news: asking for news, current events, headlines
    - nepali_date: asking for Nepali date, tithi, calendar information
    - general_chat: casual conversation, greetings, general questions
    - medicine: health-related queries, symptoms, medical advice
    - call: requesting to make a phone call to someone
    - alert: setting reminders, alarms, notifications
    - emergency: emergency situations, urgent help needed
    
    Text: "{text}"
    
    Respond with ONLY the intent category (one word).
    """
    
    url = 'https://api.groq.com/openai/v1/chat/completions'
    headers = {'Authorization': f'Bearer {GROQ_API_KEY}', 'Content-Type': 'application/json'}
    data = {
        'model': 'openai/gpt-oss-20b',
        'messages': [{'role': 'user', 'content': intent_prompt}],
        'max_tokens': 10
    }
    try:
        response = requests.post(url, headers=headers, json=data)
        response.raise_for_status()
        intent = response.json()['choices'][0]['message']['content'].strip().lower()
        # Validate intent
        valid_intents = ['news', 'nepali_date', 'general_chat', 'medicine', 'call', 'alert', 'emergency']
        return intent if intent in valid_intents else 'general_chat'
    except Exception as e:
        print(f"[DEBUG] Intent detection failed: {e}")
        return 'general_chat'

# Helper: Query Groq gpt-oss-20b with personality instructions
def query_groq(prompt):
    # Add personality and response style instructions
    system_prompt = """You are a helpful Nepali AI companion called "Babu". Please respond in a concise, humble, and sweet manner with meaningful mannerism. 
    - Keep responses brief but meaningful
    - Be polite and respectful (use "तपाईं" for formal address)
    - Show genuine care and warmth in your responses
    - Use appropriate Nepali cultural context and expressions
    - Avoid being overly verbose or technical
    - Be encouraging and supportive"""
    
    full_prompt = f"{system_prompt}\n\nUser: {prompt}\n\nAssistant:"
    
    url = 'https://api.groq.com/openai/v1/chat/completions'
    headers = {'Authorization': f'Bearer {GROQ_API_KEY}', 'Content-Type': 'application/json'}
    data = {
        'model': 'openai/gpt-oss-20b',
        'messages': [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': prompt}
        ],
        'max_tokens': 256,  # Reduced for more concise responses
        'temperature': 0.7  # Slightly creative but consistent
    }
    response = requests.post(url, headers=headers, json=data)
    response.raise_for_status()
    return response.json()['choices'][0]['message']['content']

# Helper: Synthesize Nepali male voice using edge-tts Python library
import asyncio
import edge_tts
from datetime import datetime

async def synthesize_edge_tts_async(text, output_wav):
    # Try different Nepali voices - the original might not be available
    voices_to_try = [
        "ne-NP-SagarNeural",  # Nepali male voice
        "ne-NP-HemkalaNeural",  # Nepali female voice
        "hi-IN-MadhurNeural",  # Hindi male as fallback
        "en-US-AriaNeural"  # English as last resort
    ]
    
    print(f"[DEBUG] Text to synthesize: {text[:100]}...")
    print(f"[DEBUG] Output file path: {output_wav}")
    
    for voice in voices_to_try:
        try:
            print(f"[DEBUG] Trying voice: {voice}")
            communicate = edge_tts.Communicate(text, voice)
            
            # Save as temporary MP3 first
            temp_mp3 = output_wav.replace('.wav', '_temp.mp3')
            await communicate.save(temp_mp3)
            
            # Convert MP3 to WAV using pydub
            from pydub import AudioSegment
            audio = AudioSegment.from_mp3(temp_mp3)
            audio.export(output_wav, format="wav")
            
            # Clean up temp file
            os.remove(temp_mp3)
            
            print(f"[DEBUG] Successfully converted to WAV with voice {voice}: {output_wav}")
            return output_wav
        except Exception as e:
            print(f"[DEBUG] Voice {voice} failed: {e}")
            # Clean up temp file if it exists
            temp_mp3 = output_wav.replace('.wav', '_temp.mp3')
            if os.path.exists(temp_mp3):
                os.remove(temp_mp3)
            continue
    
    # If all voices fail, raise error
    raise RuntimeError("All edge-tts voices failed. Check text content and network connection.")

def synthesize_edge_tts(text, output_wav):
    # Wrapper to run async function in sync context
    try:
        loop = asyncio.get_event_loop()
    except RuntimeError:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
    
    return loop.run_until_complete(synthesize_edge_tts_async(text, output_wav))

@app.route('/audio', methods=['POST'])
def audio_to_speech():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file uploaded'}), 400
    audio_file = request.files['audio']
    try:
        # 1. Transcribe Nepali audio
        try:
            nepali_text = transcribe_audio(audio_file)
        except Exception as te:
            print(f"[DEBUG] Transcription failed or no speech detected: {te}")
            nepali_text = ""
        print(f"[DEBUG] Transcribed text: {nepali_text}")

        # 1a. If no speech was transcribed, return a Nepali prompt audio
        if not nepali_text or not nepali_text.strip():
            default_text = "के तपाईंले केही भन्नुभयो? मैले केही सुनिनँ। कृपया फेरि भन्नुहोस्।"
            audio_filename = f"{uuid.uuid4().hex}.wav"
            audio_path = os.path.join(OUTPUTS_DIR, audio_filename)
            synthesize_edge_tts(default_text, audio_path)
            full_play_url = f"http://172.19.218.78:5000/api/play_audio/{audio_filename}"
            return jsonify({
                'intent': 'no_speech',
                'transcribed_text': nepali_text,
                'response_text': default_text,
                'full_play_url': full_play_url,
                'message': 'No speech detected'
            })
        
        # 1b. Keyword-based news detection bypass (no AI call)
        lower_text = nepali_text.strip().lower()
        news_keywords = ['समाचार', 'खबर', 'ताजा', 'samachar', 'khabar', 'taja']
        if any(kw in lower_text for kw in news_keywords):
            news_response = generate_nepal_news_combined(3)
            audio_filename = f"{uuid.uuid4().hex}.wav"
            audio_path = os.path.join(OUTPUTS_DIR, audio_filename)
            synthesize_edge_tts(news_response, audio_path)
            full_play_url = f"http://172.19.218.78:5000/api/play_audio/{audio_filename}"
            return jsonify({
                'intent': 'news',
                'transcribed_text': nepali_text,
                'response_text': news_response,
                'full_play_url': full_play_url,
                'message': 'News provided via keyword detection'
            })

        
        # 2. Detect intent
        detected_intent = detect_intent(nepali_text)
        print(f"[DEBUG] Detected intent: {detected_intent}")
        
        # 3. Handle special intents (call and emergency) without audio
        if detected_intent == 'call':
            contact = find_contact_with_ai(nepali_text)
            if contact:
                return jsonify({
                    'intent': detected_intent,
                    'transcribed_text': nepali_text,
                    'contact_name': contact['name'],
                    'contact_number': contact['number'],
                    'message': f"Contact found: {contact['name']} - {contact['number']}"
                })
            else:
                return jsonify({
                    'intent': detected_intent,
                    'transcribed_text': nepali_text,
                    'message': 'No matching contact found',
                    'available_contacts': [{'name': c['name'], 'number': c['number']} for c in CONTACTS.values()]
                })
        
        elif detected_intent == 'emergency':
            return jsonify({
                'intent': detected_intent,
                'transcribed_text': nepali_text,
                'emergency_contact_name': EMERGENCY_CONTACT['name'],
                'emergency_contact_number': EMERGENCY_CONTACT['number'],
                'message': f"Emergency contact: {EMERGENCY_CONTACT['name']} - {EMERGENCY_CONTACT['number']}"
            })
        
        elif detected_intent == 'nepali_date':
            # Get today's Nepali date info and return with audio
            nepali_date_response = get_nepali_date_info()
            
            # Generate audio for the date info
            audio_filename = f"{uuid.uuid4().hex}.wav"
            audio_path = os.path.join(OUTPUTS_DIR, audio_filename)
            synthesize_edge_tts(nepali_date_response, audio_path)
            
            # Generate full play URL
            full_play_url = f"http://172.19.218.78:5000/api/play_audio/{audio_filename}"
            
            return jsonify({
                'intent': detected_intent,
                'transcribed_text': nepali_text,
                'response_text': nepali_date_response,
                'full_play_url': full_play_url,
                'message': 'Nepali date info provided successfully'
            })
        
        elif detected_intent == 'news':
            # Generate fake Nepal news and return with audio
            news_response = generate_nepal_news_combined(3)
            
            # Generate audio for the news
            audio_filename = f"{uuid.uuid4().hex}.wav"
            audio_path = os.path.join(OUTPUTS_DIR, audio_filename)
            synthesize_edge_tts(news_response, audio_path)
            
            # Generate full play URL
            full_play_url = f"http://172.19.218.78:5000/api/play_audio/{audio_filename}"
            
            return jsonify({
                'intent': detected_intent,
                'transcribed_text': nepali_text,
                'response_text': news_response,
                'full_play_url': full_play_url,
                'message': 'Nepal news provided successfully'
            })
        
        elif detected_intent == 'general_chat':
            # For general chat, use AI response as before
            try:
                response_text = query_groq(nepali_text)
            except Exception as groq_exc:
                # Fallback: Translate Nepali to English, query llava, translate back
                en_text = translate_text(nepali_text, src='ne', tgt='en')
                response_en = query_llava(en_text)
                response_text = translate_text(response_en, src='en', tgt='ne')
            
            # Generate audio for chat response
            audio_filename = f"{uuid.uuid4().hex}.wav"
            audio_path = os.path.join(OUTPUTS_DIR, audio_filename)
            synthesize_edge_tts(response_text, audio_path)
            
            # Generate full play URL
            full_play_url = f"http://172.19.218.78:5000/api/play_audio/{audio_filename}"
            
            return jsonify({
                'intent': detected_intent,
                'transcribed_text': nepali_text,
                'response_text': response_text,
                'full_play_url': full_play_url,
                'message': 'Chat response provided successfully'
            })
        
        # 4. For other intents (medicine, alert), generate AI response with audio
        try:
            response_text = query_groq(nepali_text)
        except Exception as groq_exc:
            # Fallback: Translate Nepali to English, query llava, translate back
            en_text = translate_text(nepali_text, src='ne', tgt='en')
            response_en = query_llava(en_text)
            response_text = translate_text(response_en, src='en', tgt='ne')
        
        # 5. Synthesize Nepali male voice
        audio_filename = f"{uuid.uuid4().hex}.wav"
        audio_path = os.path.join(OUTPUTS_DIR, audio_filename)
        synthesize_edge_tts(response_text, audio_path)
        
        # 6. Generate full play URL
        full_play_url = f"http://172.19.218.78:5000/api/play_audio/{audio_filename}"
        
        # 7. Return JSON response with intent and full play URL
        return jsonify({
            'intent': detected_intent,
            'transcribed_text': nepali_text,
            'response_text': response_text,
            'full_play_url': full_play_url,
            'message': 'Audio processed successfully'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Helper: Translate text using Groq GPT (or any translation API)
def translate_text(text, src='ne', tgt='en'):
    prompt = f"Translate the following text from {src} to {tgt}: {text}"
    return query_groq(prompt)

# Helper: Query llava via Ollama (text only)
def query_llava(prompt):
    url = f"{OLLAMA_HOST}/api/chat"
    data = {
        "model": "llava",
        "messages": [{"role": "user", "content": prompt}],
        "stream": False
    }
    response = requests.post(url, json=data)
    response.raise_for_status()
    return response.json()['message']['content']

# Helper: Query Gemini API with image using official library
import google.generativeai as genai
from PIL import Image
import io

def query_gemini_image(prompt, image_file):
    GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY not set in environment variables.")
    
    # Configure Gemini
    genai.configure(api_key=GEMINI_API_KEY)
    
    image_bytes = image_file.read()
    image_file.seek(0)
    print(f"[DEBUG] Received image: {len(image_bytes)} bytes, filename: {getattr(image_file, 'filename', 'unknown')}")
    
    # Convert to PIL Image
    pil_image = Image.open(io.BytesIO(image_bytes))
    
    # Strict prompt to answer only True or False
    system_prompt = (
        "You are an image question answering assistant. Respond to the user's question ONLY with 'True' or 'False'. Do not explain."
    )
    
    # Use Gemini 1.5 Flash model
    model = genai.GenerativeModel('gemini-1.5-flash')
    
    try:
        response = model.generate_content([f"{system_prompt}\n{prompt}", pil_image])
        print(f"[DEBUG] gemini response: {response.text}")
        
        # Extract only the first word (True/False) from response
        answer = response.text.strip().split()[0]
        if answer.lower().startswith('true'):
            return 'True'
        elif answer.lower().startswith('false'):
            return 'False'
        else:
            return 'False'
    except Exception as e:
        print(f"[DEBUG] Error calling Gemini: {e}")
        return 'False'

@app.route('/image', methods=['POST'])
def process_image():
    if 'prompt' not in request.form or 'image' not in request.files:
        return jsonify({'error': 'Prompt and image required'}), 400
    prompt = request.form['prompt']
    image_file = request.files['image']
    try:
        result = query_gemini_image(prompt, image_file=image_file)
        return jsonify({'result': result})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/play_audio/<filename>', methods=['GET'])
def play_audio(filename):
    """Serve audio files from outputs directory"""
    try:
        audio_path = os.path.join(OUTPUTS_DIR, filename)
        if os.path.exists(audio_path):
            return send_file(
                audio_path, 
                mimetype='audio/wav',
                as_attachment=False,
                download_name=filename,
                conditional=False,
                etag=False,
                last_modified=None,
                max_age=0
            )
        else:
            return jsonify({'error': 'Audio file not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000,debug=True)

