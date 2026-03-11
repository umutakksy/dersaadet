import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { X, BookOpen, ArrowRight, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: (user: any) => void;
}

const LoginModal: React.FC<LoginModalProps> = ({
    isOpen,
    onClose,
    onLoginSuccess,
}) => {
    const handleGoogleSuccess = (credentialResponse: any) => {
        onLoginSuccess({
            name: "Akademik Kullanıcı",
            loggedIn: true,
            email: "demo@gurceviri.com",
        });
        onClose();
    };

    const handleDevLogin = () => {
        onLoginSuccess({
            name: "Akademik Kullanıcı (Demo)",
            loggedIn: true,
            email: "umut@demo.com",
        });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Close */}
                        <button
                            onClick={onClose}
                            className="absolute right-4 top-4 p-2 rounded-lg hover:bg-gray-100 transition-colors z-20"
                        >
                            <X size={18} className="text-gray-400" />
                        </button>

                        {/* Header */}
                        <div className="bg-[#0A1628] px-8 pt-10 pb-14 text-center relative">
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-0 right-0 w-48 h-48 bg-[#C9A84C]/40 rounded-full blur-3xl -mr-24 -mt-24" />
                            </div>
                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/10 border border-white/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-[#C9A84C]">
                                    <BookOpen size={28} />
                                </div>
                                <h2 className="text-xl font-cinzel font-bold text-white tracking-wider">
                                    DERSAADET
                                </h2>
                                <p className="text-white/40 text-[12px] mt-1 font-medium">
                                    Paleografi ve Belge Analiz Sistemi
                                </p>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="px-8 pt-8 pb-6 -mt-6 bg-white rounded-t-2xl relative z-10">
                            <p className="text-center text-[#57534E] text-[13px] mb-8 font-medium">
                                Sistemi kullanmak için Google hesabınızla giriş yapınız.
                            </p>

                            <div className="flex flex-col items-center gap-6">
                                {/* Google Login */}
                                <div className="w-full flex justify-center">
                                    <GoogleLogin
                                        onSuccess={handleGoogleSuccess}
                                        onError={() => console.log("Login Failed")}
                                        theme="outline"
                                        size="large"
                                        text="continue_with"
                                        shape="rectangular"
                                        width="350"
                                    />
                                </div>

                                {/* Divider */}
                                <div className="flex items-center w-full gap-4">
                                    <div className="h-px flex-grow bg-[#E8E6E1]" />
                                    <span className="text-[11px] font-semibold text-[#A8A29E] tracking-wider uppercase">
                                        veya
                                    </span>
                                    <div className="h-px flex-grow bg-[#E8E6E1]" />
                                </div>

                                {/* Demo Login */}
                                <button
                                    onClick={handleDevLogin}
                                    className="w-full group h-12 bg-[#F5F4F1] hover:bg-[#E8E6E1] text-[#1C1917] border border-[#E8E6E1] rounded-lg transition-all flex items-center justify-center gap-3"
                                >
                                    <UserCheck size={16} className="text-[#A8A29E] group-hover:text-[#6B1422] transition-colors" />
                                    <span className="text-[13px] font-semibold">Demo Giriş</span>
                                    <ArrowRight size={14} className="text-[#A8A29E] group-hover:translate-x-0.5 transition-all" />
                                </button>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="px-8 py-5 text-center bg-[#F5F4F1] border-t border-[#E8E6E1]">
                            <p className="text-[12px] text-[#A8A29E] leading-relaxed">
                                Giriş yaparak kullanım koşullarını kabul etmiş olursunuz.
                            </p>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default LoginModal;