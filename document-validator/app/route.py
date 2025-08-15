from flask import Blueprint, jsonify, request
from  app.utils.bareKeyValidator import bearKeyValidator
from app.service.DocumentContentScraper import documentContentScraper

document_validator_bp = Blueprint("document_validator", __name__)

@document_validator_bp.route("/", methods = ["GET", "POST" , "PUT", "PATCH"])
def healthCheck():
    return jsonify({
        "status" : "Healthy route"
    }), 200


@document_validator_bp.route("/api/document-validator/gnc", methods=["POST"])
def documentValidation():
    bear_key = request.headers.get("bear-key")
    authorized_request = bearKeyValidator(bear_key)

    if not authorized_request:
        return jsonify({
            "error": "This request can't process."
        }), 400

    try:
        gn_certificate = request.files.get("gnc")

        data = {}
        data["name"] = request.form.get("name")

        if not gn_certificate:
            return jsonify({
                "error": "No required files provided"
            }), 400

        # result = documentContentScraper(gn_certificate)
        result = documentContentScraper(
            key="gnc",
            file=gn_certificate,
            data = data,
            bucket_name="gramanilaradi-certificate"
        )

        # Convert Pydantic model to dict for JSON serialization
        if hasattr(result, 'dict'):
            response_data = result.dict()
        elif hasattr(result, 'model_dump'):
            response_data = result.model_dump()
        else:
            response_data = {
                "name": result.name,
                "email": result.email,
                "date": result.date
            }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({
            "error": f"Processing failed: {str(e)}"
        }), 500


@document_validator_bp.route("/api/document-validator/lease", methods=["POST"])
def leaseDocumentValidation():
    bear_key = request.headers.get("bear-key")
    authorized_request = bearKeyValidator(bear_key)

    if not authorized_request:
        return jsonify({
            "error": "This request can't process."
        }), 400

    try:
        certificate = request.files.get("lease")

        data = {}
        data["name"] = request.form.get("name")
        data["address"] = request.form.get("address")

        if not certificate:
            return jsonify({
                "error": "No required files provided"
            }), 400

        # result = documentContentScraper(gn_certificate)
        result = documentContentScraper(
            key="lease",
            file= certificate,
            data = data,
            bucket_name= "lease-certificate"
        )

        # Convert Pydantic model to dict for JSON serialization
        if hasattr(result, 'dict'):
            response_data = result.dict()
        elif hasattr(result, 'model_dump'):
            response_data = result.model_dump()
        else:
            response_data = {
                "name": result.name,
                "email": result.email,
                "date": result.date
            }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({
            "error": f"Processing failed: {str(e)}"
        }), 500


@document_validator_bp.route("/api/document-validator/affidavit", methods=["POST"])
def affidavitDocumentValidation():
    bear_key = request.headers.get("bear-key")
    authorized_request = bearKeyValidator(bear_key)

    if not authorized_request:
        return jsonify({
            "error": "This request can't process."
        }), 400

    try:
        certificate = request.files.get("affidavit")

        data = {}
        data["name"] = request.form.get("name")
        data["address"] = request.form.get("address")

        if not certificate:
            return jsonify({
                "error": "No required files provided"
            }), 400

        # result = documentContentScraper(gn_certificate)
        result = documentContentScraper(
            key="affidavit",
            file=certificate,
            data = data,
            bucket_name="affidavit-certificate"
        )

        # Convert Pydantic model to dict for JSON serialization
        if hasattr(result, 'dict'):
            response_data = result.dict()
        elif hasattr(result, 'model_dump'):
            response_data = result.model_dump()
        else:
            response_data = {
                "name": result.name,
                "email": result.email,
                "date": result.date
            }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({
            "error": f"Processing failed: {str(e)}"
        }), 500

@document_validator_bp.route("/api/document-validator/moh", methods=["POST"])
def phiDocumentValidation():
    bear_key = request.headers.get("bear-key")
    authorized_request = bearKeyValidator(bear_key)

    if not authorized_request:
        return jsonify({
            "error": "This request can't process."
        }), 400

    try:
        certificate = request.files.get("phi")

        data = {}
        data["name"] = request.form.get("name")
        data["address"] = request.form.get("address")
        data["moh_area"] = request.form.get("moh_area")

        if not certificate:
            return jsonify({
                "error": "No required files provided"
            }), 400

        # result = documentContentScraper(gn_certificate)
        result = documentContentScraper(
            key="phi",
            file=certificate,
            data = data,
            bucket_name="moh-certificate"
        )

        # Convert Pydantic model to dict for JSON serialization
        if hasattr(result, 'dict'):
            response_data = result.dict()
        elif hasattr(result, 'model_dump'):
            response_data = result.model_dump()
        else:
            response_data = {
                "name": result.name,
                "email": result.email,
                "date": result.date
            }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({
            "error": f"Processing failed: {str(e)}"
        }), 500