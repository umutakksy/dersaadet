from celery_worker import celery_app
from services.pdf_service import PDFService
from services.storage_service import StorageService
from models.job_model import Job
from models.page_model import Page
import os

@celery_app.task(name="workers.pdf_worker.generate_result_pdf")
def generate_result_pdf(job_id):
    """
    1. Update job status to 'pdf_generating'
    2. Get pages from MongoDB
    3. Generate the final PDF
    4. Save to results folder
    5. Cleanup image folder
    6. Mark job as completed
    """
    job = Job.get_by_id(job_id)
    if not job:
          return

    try:
        Job.update_status(job_id, "pdf_generating")
        
        pages = Page.get_by_job_id(job_id)
        if not pages:
            Job.update_status(job_id, "failed", error="No pages found in DB")
            return
            
        result_path = StorageService.get_result_path(job_id)
        final_pdf = PDFService.generate_translation_pdf(job_id, pages, result_path)
        
        # Cleanup temporary images
        StorageService.cleanup_job(job_id)
        
        # Final status update
        Job.update_status(job_id, "completed", result_path=result_path)
        
        print(f"Final PDF generated for Job {job_id}")
        
    except Exception as e:
        print(f"Error in PDF worker: {e}")
        Job.update_status(job_id, "failed", error=str(e))
