import json

from flask import Blueprint, request, jsonify
from app.services.chat_service import generate_response

chat_bp = Blueprint('chat_support_router', __name__)

@chat_bp.route("/", methods = ["GET"])
def health_check():
    return jsonify({
        'status' : 'Health'
    }), 200

@chat_bp.route("/chat", methods=["POST"])
def chat_response():
    if request.form:
        user_query = request.form.get("query", "", type=str)
        history_raw = request.form.get("history", "[]")
    else:
        data = request.get_json(silent=True) or {}
        user_query = data.get("query", "")
        history_raw = data.get("history", "[]")

    try:
        user_history = json.loads(history_raw) if isinstance(history_raw, str) else (history_raw or [])
    except json.JSONDecodeError:
        user_history = []

    response_text = generate_response(user_query, user_history)
    return jsonify({"reply": response_text})