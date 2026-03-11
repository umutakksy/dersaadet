import * as React from 'react';
import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, Languages, UploadCloud, X as XIcon } from 'lucide-react';
import { uploadPDF } from '../api/api';
import { motion, AnimatePresence } from 'framer-motion';

interface UploadBoxProps {
    onUploadSuccess: (jobId: string) => void;
}

const SUPPORTED_FORMATS = [
    { label: 'PDF', color: '#DC2626' },
    { label: 'PNG', color: '#2563EB' },
    { label: 'JPG', color: '#059669' },
    { label: 'WEBP', color: '#7C3AED' },
];

const UploadBox: React.FC<UploadBoxProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
        }
    }

    const validateAndSetFile = (selectedFile: File) => {
        const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(selectedFile.type)) {
            setError('Lütfen desteklenen biçimlerden birini seçiniz: PDF, PNG, JPG veya WEBP.');
            return;
        }
        if (selectedFile.size > 20 * 1024 * 1024) {
            setError('Dosya boyutu 20 MB sınırını aşmaktadır.');
            return;
        }
        setFile(selectedFile);
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        try {
            const { job_id } = await uploadPDF(file);
            onUploadSuccess(job_id);
        } catch (err: any) {
            setError('Yükleme sırasında bir hata oluştu: ' + (err.response?.data?.error || err.message));
        } finally {
            setLoading(false);
        }
    }

    const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);
    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            validateAndSetFile(e.dataTransfer.files[0]);
        }
    };

    const getFileIcon = () => {
        if (!file) return null;
        const ext = file.name.split('.').pop()?.toLowerCase();
        const fmt = SUPPORTED_FORMATS.find(f => f.label.toLowerCase() === ext);
        return fmt?.color || '#6B7280';
    };

    return (
        <div className="upload-box-container">
            <input
                type="file"
                id="fileUpload"
                ref={fileInputRef}
                accept="application/pdf,image/*"
                className="hidden"
                onChange={handleFileChange}
            />

            {/* Drop Zone */}
            <motion.label
                htmlFor="fileUpload"
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                whileHover={{ scale: 1.005 }}
                whileTap={{ scale: 0.998 }}
                className={`upload-dropzone ${isDragging ? 'is-dragging' : ''} ${file ? 'has-file' : ''}`}
            >
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="upload-empty-state"
                        >
                            <div className="upload-icon-wrapper">
                                <UploadCloud size={36} strokeWidth={1.5} />
                            </div>
                            <h4 className="upload-title">
                                Belgeyi buraya sürükleyin
                            </h4>
                            <p className="upload-subtitle">
                                veya dosya seçmek için <span className="upload-link">göz atın</span>
                            </p>
                            <div className="upload-formats">
                                {SUPPORTED_FORMATS.map(fmt => (
                                    <span
                                        key={fmt.label}
                                        className="upload-format-badge"
                                        style={{ '--badge-color': fmt.color } as React.CSSProperties}
                                    >
                                        {fmt.label}
                                    </span>
                                ))}
                            </div>
                            <p className="upload-size-info">Maks 2 sayfa PDF. Maks. dosya boyutu: 20 MB</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="selected"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="upload-selected-state"
                        >
                            <div className="upload-file-card">
                                <div className="upload-file-icon" style={{ background: `${getFileIcon()}12`, color: getFileIcon()! }}>
                                    <FileText size={24} />
                                </div>
                                <div className="upload-file-info">
                                    <span className="upload-file-name">{file.name}</span>
                                    <span className="upload-file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                </div>
                                <div className="upload-file-status">
                                    <CheckCircle2 size={20} className="text-green-500" />
                                </div>
                                <button
                                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); setFile(null); }}
                                    className="upload-file-remove"
                                    title="Dosyayı Kaldır"
                                >
                                    <XIcon size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.label>

            {/* Error */}
            <AnimatePresence>
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -8, height: 0 }}
                        className="upload-error"
                    >
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submit Button */}
            <motion.button
                onClick={handleUpload}
                disabled={!file || loading}
                className="upload-submit-btn"
                whileHover={file && !loading ? { scale: 1.01 } : {}}
                whileTap={file && !loading ? { scale: 0.99 } : {}}
            >
                {loading ? (
                    <div className="flex items-center gap-3">
                        <div className="upload-spinner" />
                        <span>İşleniyor...</span>
                    </div>
                ) : (
                    <div className="flex items-center justify-center gap-3">
                        <Languages size={18} />
                        <span>Analizi Başlat</span>
                    </div>
                )}
            </motion.button>
        </div>
    );
}

export default UploadBox;
