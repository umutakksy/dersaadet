# Dersaadet - AI Destekli Osmanlıca Çeviri Platformu

Dersaadet, Osmanlıca ve eski Türkçe metinleri modern Türkçeye çevirmek için tasarlanmış yüksek teknolojili bir web platformudur. Kraken/Tesseract OCR ve yapay zekâ (LLM) kullanarak arşiv belgelerini dijital ortama aktarır ve tercüme eder.

## Özellikler

- **PDF Yükleme**: Büyük boyutlu belgeleri destekler.
- **Asenkron İşleme**: OCR ve çeviri işlemleri Celery workerları ile arka planda yapılır.
- **Gelişmiş OCR**: Tesseract (veya Kraken) ile metin tam doğruluğu.
- **AI Çeviri**: GPT-4 veya benzeri modellerle akıcı modern Türkçe.
- **Sonuç Önizleme**: Orijinal metin ve çeviri yan yana görüntülenebilir.
- **PDF İndirme**: Çevrilmiş belgenizi anında PDF olarak indirin.

---

## Kurulum Talimatları

### Gereksinimler

- Python 3.9+
- Node.js & npm
- MongoDB
- Redis (Celery için)
- Tesseract OCR (`apt install tesseract-ocr` veya Windows için `exe`)
- Poppler (`pdf2image` kütüphanesi için gereklidir)

### 1. Backend Kurulumu

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows için: venv\Scripts\activate
pip install -r requirements.txt
```

#### Environment Ayarları (.env)
`backend/.env` dosyası oluşturun ve şu bilgileri ekleyin:
```env
MONGO_URI=mongodb://localhost:27017/dersaadet
REDIS_URL=redis://localhost:6379/0
OPENAI_API_KEY=your_key_here
LLM_MODEL=gpt-4-turbo-preview
```

### 2. Frontend Kurulumu

```bash
cd frontend
npm install
```

---

## Sistemi Çalıştırma

Sistemin tam kapasite çalışması için 4 terminal penceresine ihtiyacınız vardır.

### Terminal 1: MongoDB & Redis
Servislerin aktif olduğundan emin olun.

### Terminal 2: Flask API
```bash
cd backend
python run.py
```

### Terminal 3: Celery Worker
```bash
cd backend
celery -A celery_worker.celery_app worker --loglevel=info
```
*(Windows için `--pool=solo` flag'ini eklemeniz gerekebilir: `celery -A celery_worker.celery_app worker --pool=solo --loglevel=info`)*

### Terminal 4: Frontend
```bash
cd frontend
npm run dev
```

---

## Dosya Yapısı

- `backend/uploads/`: Kullanıcıların yüklediği ham PDF dosyaları.
- `backend/images/`: İşlem sırasında sayfaların dönüştürüldüğü görüntüler.
- `backend/results/`: Oluşturulan çeviri PDF'leri.

## Güvenlik & Optimizasyon

- Dosya türü doğrulaması (Sadece .pdf).
- Maksimum 50MB dosya boyutu sınırı.
- Temizlik mekanizması (Geçici görüntüler işlem bittiğinde silinir).
