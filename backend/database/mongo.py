from pymongo import MongoClient
from app.config import Config

class MongoDb:
    def __init__(self):
        self.client = None
        self.db = None

    def connect(self, uri=Config.MONGO_URI):
        self.client = MongoClient(uri)
        self.db = self.client.get_database()
        return self.db

    def get_db(self):
        if self.db is None:
            return self.connect()
        return self.db

# Singleton instance
mongo_db = MongoDb()
