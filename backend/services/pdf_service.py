import os
import re
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, PageBreak
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from pdf2image import convert_from_path

class PDFService:
    @staticmethod
    def pdf_to_images(pdf_path: str, output_folder: str) -> list:
        """
        Convert PDF pages to images.
        """
        try:
            images = convert_from_path(pdf_path)
            image_paths = []
            for i, image in enumerate(images):
                image_path = os.path.join(output_folder, f"page_{i + 1}.png")
                image.save(image_path, "PNG")
                image_paths.append(image_path)
            return image_paths
        except Exception as e:
            print(f"Error converting PDF to images: {e}")
            return []

    @staticmethod
    def _clean_markdown(text):
        """Simple cleanup of common markdown artifacts for PDF rendering if needed"""
        if not text:
            return ""
        # Convert markdown headers to bold for simplicity in reportlab Paragraphs
        text = re.sub(r'^---$', r'', text, flags=re.M) # Remove separators
        text = re.sub(r'^### (.*)$', r'<b>\1</b>', text, flags=re.M)
        text = re.sub(r'^## (.*)$', r'<font size="14"><b>\1</b></font>', text, flags=re.M)
        text = re.sub(r'^\*\* (.*)$', r'<b>\1</b>', text, flags=re.M) # Section headers
        text = re.sub(r'^\* (.*)$', r'&bull; \1', text, flags=re.M) # Bullet points
        text = re.sub(r'\*\*(.*?)\*\*', r'<b>\1</b>', text)
        text = re.sub(r'\*(.*?)\*', r'<i>\1</i>', text)
        # Preserve specific headers often used in the academic prompt
        text = text.replace('📋 AKADEMİK ANALİZ RAPORU:', '<font size="16"><b>AKADEMİK ANALİZ RAPORU</b></font>')
        # Ensure newlines are preserved as <br/>
        text = text.replace('\n', '<br/>')
        return text

    @staticmethod
    def generate_translation_pdf(job_id, pages_data, output_path):
        """
        Generate a premium academic PDF report.
        """
        doc = SimpleDocTemplate(
            output_path, 
            pagesize=A4,
            rightMargin=72, leftMargin=72,
            topMargin=72, bottomMargin=72
        )
        
        styles = getSampleStyleSheet()
        
        # Custom Styles
        title_style = ParagraphStyle(
            'HeaderTitle',
            parent=styles['Heading1'],
            fontSize=22,
            fontName='Helvetica-Bold',
            alignment=TA_CENTER,
            spaceAfter=12,
            textColor=colors.HexColor("#0A1628")
        )
        
        subtitle_style = ParagraphStyle(
            'SubTitle',
            parent=styles['Normal'],
            fontSize=10,
            fontName='Helvetica',
            alignment=TA_CENTER,
            spaceAfter=30,
            textColor=colors.HexColor("#A8A29E"),
            leading=14
        )
        
        report_style = ParagraphStyle(
            'ReportContent',
            parent=styles['Normal'],
            fontSize=11,
            fontName='Helvetica',
            leading=16,
            alignment=TA_JUSTIFY,
            spaceBefore=10,
            spaceAfter=10
        )
        
        page_indicator_style = ParagraphStyle(
            'PageIndicator',
            parent=styles['Normal'],
            fontSize=9,
            fontName='Helvetica-Bold',
            alignment=TA_CENTER,
            textColor=colors.white,
            backColor=colors.HexColor("#0A1628"),
            borderPadding=4,
            spaceBefore=20,
            spaceAfter=20
        )

        elements = []
        
        # Front Page / Header
        elements.append(Paragraph("DERSAADET", title_style))
        elements.append(Paragraph("Akademik Paleografi ve Belge Analiz Raporu", subtitle_style))
        elements.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#C9A84C"), spaceAfter=20))
        
        job_info = f"<b>İşlem Numarası:</b> {job_id}<br/><b>Rapor Tarihi:</b> 2025"
        elements.append(Paragraph(job_info, styles['Normal']))
        elements.append(Spacer(1, 0.4 * inch))

        for i, page in enumerate(pages_data):
            if i > 0:
                elements.append(PageBreak())
            
            # Page Badge
            elements.append(Paragraph(f"SAYFA {page.get('page_number', i+1)}", page_indicator_style))
            
            # Content (which is already the full academic report from the vision model)
            # Try to get result/analysis text in order of priority
            report_text = page.get('translated_text') or page.get('ocr_text') or "Bu sayfa için veri bulunamadı."
            cleaned_report = PDFService._clean_markdown(report_text)
            
            elements.append(Paragraph(cleaned_report, report_style))
            
            elements.append(Spacer(1, 0.5 * inch))
            elements.append(HRFlowable(width="30%", thickness=0.5, color=colors.HexColor("#E8E2D9"), hAlign='CENTER'))

        # Footer on every page logic can be complex in reportlab, 
        # but for simple DocTemplate we just build elements.
        
        try:
            doc.build(elements)
            return output_path
        except Exception as e:
            print(f"Error generating PDF: {e}")
            # Fallback to simple generation if build fails
            return PDFService._generate_fallback_pdf(job_id, pages_data, output_path)

    @staticmethod
    def _generate_fallback_pdf(job_id, pages_data, output_path):
        from reportlab.pdfgen import canvas
        c = canvas.Canvas(output_path, pagesize=A4)
        width, height = A4
        c.setFont("Helvetica-Bold", 16)
        c.drawString(50, height - 50, f"Dersaadet Analiz Raporu - {job_id}")
        c.save()
        return output_path
