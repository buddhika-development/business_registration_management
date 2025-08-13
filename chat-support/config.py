from dotenv import load_dotenv
import  os

load_dotenv()

class Config:
    GOOGLE_API_KEY= os.getenv("GOOGLE_API_KEY")
    CHROMA_PERSIST_DIRECTORY= os.getenv("CHROMA_PERSIST_DIRECTORY")
    MAX_CHUNK_SIZE=600
    CHUNK_OVERLAP=200
    MAX_TOKEN=200
    TEMPERATURE=0.9

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    DEBUG = False