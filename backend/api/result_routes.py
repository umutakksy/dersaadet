from flask import Blueprint, send_file, jsonify
from models.job_model import Job
import os

result_bp = Blueprint("result", __name__)

@result_bp.route("/result/<job_id>", methods=["GET"])
def download_result(job_id):
    job = Job.get_by_id(job_id)
    if not job:
        return jsonify({"error": "Job not found"}), 404
    
    if job["status"] != "completed":
        return jsonify({"error": "Job not completed yet"}), 400
    
    result_path = job.get("result_path")
    if not result_path or not os.path.exists(result_path):
        return jsonify({"error": "Result file not found on server"}), 404
    
    return send_file(result_path, as_attachment=True, download_name=f"ceviri_{job['filename']}")
