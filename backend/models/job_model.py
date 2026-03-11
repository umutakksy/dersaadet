from datetime import datetime
import uuid
from database.mongo import mongo_db

class Job:
    @staticmethod
    def create(filename, file_path):
        db = mongo_db.get_db()
        job_id = str(uuid.uuid4())
        job_data = {
            "_id": job_id,
            "filename": filename,
            "file_path": file_path,
            "status": "uploaded",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow(),
            "page_count": 0,
            "result_path": None,
            "error": None
        }
        db.jobs.insert_one(job_data)
        return job_id

    @staticmethod
    def update_status(job_id, status, **kwargs):
        db = mongo_db.get_db()
        update_data = {"status": status, "updated_at": datetime.utcnow()}
        update_data.update(kwargs)
        db.jobs.update_one({"_id": job_id}, {"$set": update_data})

    @staticmethod
    def get_by_id(job_id):
        db = mongo_db.get_db()
        return db.jobs.find_one({"_id": job_id})
