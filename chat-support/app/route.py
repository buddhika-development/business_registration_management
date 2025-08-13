from flask import Blueprint, request, jsonify
from app.services.chat_service import generate_response

chat_bp = Blueprint('chat_support_router', __name__)

@chat_bp.route("/", methods = ["GET"])
def health_check():
    return jsonify({
        'status' : 'Health'
    }), 200

@chat_bp.route("/chat", methods = ["POST"])
def chat_response():
    user_query = request.form.get("query")
    print(user_query)

    response = generate_response(user_query)

    return response