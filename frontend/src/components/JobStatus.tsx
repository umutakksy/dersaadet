import * as React from 'react';
import { useEffect, useState } from 'react';
import { getJobStatus, JobStatusResponse } from '../api/api';
import { Loader2, CheckCircle2, AlertCircle, FileText, Languages, FileDown, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface JobStatusProps {
    jobId: string;
    onComplete: (data: JobStatusResponse) => void;
}

const JobStatus: React.FC<JobStatusProps> = ({ jobId, onComplete }) => {
    const [data, setData] = useState<JobStatusResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let interval: any;
        const fetchStatus = async () => {
            try {
                const res = await getJobStatus(jobId);
                setData(res);
                if (res.status === 'completed') {
                    clearInterval(interval);
                    onComplete(res);
                } else if (res.status === 'failed') {
                    clearInterval(interval);
                }
            } catch (err: any) {
                setError('Durum bilgisi alınamadı: ' + (err.response?.data?.error || err.message));
                clearInterval(interval);
            } finally {
                setLoading(false);
            }
        };
        fetchStatus();
        interval = setInterval(fetchStatus, 3000);
        return () => clearInterval(interval);
    }, [jobId, onComplete]);

    const steps = [
        { key: 'uploaded', label: 'Belge Kabul Edildi', icon: CheckCircle2 },
        { key: 'ocr_processing', label: 'Metin Çıkarımı (OCR)', icon: FileText },
        { key: 'translation_processing', label: 'Çeviri İşlemi', icon: Languages },
        { key: 'pdf_generating', label: 'Rapor Oluşturuluyor', icon: FileDown },
        { key: 'completed', label: 'İşlem Tamamlandı', icon: CheckCircle2 },
    ];

    const getCurrentStepIndex = () => {
        if (!data) return 0;
        const index = steps.findIndex(s => s.key === data.status);
        return index === -1 ? 0 : index;
    };

    if (loading && !data) return (
        <div className="flex flex-col items-center justify-center p-20 gc-card">
            <div className="relative mb-6">
                <div className="w-12 h-12 border-3 border-[#E8E6E1] border-t-[#6B1422] rounded-full animate-spin" />
            </div>
            <p className="text-[15px] text-[#1C1917] font-semibold">Bağlantı kuruluyor...</p>
        </div>
    );

    if (error || (data && data.status === 'failed')) return (
        <div className="flex flex-col items-center p-12 gc-card text-center">
            <div className="w-14 h-14 bg-red-50 rounded-xl flex items-center justify-center text-red-500 mb-6">
                <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2 text-[#1C1917]">İşlem Başarısız</h3>
            <p className="text-[#57534E] text-[14px] max-w-sm mb-8">{error || data?.error}</p>
            <button
                onClick={() => window.location.reload()}
                className="gc-btn-primary"
            >
                <RefreshCw size={16} />
                Yeniden Dene
            </button>
        </div>
    );

    const progress = ((getCurrentStepIndex() + 1) / steps.length) * 100;

    return (
        <div className="gc-card !p-0 max-w-2xl mx-auto overflow-hidden">
            {/* Progress Bar */}
            <div className="w-full h-1 bg-[#E8E6E1]">
                <motion.div
                    className="h-full bg-[#6B1422]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                />
            </div>

            <div className="p-8 md:p-10">
                <div className="flex flex-col items-center text-center gap-2 mb-10 pb-6 border-b border-[#F0EDE8]">
                    <div className="gc-badge mb-1">İşlem Durumu</div>
                    <h2 className="text-2xl font-bold text-[#1C1917] font-cinzel tracking-tight">Belge Analizi Devam Ediyor</h2>
                </div>

                <div className="space-y-2">
                    {steps.map((step, idx) => {
                        const isCurrent = idx === getCurrentStepIndex();
                        const isPast = idx < getCurrentStepIndex();
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.key}
                                className={`flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 ${isCurrent
                                        ? 'bg-[#F5F4F1] border border-[#E8E6E1]'
                                        : isPast
                                            ? 'opacity-60'
                                            : 'opacity-25'
                                    }`}
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${isPast
                                        ? 'bg-green-50 text-green-600'
                                        : isCurrent
                                            ? 'bg-[#6B1422] text-white'
                                            : 'bg-[#E8E6E1] text-[#A8A29E]'
                                    }`}>
                                    {isPast ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                                </div>
                                <div className="flex-grow">
                                    <h4 className={`text-[14px] font-semibold ${isCurrent ? 'text-[#1C1917]' : 'text-[#57534E]'
                                        }`}>
                                        {step.label}
                                    </h4>
                                    {isCurrent && (
                                        <p className="text-[11px] text-[#6B1422] mt-0.5 font-medium animate-pulse">
                                            İşlem devam ediyor...
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default JobStatus;
