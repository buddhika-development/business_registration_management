from flask import Flask
from config import Config
from app.route import document_validator_bp

def createApp(config: Config):

    app = Flask(__name__)
    app.config.from_object(config)

    app.register_blueprint(document_validator_bp)

    return app