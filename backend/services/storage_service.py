import os
import shutil
from app.config import Config

class StorageService:
    @staticmethod
    def save_upload(file, filename):
        file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
        file.save(file_path)
        return file_path

    @staticmethod
    def create_job_folder(job_id):
        job_folder = os.path.join(Config.IMAGE_FOLDER, job_id)
        if not os.path.exists(job_folder):
            os.makedirs(job_folder)
        return job_folder

    @staticmethod
    def get_result_path(job_id):
        return os.path.join(Config.RESULT_FOLDER, f"{job_id}.pdf")
        
    @staticmethod
    def cleanup_job(job_id):
        job_folder = os.path.join(Config.IMAGE_FOLDER, job_id)
        if os.path.exists(job_folder):
            shutil.rmtree(job_folder)
