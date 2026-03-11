import os
from celery import Celery
from app.config import Config

def make_celery(app_name="dersaadet"):
    celery = Celery(
        app_name,
        broker=Config.REDIS_URL,
        backend=Config.REDIS_URL,
        include=['workers.ocr_worker', 'workers.translate_worker', 'workers.pdf_worker']
    )
    
    celery.conf.update(
        task_serializer='json',
        accept_content=['json'],
        result_serializer='json',
        timezone='UTC',
        enable_utc=True,
        task_always_eager=os.getenv("CELERY_EAGER", "False").lower() == "true",
    )
    
    return celery

celery_app = make_celery()
