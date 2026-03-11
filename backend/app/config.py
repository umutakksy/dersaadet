import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # MongoDB
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/dersaadet")
    
    # Redis for Celery
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # AI Translation
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
    GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
    LLM_MODEL = os.getenv("LLM_MODEL", "openai/gpt-oss-120b")
    VISION_MODEL = os.getenv("VISION_MODEL", "meta-llama/llama-4-scout-17b-16e-instruct")

    # Storage Paths
    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
    IMAGE_FOLDER = os.path.join(BASE_DIR, "images")
    RESULT_FOLDER = os.path.join(BASE_DIR, "results")
    
    # Allowed Extensions
    ALLOWED_EXTENSIONS = {"pdf", "png", "jpg", "jpeg"}
    MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50MB

    @staticmethod
    def init_app(app):
        # Create necessary folders if they don't exist
        for folder in [Config.UPLOAD_FOLDER, Config.IMAGE_FOLDER, Config.RESULT_FOLDER]:
            if not os.path.exists(folder):
                os.makedirs(folder)
