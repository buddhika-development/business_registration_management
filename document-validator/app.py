from dotenv import load_dotenv

from app import createApp
from config import DevelopmentConfig, ProductionConfig
import os

load_dotenv()

config = DevelopmentConfig if os.getenv("FLASK_ENV") is not "production" else ProductionConfig()
app = createApp(config)

if __name__ == "__main__":
    app.run(
        port= 8001,
        debug= config.DEBUG
    )