from flask import Blueprint, jsonify

document_validator_bp = Blueprint("document_validator", __name__)

@document_validator_bp.route("/", methods = ["GET", "POST" , "PUT", "PATCH"])
def healthCheck():
    return jsonify({
        "status" : "Healthy route"
    }), 200

@document_validator_bp.route("/document-validator", methods = ["POST"])
def documentValidation():
    return jsonify({
        "status" : "successfully geted"
    }), 200