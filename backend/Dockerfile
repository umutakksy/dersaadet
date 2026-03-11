# /backend/Dockerfile
FROM python:3.13-slim

# Install system dependencies
# poppler-utils for pdf2image
# tesseract-ocr for fallback OCR
# libgl1 for opencv (updated from libgl1-mesa-glx for Debian Trixie/3.13-slim)
RUN apt-get update && apt-get install -y \
    poppler-utils \
    tesseract-ocr \
    libgl1 \
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
