from database.mongo import mongo_db

class Page:
    @staticmethod
    def create(job_id, page_number, ocr_text):
        db = mongo_db.get_db()
        page_data = {
            "job_id": job_id,
            "page_number": page_number,
            "ocr_text": ocr_text,
            "translated_text": None,
            "status": "pending_translation"
        }
        db.pages.insert_one(page_data)

    @staticmethod
    def update_translation(job_id, page_number, translated_text):
        db = mongo_db.get_db()
        db.pages.update_one(
            {"job_id": job_id, "page_number": page_number},
            {"$set": {"translated_text": translated_text, "status": "translated"}}
        )

    @staticmethod
    def get_by_job_id(job_id):
        db = mongo_db.get_db()
        return list(db.pages.find({"job_id": job_id}).sort("page_number", 1))
