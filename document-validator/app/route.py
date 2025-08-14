from flask import Blueprint, jsonify, request
from  app.utils.bareKeyValidator import bearKeyValidator
from app.service.DocumentContentScraper import documentContentScraper

document_validator_bp = Blueprint("document_validator", __name__)

@document_validator_bp.route("/", methods = ["GET", "POST" , "PUT", "PATCH"])
def healthCheck():
    return jsonify({
        "status" : "Healthy route"
    }), 200


@document_validator_bp.route("/document-validator", methods=["POST"])
def documentValidation():
    bear_key = request.headers.get("bear-key")
    authorized_request = bearKeyValidator(bear_key)

    if not authorized_request:
        return jsonify({
            "error": "This request can't process."
        }), 400

    try:
        # Access the data comes in the request body
        # gn_certificate = request.files.get("gnc")
        # phi_certificate = request.files.get("phi")
        # affidavit = request.files.get("affidavit")
        # lease = request.files.get("lease")
        nic = request.files.get("nic")

        if not nic:
            return jsonify({
                "error": "No file provided"
            }), 400

        # result = documentContentScraper(gn_certificate)
        result = documentContentScraper(nic)

        # Convert Pydantic model to dict for JSON serialization
        if hasattr(result, 'dict'):
            # For Pydantic v1
            response_data = result.dict()
        elif hasattr(result, 'model_dump'):
            # For Pydantic v2
            response_data = result.model_dump()
        else:
            # Fallback - convert to dict manually
            response_data = {
                "name": result.name,
                "email": result.email,
                "date": result.date
            }

        return jsonify({
            "success": True,
            "data": response_data
        }), 200

    except Exception as e:
        return jsonify({
            "error": f"Processing failed: {str(e)}"
        }), 500