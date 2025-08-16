# Python Backend — Flask + Google API + AWS (Setup Guide)

> This guide shows how to run a Python/Flask project that uses **Google APIs** and **AWS SDK (boto3)** with environment variables.  
> **Important:** The examples use **placeholders**. Rotate any real keys you’ve pasted or shared.

---

## ⚠️ Immediate Security Note

If you previously exposed real keys (e.g., `GOOGLE_API_KEY`, `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`), **treat them as compromised** and rotate them now:
- **Google API Key**: Google Cloud Console → Credentials → API Keys → **Regenerate / restrict** (restrict by API, HTTP referrers, IPs).
- **AWS Access Keys**: IAM → Users → Security credentials → **Create new key** → Update your environment → **Delete old key**.

Do **not** commit secrets to Git. Use `.env` locally and secret managers in production.

---

## 🧰 Prerequisites

- Python **3.9+**
- `pip` and `venv`
- A Google Cloud project (with the API you need enabled)
- An AWS IAM user/role with least-privilege permissions for the services you need

---

## 🚀 Quick Start

```bash
# 1) Create project folder
mkdir flask-aws-google && cd flask-aws-google

# 2) Create & activate virtual environment
python3 -m venv venv
# macOS/Linux
source venv/bin/activate
# Windows (PowerShell)
# .\venv\Scripts\activate

# 3) Create project files
mkdir src
touch src/app.py .env requirements.txt

# 4) Install dependencies
pip install -r requirements.txt

# 5) Run the app
python src/app.py
```

---

## 📦 requirements.txt (example)

```txt
Flask
python-dotenv
google-api-python-client
boto3
```

Install via:
```bash
pip install -r requirements.txt
```

---

## 🔐 Environment Variables

Create a file **`.env`** in the project root with **placeholders**:

```dotenv
# Google
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY

# Flask
FLASK_ENV=development
FLASK_DEBUG=1
FLASK_RUN_PORT=5000

# AWS (use IAM roles on servers when possible)
AWS_ACCESS_KEY_ID=YOUR_AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY=YOUR_AWS_SECRET_ACCESS_KEY
AWS_DEFAULT_REGION=ap-south-1
```


Run:
```bash
python src/app.py
# Visit http://localhost:4000/health
```
<img width="678" height="214" alt="image" src="https://github.com/user-attachments/assets/5a42ef57-b03f-47df-9ed4-8d6985e2a903" />
user barea key : 8932d6621045d6c18c8688feeb9a594e59bb464a1cb2e9645faa189ce24f4f00455c91bf6cb5f9eb2ca868e8d1a35c5b8081974f3257251e950b73c0c7cfccfd

