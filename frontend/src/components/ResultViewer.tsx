import * as React from 'react';
import { JobStatusResponse, downloadResultPdf } from '../api/api';
import { Download, CheckCircle2, Info, Copy, Check, BookOpen, Languages, Sparkles, StickyNote } from 'lucide-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ResultViewerProps {
    jobId: string;
    data: JobStatusResponse;
}

const PageResult: React.FC<{ page: any; index: number }> = ({ page, index }) => {
    const reportText = page.translated_text || page.ocr_text || "";
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(reportText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative bg-white shadow-sm border border-[#E8E2D9] rounded-2xl overflow-hidden mb-12"
        >
            {/* Page Ribbon */}
            <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none">
                <div className="absolute top-4 -right-8 w-32 h-8 bg-[#0A1628] text-[#C9A84C] text-[10px] font-bold tracking-widest flex items-center justify-center rotate-45 shadow-sm transform">
                    SAYFA {page.page_number}
                </div>
            </div>

            {/* Copy Button */}
            <button 
                onClick={handleCopy}
                className="absolute top-6 left-6 z-10 p-2.5 rounded-full bg-[#F5F4F1] text-[#57534E] hover:text-[#0A1628] hover:bg-[#E8E2D9] transition-all group border border-[#E8E2D9]"
                title="Metni Kopyala"
            >
                {copied ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                <span className="absolute left-12 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0A1628] text-white text-[11px] px-3 py-1.5 rounded-md whitespace-nowrap shadow-xl">
                    {copied ? 'Kopyalandı!' : 'Metni Kopyala'}
                </span>
            </button>

            <div className="p-10 md:p-14">
                <div className="prose prose-stone prose-headings:font-cinzel prose-headings:text-[#0A1628] prose-headings:text-center max-w-3xl mx-auto 
                    prose-p:text-[#44403C] prose-p:leading-relaxed prose-p:text-[15.5px] prose-p:text-center
                    prose-strong:text-[#1C1917] prose-strong:font-bold
                    prose-hr:border-[#F0EDE8]
                    prose-ul:list-none prose-ul:p-0 prose-ul:flex prose-ul:flex-col prose-ul:items-center
                ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {reportText || "Bu sayfa için analiz verisi üretilemedi."}
                    </ReactMarkdown>
                </div>
            </div>
        </motion.div>
    );
};

const ResultViewer: React.FC<ResultViewerProps> = ({ jobId, data }) => {
    return (
        <div className="w-full flex flex-col items-center space-y-12 pb-12">
            {/* Header */}
            <header className="text-center pt-6">
                <motion.div
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                >
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-green-50 text-green-700 text-[11px] font-semibold uppercase tracking-wider border border-green-100 mb-5">
                        <CheckCircle2 size={12} /> Analiz Tamamlandı
                    </span>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#1C1917] mb-3 font-cinzel">
                        {data.filename}
                    </h1>
                    <p className="text-[14px] text-[#57534E] max-w-lg mx-auto leading-relaxed">
                        Belgeniz başarıyla çözümlenerek akademik standar­tlarda raporlanmıştır.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center justify-center gap-4 mt-8 w-full">
                    <p className="text-[11px] text-[#A8A29E] font-medium uppercase tracking-widest mb-2">
                        Analiz Sonucu Hazır
                    </p>
                </div>
            </header>

            {/* Pages */}
            <div>
                {data.pages && data.pages.length > 0 ? (
                    data.pages.map((page, idx) => (
                        <PageResult key={idx} page={page} index={idx} />
                    ))
                ) : (
                    <div className="gc-card p-16 text-center border-dashed border-2">
                        <Info size={32} className="text-[#A8A29E] mx-auto mb-4" />
                        <h3 className="gc-h3 mb-1">Veri Bulunamadı</h3>
                        <p className="gc-body text-[14px]">Analiz sonuçları şu anda görüntülenememektedir.</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <footer className="pt-8 border-t border-[#E8E6E1] text-center">
                <p className="text-[11px] text-[#A8A29E] leading-relaxed tracking-wide uppercase">
                    Bu rapor, Dersaadet Paleografi Sistemi tarafından otomatik olarak oluşturulmuştur.
                    <br />
                    Kayıt No: {jobId.toUpperCase()}
                </p>
            </footer>
        </div>
    );
}

export default ResultViewer;
