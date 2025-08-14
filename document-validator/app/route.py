from flask import Blueprint, jsonify, request
from  app.utils.bareKeyValidator import bearKeyValidator

document_validator_bp = Blueprint("document_validator", __name__)

@document_validator_bp.route("/", methods = ["GET", "POST" , "PUT", "PATCH"])
def healthCheck():
    return jsonify({
        "status" : "Healthy route"
    }), 200

@document_validator_bp.route("/document-validator", methods = ["POST"])
def documentValidation():

    bear_key = request.headers.get("bear-key")
    authorized_request = bearKeyValidator(bear_key)

    if not authorized_request:
        return jsonify({
            "error" : "This request can't process."
        }), 400

    return jsonify({
        "status" : "successfully geted"
    }), 200