from flask import Flask
from flask_cors import CORS
from config import Config

def create_app(config : Config):
    app = Flask(__name__)
    app.config.from_object(config)

    CORS(app)

    # blue print register
    from app.route import chat_bp
    app.register_blueprint(chat_bp)

    return app