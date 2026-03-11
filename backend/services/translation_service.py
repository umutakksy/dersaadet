import os
import openai
from groq import Groq
from app.config import Config

class TranslationService:
    GRAMMAR_RULES = """
**OSMANLI TÜRKÇESİ DİLBİLGİSİ KURALLARI:**
1. İZAFET: kitâb-ı cedîd (yeni kitap)
2. UZUN ÜNLÜLER: â (elif), î (ye), û (vav)
3. ÇOĞULLAR: kütüb, ulemâ, -ân, -gân
4. YAPIM EKLERİ: -dâr, -nâk
5. FIİL ÇEKİMLERİ: eyledi, etdi, oldı
6. BAĞLAÇLAR: ve, veyâ, ammâ
"""

    SYSTEM_EXPERT = f"""Sen, üniversite kürsü düzeyinde çalışan, Osmanlı kurum tarihi ve paleografi alanında yetkin bir 'Osmanlı Türkçesi Uzmanısın'. 
Görevin, ham metin verilerini akademik bir titizlikle işlemek, diplomatik kuralları gözetmek ve metnin ruhuna sadık kalarak çözümlemektir.

**AKADEMİK DİREKTİFLER:**
1. **TRANSKRİPSİYON:** TDK ve Tarih Kurumu standartlarına göre â, î, û şapkalarını hatasız yerleştir.
2. **İZAFET VE TERKİPLER:** Farisî ve Arabî terkipleri tire (-) ile bağlayarak göster.
3. **ÜSLUP:** Çeviri dilin ne çok ağdalı ne de çok sokak ağzı olmalı; devlet arşivleri çeviri dili (resmî ve akademik) kullanılmalı.
4. **ANALİZ:** Kelime kökenlerine (Sülâsî, Mezîdünfîh vb.) ve gramer yapılarına (Tamlama, Edat vb.) dikkat çek.

{GRAMMAR_RULES}
"""

    @staticmethod
    def translate_to_modern_turkish(text: str) -> str:
        """
        Gelişmiş akademik çeviri ve derinlemesine paleografik analiz hizmeti.
        """
        if not text:
            return ""

        client = None
        if Config.GROQ_API_KEY:
            try:
                client = Groq(api_key=Config.GROQ_API_KEY)
                model = Config.LLM_MODEL

                prompt = f"""Ekteki veriyi bir 'Osmanlı Paleografi Uzmanı ve Tarihçi' titizliğiyle incele. 
Metni önce akademik transkripsiyon standartlarına çek, ardından günümüz Türkçesine en doğru ve resmî üslupla aktar.

**GİRDİ (HAM VERİ):**
{text}

**ÇIKTI FORMATI (AKADEMİK FORMAT):**
---
**1. AKADEMİK TRANSKRİPSİYON:**
[Latinize edilmiş metin - â, î, û işaretli - Satır takibi yapılarak]

**2. GÜNÜMÜZ TÜRKÇESİ (RESMÎ AKTARIM):**
[Belgenin anlamını tam ifade eden, resmî ve akademik üslupta modern Türkçe metin]

**3. LUGAT VE DİPLOMATİK ŞERH:**
[Metindeki önemli terkiplerin, makam isimlerinin ve teknik ifadelerin tahlili]

**4. GRAMER VE İMLA ANALİZİ:**
[Kelime yapıları ve imla özelliklerine dair uzman notları]

**5. TARİH VE BAĞLAM DURUMU:**
[Belgenin oluştuğu tarihî arka plan ve muhtemel belge türü hakkında akademik görüş]
---
"""

                completion = client.chat.completions.create(
                    model=model,
                    messages=[
                        {"role": "system", "content": TranslationService.SYSTEM_EXPERT},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.1,
                )
                return completion.choices[0].message.content.strip()
            except Exception as e:
                print(f"Groq translation error: {e}")

        return f"Analiz ve çeviri: {text[:100]}..."
