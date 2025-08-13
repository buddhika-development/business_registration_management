from dotenv import load_dotenv
from app import  create_app
from config import DevelopmentConfig, ProductionConfig
import os

load_dotenv()

config = DevelopmentConfig() if not os.getenv("FLASK_ENV") == 'production' else ProductionConfig()
app = create_app(config)


if __name__ == "__main__":
    app.run(
        port= 8000,
        debug= config.DEBUG
    )