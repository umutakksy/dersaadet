from celery_worker import celery_app
from services.translation_service import TranslationService
from models.job_model import Job
from models.page_model import Page

@celery_app.task(name="workers.translate_worker.process_translation")
def process_translation(job_id):
    """
    Check if pages need deep translation/analysis.
    """
    job = Job.get_by_id(job_id)
    if not job:
          return

    try:
        Job.update_status(job_id, "translation_processing")
        pages = Page.get_by_job_id(job_id)
        
        for page in pages:
            ocr_text = page.get("ocr_text", "")
            # If it's already a full report from Vision, we can either use it as is
            # or extract the translation part. 
            # For now, if translated_text is missing, we ensure it's filled.
            if not page.get("translated_text"):
                 # If ocr_text is already an academic report, we might just copy it
                 # or run it through deep translation service for refinement
                 if ocr_text.startswith("---") or "**1." in ocr_text:
                     # Already has analysis, we consider it the result
                     Page.update_translation(job_id, page.get("page_number"), ocr_text)
                 else:
                     # Basic OCR text, needs deep analysis/translation
                     translated = TranslationService.translate_to_modern_turkish(ocr_text)
                     Page.update_translation(job_id, page.get("page_number"), translated)
                 
        print(f"Translation/Analysis completed for Job {job_id}")
        
        # Chain to PDF generator
        from workers.pdf_worker import generate_result_pdf
        generate_result_pdf.delay(job_id)
        
    except Exception as e:
        print(f"Error in translation worker: {e}")
        Job.update_status(job_id, "failed", error=str(e))
