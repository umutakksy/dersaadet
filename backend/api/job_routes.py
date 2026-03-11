from flask import Blueprint, jsonify
from models.job_model import Job
from models.page_model import Page

job_bp = Blueprint("job", __name__)

@job_bp.route("/job/<job_id>", methods=["GET"])
def get_job_status(job_id):
    job = Job.get_by_id(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
        
    pages = Page.get_by_job_id(job_id)
    
    response = {
        "status": job["status"],
        "page_count": job["page_count"],
        "created_at": job["created_at"].isoformat() if job.get("created_at") else None,
        "filename": job["filename"],
        "error": job.get("error"),
        "pages": [
            {
                "page_number": p["page_number"],
                "ocr_text": p["ocr_text"],
                "translated_text": p["translated_text"]
            } for p in pages
        ]
    }
    
    return jsonify(response)
