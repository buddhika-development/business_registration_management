# Python Project — Using Google API Key

This project demonstrates how to set up a Python environment with a Google API Key securely.

---

## 🧰 Prerequisites
- Python 3.9+
- pip (comes with Python)
- Virtual environment (`venv`)

---

## 🚀 Setup Instructions

### 1) Clone the repo (or create a new folder)
```bash
mkdir my-python-app && cd my-python-app
```

### 2) Create a Virtual Environment
```bash
# Create
python3 -m venv venv

# Activate (Linux/macOS)
source venv/bin/activate

# Activate (Windows PowerShell)
.\venv\Scripts\activate
```

You should now see `(venv)` in your terminal.

---

### 3) Install Dependencies

Create a `requirements.txt`:
```bash
pip freeze > requirements.txt
```

---

### 4) Environment Variables

Create a `.env` file in the project root:

```dotenv
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_HERE
```

⚠️ Replace with your actual API key.  
⚠️ Never commit `.env` to GitHub (add it to `.gitignore`).


Run it:
```bash
python main.py
```

---

### 6) Deactivate Environment

When finished, deactivate the virtual environment:
```bash
deactivate
```


## 📦 requirements.txt (example)
```txt
google-api-python-client
python-dotenv
```

---

## 🔐 Security Notes
- Keep `.env` out of version control (`.gitignore` it).
- Rotate your API key if it leaks.
- Use **restricted API keys** in Google Cloud Console (restrict by API & domain/IP).

You’re all set 🚀
