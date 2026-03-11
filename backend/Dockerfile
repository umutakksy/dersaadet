# /backend/Dockerfile
FROM python:3.13-slim

# Install system dependencies
# poppler-utils for pdf2image
# tesseract-ocr and ottoman pack for fallback OCR
# libgl1-mesa-glx for opencv
RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    tesseract-ocr-ota \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Create folders for uploads and results
RUN mkdir -p uploads images results

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8088

# Default port for Flux
EXPOSE 8088

# Command will be overridden by docker-compose for workers
CMD ["gunicorn", "--bind", "0.0.0.0:8088", "--workers", "4", "--timeout", "120", "--access-logfile", "-", "run:app"]
