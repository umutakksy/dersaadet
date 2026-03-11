import os
from celery_worker import celery_app
from services.ocr_service import OCRService
from services.pdf_service import PDFService
from services.storage_service import StorageService
from models.job_model import Job
from models.page_model import Page

@celery_app.task(name="workers.ocr_worker.process_pdf_ocr")
def process_pdf_ocr(job_id):
    """
    Decide if job is PDF or Image, then process accordingly.
    """
    print(f"\n[WORKER] >>> OCR İşlemi Başladı | Job ID: {job_id}")
    job = Job.get_by_id(job_id)
    if not job:
        print(f"Job {job_id} not found.")
        return

    try:
        Job.update_status(job_id, "ocr_processing")
        file_path = job.get("file_path")
        ext = file_path.rsplit(".", 1)[1].lower()

        if ext == "pdf":
            job_folder = StorageService.create_job_folder(job_id)
            image_paths = PDFService.pdf_to_images(file_path, job_folder)[:2] # Max 2 pages
            
            if not image_paths:
                Job.update_status(job_id, "failed", error="PDF to Image conversion failed")
                return
                
            Job.update_status(job_id, "ocr_processing", page_count=len(image_paths))
            
            for i, img_path in enumerate(image_paths):
                # Use standard OCR or Vision OCR? 
                # For ocr_osmanlica style, we use Vision.
                analysis_report = OCRService.extract_text_vision(img_path)
                # Store the whole report as ocr_text for now
                Page.create(job_id, i + 1, analysis_report)
                
        elif ext in ["png", "jpg", "jpeg"]:
            print(f"[WORKER] >>> Görsel OCR (Vision) başlatılıyor: {ext}")
            Job.update_status(job_id, "ocr_processing", page_count=1)
            analysis_report = OCRService.extract_text_vision(file_path)
            Page.create(job_id, 1, analysis_report)
            print("[WORKER] >>> Görsel analiz tamamlandı.")
            
        print(f"[WORKER] >>> Job {job_id} için OCR bitti. Çeviriye geçiliyor...")
        
        # After Vision OCR, we already have translation/analysis.
        # But we still chain to translation worker to mark pages as 'translated'
        from workers.translate_worker import process_translation
        process_translation.delay(job_id)

    except Exception as e:
        print(f"Error in OCR worker: {e}")
        Job.update_status(job_id, "failed", error=str(e))
