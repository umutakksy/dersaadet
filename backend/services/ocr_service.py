import os
import base64
import requests
from groq import Groq
from PIL import Image
from app.config import Config

class OCRService:
    @staticmethod
    def extract_text_vision(image_path: str) -> str:
        """
        Extract and analyze Ottoman Turkish text using Groq Vision API.
        Adopted from ocr_osmanlica expert instructions.
        """
        if not Config.GROQ_API_KEY:
            return "Error: GROQ_API_KEY is not configured."

        try:
            # Read image and convert to base64
            with open(image_path, "rb") as image_file:
                image_bytes = image_file.read()
                base64_image = base64.b64encode(image_bytes).decode('utf-8')

            client = Groq(api_key=Config.GROQ_API_KEY)
            
            # Use defined vision model from config
            vision_model = Config.VISION_MODEL 

            osmanlica_grammar_rules = """
**AKADEMİK OSMANLI TÜRKÇESİ VE PALEOGRAFİ KURALLARI:**

1. **TRANSKRİPSİYON STANDARTLARI:**
   - Uzun ünlüler: â (elif), î (ye), û (vav). Örneğin; 'kitâb', 'meclîs', 'ma'lûm'.
   - Hemze ve Ayın: ('), (`). Örneğin; 'mü'min', 'tâbi`'.
   - İzafet ve Terkipler: Tire (-) ve kesme işareti (') kullanımı. Örneğin; 'Devlet-i Aliyye', 'Vezîr-i A`zam'.

2. **BELGE TÜRLERİ VE FORMATLARI:**
   - Fermân, Berât, Telhîs, Arz-ı Hâl, Şer`iyye Sicili, Tapu Tahrîr vb.
   - Siyâkat, Rika, Divânî, Nesih ve Sülüs yazı türlerinin karakteristik özellikleri.

3. **KELİME YAPISI VE İMLA:**
   - Arapça ve Farsça kökenli kelimelerin orijinal imla yapısının korunarak Latin harflerine aktarımı.
   - Türkçe eklerin (ler/lar, dir/dır vb.) ses uyumuna göre doğru transkripsiyonu.

4. **TARİH VE İMZALAR:**
   - Hicrî/Rûmî tarihlerin okunması ve Güncel (Mîladî) karşılıklarının tespiti.
   - Pençe, Mühür ve Tuğra okumaları.
"""

            system_expert = """Sen, 19. ve 20. yüzyıl matbu Osmanlıca metinler üzerinde uzmanlaşmış, halüsinasyon (uydurma) üretmeyen profesyonel bir Paleografya Uzmanısın.

**OPERASYONEL KURALLAR:**
1. SÖZLÜK TABANLI KONTROL: Osmanlıca "vav, hı, kef" gibi benzer harflerin karıştırılmasına (örn: "tesellisi" yerine "tesisatı") izin verme. Kelimenin köküne (Arapça/Farsça/Türkçe) bak ve cümlenin bağlamına uygunluğunu denetle.
2. ETTİRGENLİK HATASI YAPMA: Fiil eklerini (yazdı/yazdırdı, okurdu/okuttu) orijinaline sadık kalarak çevir.
3. MODERN TÜRKÇE ADAPTESİ: Anlamı bozmadan güncel ama saygın bir dille aktar.
4. BELİRSİZLİKTE DUR: Eğer bir kelime görsel kalitesi nedeniyle %100 net değilse, uydurmak yerine [?] işareti koy.
5. DÜRÜSTLÜK VE DOĞRULUK: Emin değilsen akademik görünmeye çalışma. Doğruluk, raporun tam olmasından daha önemlidir. (Accuracy is more important than a complete report.)
"""

            prompt = """Görseldeki Osmanlıca metni hatasız ve akademik bir titizlikle çözümle. Analizini aşağıdaki formatta raporla:

---
### 1. ORİJİNAL METİN (ARAP HARFLERİ)
[Görselde gördüğün metni Arap harfleriyle hatasız yaz]

### 2. TRANSKRİPSİYON (OKUNUŞ)
[Metnin Latin harfleriyle tam okunuşu - transkripsiyon işaretlerine dikkat ederek]

### 3. GÜNÜMÜZ TÜRKÇESİ (YALINLAŞTIRILMIŞ)
[Metnin akıcı, anlaşılır ve akademik üslupta modern Türkçe çevirisi]

### 4. KRİTİK KELİME ANALİZİ
- [Kelime]: [Köken/Anlam] (Neden bu şekilde çevirdiğini kısaca açıkla)
---
"""

            completion = client.chat.completions.create(
                model=vision_model,
                messages=[
                    {"role": "system", "content": system_expert},
                    {
                        "role": "user",
                        "content": [
                            {"type": "text", "text": prompt},
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}",
                                    "detail": "high"
                                },
                            },
                        ],
                    }
                ],
                temperature=0,
                max_tokens=4000,
                top_p=1,
                stream=False,
            )
            
            return completion.choices[0].message.content.strip()

        except Exception as e:
            print(f"Vision OCR Error: {e}")
            return f"Error analyzing image: {str(e)}"

    @staticmethod
    def extract_text_basic(image_path: str, lang: str = "tur") -> str:
        """Fallback to local Tesseract if needed or if not using vision."""
        import pytesseract
        try:
            image = Image.open(image_path)
            custom_config = r'--oem 3 --psm 6'
            text = pytesseract.image_to_string(image, lang="ota+tur", config=custom_config)
            return text.strip()
        except Exception as e:
            print(f"Basic OCR Error: {e}")
            return ""
