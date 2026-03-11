from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from app.config import Config
from services.storage_service import StorageService
from models.job_model import Job
from workers.ocr_worker import process_pdf_ocr
import os

upload_bp = Blueprint("upload", __name__)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in Config.ALLOWED_EXTENSIONS

@upload_bp.route("/upload", methods=["POST"])
def upload_file():
    print("\n[API] >>> Yeni yükleme isteği alındı.")
    if "file" not in request.files:
        print("[API] !!! Dosya bulunamadı.")
        return jsonify({"error": "No file part"}), 400
    
    file = request.files["file"]
    
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        ext = filename.rsplit(".", 1)[1].lower()
        
        # Create a unique filename for storage
        unique_filename = f"{os.urandom(8).hex()}_{filename}"
        file_path = StorageService.save_upload(file, unique_filename)
        
        # Create Job in MongoDB
        job_id = Job.create(filename, file_path)
        print(f"[API] >>> Job oluşturuldu. ID: {job_id}")
        
        # Start appropriate OCR background task
        try:
             print(f"[API] >>> OCR görevi Celery'e gönderiliyor...")
             process_pdf_ocr.delay(job_id)
        except Exception as e:
            print(f"[API] !!! Celery hatası: {str(e)}")
            return jsonify({"error": f"Failed to start task: {str(e)}"}), 500
        
        return jsonify({"job_id": job_id}), 201
    
    print(f"[API] !!! Geçersiz dosya tipi: {file.filename}")
    return jsonify({"error": f"Invalid file type. Allowed: {Config.ALLOWED_EXTENSIONS}"}), 400
