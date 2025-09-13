# Setting up a virtual environment (recommended)

1. Create a new virtual environment:
   
   On Windows:
   ```
   python -m venv venv
   venv\Scripts\activate
   ```
   
   On Linux/Raspberry Pi:
   ```
   python3 -m venv venv
   source venv/bin/activate
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Copy `.env.example` to `.env` and fill in your secrets:
   ```
   cp .env.example .env  # On Windows, use: copy .env.example .env
   ```

4. Run the backend:
   ```
   python backend/app.py
   ```
