import * as React from 'react';
import { useState, useEffect } from 'react';
import UploadBox from './components/UploadBox';
import JobStatus from './components/JobStatus';
import ResultViewer from './components/ResultViewer';
import LoginModal from './components/LoginModal';
import { JobStatusResponse } from './api/api';
import {
    BookOpen,
    ChevronRight,
    User as UserIcon,
    Globe,
    Sparkles,
    ShieldCheck,
    Cpu,
    Zap,
    ArrowRight,
    FileText,
    LogOut,
    Menu,
    X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
    const [user, setUser] = useState<any>(null);
    const [loginModalOpen, setLoginModalOpen] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [result, setResult] = useState<JobStatusResponse | null>(null);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem('dersaadet_user');
        if (savedUser) setUser(JSON.parse(savedUser));

        const handleScroll = () => setIsScrolled(window.scrollY > 30);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogin = (userData: any) => {
        setUser(userData);
        localStorage.setItem('dersaadet_user', JSON.stringify(userData));
        setLoginModalOpen(false);
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('dersaadet_user');
        setJobId(null);
        setResult(null);
    };

    const scrollToSection = (id: string) => {
        setMobileMenuOpen(false);
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#FAFAF8]">
            <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onLoginSuccess={handleLogin}
            />

            {/* ──── HEADER ──── */}
            <header
                className={`fixed top-0 z-50 w-full transition-all duration-300 ${isScrolled || user
                        ? 'bg-white/98 backdrop-blur-sm shadow-[0_1px_0_rgba(0,0,0,0.06)] py-3'
                        : 'bg-transparent py-5'
                    }`}
            >
                {/* Full-width container — stretching to the corners */}
                <div className="w-full px-8 flex items-center justify-between">

                    {/* Logo */}
                    <button
                        className="flex items-center gap-3 shrink-0 group"
                        onClick={() => { setJobId(null); setResult(null); }}
                    >
                        <div
                            className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300 ${isScrolled || user
                                    ? 'bg-[#0A1628] text-[#C9A84C]'
                                    : 'bg-white/10 text-white border border-white/15'
                                }`}
                        >
                            <BookOpen size={18} />
                        </div>
                        <span
                            className={`text-[15px] font-cinzel font-bold tracking-[0.18em] transition-colors duration-300 ${isScrolled || user ? 'text-[#0A1628]' : 'text-white'
                                }`}
                        >
                            DERSAADET
                        </span>
                    </button>

                    {/* Desktop nav — only when logged out */}
                    {!user && (
                        <nav
                            className={`hidden md:flex items-center gap-8 text-[12.5px] font-semibold tracking-wide transition-colors duration-300 ${isScrolled ? 'text-[#57534E]' : 'text-white/70'
                                }`}
                        >
                            {['about', 'features', 'team'].map((id) => (
                                <button
                                    key={id}
                                    onClick={() => scrollToSection(id)}
                                    className="hover:text-[#C9A84C] transition-colors capitalize"
                                >
                                    {id === 'about' ? 'Hakkında' : id === 'features' ? 'Özellikler' : 'Ekip'}
                                </button>
                            ))}
                        </nav>
                    )}

                    {/* Right side */}
                    <div className="flex items-center gap-3">
                        {!user ? (
                            <>
                                <button
                                    onClick={() => setLoginModalOpen(true)}
                                    className={`hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${isScrolled
                                            ? 'bg-[#6B1422] text-white hover:bg-[#8A1A2E]'
                                            : 'bg-white/10 text-white border border-white/15 hover:bg-white/20'
                                        }`}
                                >
                                    <UserIcon size={14} />
                                    Giriş Yap
                                </button>
                                <button
                                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                    className="md:hidden p-2"
                                    aria-label="Menü"
                                >
                                    {mobileMenuOpen
                                        ? <X size={20} className={isScrolled ? 'text-[#0A1628]' : 'text-white'} />
                                        : <Menu size={20} className={isScrolled ? 'text-[#0A1628]' : 'text-white'} />
                                    }
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-4 py-1.5 px-3 rounded-full bg-[#F5F4F1] border border-[#E8E2D9]">
                                    <div className="w-8 h-8 rounded-full bg-[#0A1628] text-[#C9A84C] flex items-center justify-center text-[11px] font-bold shadow-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="hidden sm:flex flex-col">
                                        <span className="text-[9px] font-bold text-[#A8A29E] uppercase tracking-widest leading-none mb-1">
                                            OTURUM AÇILDI
                                        </span>
                                        <span className="font-bold text-[13px] text-[#1C1917] leading-none">
                                            {user.name}
                                        </span>
                                    </div>
                                </div>

                                <div className="h-6 w-px bg-[#E8E2D9]" />

                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full text-[12px] font-bold text-[#6B1422] hover:bg-red-50 hover:shadow-sm transition-all border border-transparent hover:border-red-100"
                                >
                                    <LogOut size={14} />
                                    <span>Çıkış Yap</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile dropdown */}
                <AnimatePresence>
                    {mobileMenuOpen && !user && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="md:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
                        >
                            <div className="w-full px-12 py-6 flex flex-col gap-1">
                                {['about', 'features', 'team'].map((id) => (
                                    <button
                                        key={id}
                                        onClick={() => scrollToSection(id)}
                                        className="text-left py-3 px-4 rounded-lg text-sm font-semibold text-[#57534E] hover:bg-[#F5F4F1] transition-colors"
                                    >
                                        {id === 'about' ? 'Hakkında' : id === 'features' ? 'Özellikler' : 'Ekip'}
                                    </button>
                                ))}
                                <div className="pt-2 border-t border-gray-100 mt-1">
                                    <button
                                        onClick={() => { setMobileMenuOpen(false); setLoginModalOpen(true); }}
                                        className="w-full gc-btn-primary text-center"
                                    >
                                        <UserIcon size={14} />
                                        Giriş Yap
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* ──── MAIN ──── */}
            <main className="flex-grow">
                <AnimatePresence mode="wait">
                    {!user ? (

                        /* ══════════════ LANDING ══════════════ */
                        <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

                            {/* HERO */}
                            <section className="bg-hero-gradient relative min-h-[92vh] flex items-center justify-center text-center overflow-hidden">
                                <div className="mx-auto w-full max-w-6xl px-6 relative z-10 py-20 flex flex-col items-center justify-center">
                                    <motion.div
                                        initial={{ y: 24, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                        className="flex flex-col items-center max-w-4xl"
                                    >
                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-md glass-pill text-[#C9A84C] text-[11px] font-semibold tracking-widest uppercase mb-8">
                                            <Sparkles size={12} />
                                            Dersaadet Paleografi Sistemi
                                        </div>

                                        <h1 className="gc-display mb-4">
                                            Osmanlıca Belgelerin<br />
                                            <span className="text-[#C9A84C]">Dijital Çözümlemesi</span>
                                        </h1>

                                        {/* Ornament */}
                                        <div className="flex items-center gap-4 my-10">
                                            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
                                            <div className="w-2 h-2 rotate-45 border border-[#C9A84C]/60" />
                                            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent" />
                                        </div>

                                        <p className="gc-body-serif max-w-2xl text-center mb-12 text-lg md:text-xl italic leading-relaxed">
                                            Arşiv belgeleri üzerinde optik karakter tanıma ve dil modeli destekli çeviri
                                            işlemlerini akademik standartlarda gerçekleştiren bir araştırma aracıdır.
                                        </p>

                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                            <button
                                                onClick={() => setLoginModalOpen(true)}
                                                className="gc-btn-primary px-8 py-4 text-[14px] group"
                                            >
                                                Sisteme Giriş Yapın
                                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                            <button
                                                onClick={() => scrollToSection('about')}
                                                className="px-8 py-4 text-[14px] text-white/60 hover:text-white font-semibold transition-colors"
                                            >
                                                Daha Fazla Bilgi ↓
                                            </button>
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#FAFAF8] to-transparent z-10" />
                            </section>

                            {/* ABOUT */}
                            <section id="about" className="gc-section bg-[#FAFAF8] min-h-[70vh] flex items-center">
                                <div className="mx-auto w-full max-w-6xl px-6 flex flex-col items-center">
                                    <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
                                        <div className="gc-badge mb-8">Proje Hakkında</div>
                                        <h2 className="gc-h2 mb-10 text-balance">Arşiv Belgelerinin Dijitalleştirilmesi</h2>
                                        <p className="gc-body text-lg md:text-xl leading-relaxed mb-8 text-balance">
                                            Dersaadet, Osmanlıca ve eski Türkçe ile yazılmış arşiv belgelerinin modern Türkçeye
                                            aktarılması sürecini hızlandırmak amacıyla geliştirilmiş bir yazılım platformudur.
                                        </p>
                                        <p className="gc-body text-base md:text-lg leading-relaxed mb-8 text-balance">
                                            Sistem, optik karakter tanıma (OCR) teknolojisi ile belge görüntülerinden metin
                                            çıkarımı yapmakta, ardından doğal dil işleme modelleri aracılığıyla bu metinleri
                                            günümüz Türkçesine çevirmektedir.
                                        </p>
                                        <p className="gc-body text-base md:text-lg leading-relaxed text-balance">
                                            Beşeri bilimler alanındaki araştırma ihtiyaçları ile dijital teknolojilerin bir araya
                                            getirildiği bu proje, akademik çalışmalara katkı sağlamayı hedeflemektedir.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* FEATURES */}
                            <section id="features" className="gc-section bg-white min-h-[80vh] flex items-center">
                                <div className="mx-auto w-full max-w-6xl px-6 flex flex-col items-center">
                                    <div className="text-center mb-20 flex flex-col items-center">
                                        <div className="gc-badge mb-8">Teknik Özellikler</div>
                                        <h2 className="gc-h2 text-balance">Sistem Bileşenleri</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {[
                                            { icon: Cpu, title: 'Optik Karakter Tanıma', desc: 'Belge görüntüleri üzerinde yüksek doğruluk oranıyla metin çıkarımı gerçekleştirilmektedir.', color: 'soft-blue' },
                                            { icon: Globe, title: 'Dil Modeli Destekli Çeviri', desc: 'Osmanlıca terminolojiye uygun olarak eğitilmiş modeller aracılığıyla çeviri yapılmaktadır.', color: 'soft-purple' },
                                            { icon: Sparkles, title: 'Transkripsiyon', desc: 'Arap harfli metinlerin Latin harflerine aktarımı, imla kuralları gözetilerek gerçekleştirilmektedir.', color: 'soft-teal' },
                                            { icon: ShieldCheck, title: 'Veri Güvenliği', desc: 'Yüklenen belgeler, işlem tamamlandıktan sonra sunucudan kaldırılmakta; veriler korunmaktadır.', color: 'soft-amber' },
                                            { icon: Zap, title: 'Asenkron İşleme', desc: 'Çok sayfalı belgeler arka planda işlenmekte, kullanıcı sürecin ilerleyişini anlık olarak takip edebilmektedir.', color: 'soft-blue' },
                                            { icon: FileText, title: 'Rapor Çıktısı', desc: 'Analiz sonuçları, transkripsiyon ve çeviri metinleriyle birlikte PDF formatında sunulmaktadır.', color: 'soft-purple' },
                                        ].map((feature, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ y: 20, opacity: 0 }}
                                                whileInView={{ y: 0, opacity: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                                className="gc-card group flex flex-col h-full"
                                            >
                                                <div className={`gc-icon-bg bg-${feature.color}`}>
                                                    <feature.icon size={22} />
                                                </div>
                                                <h3 className="gc-h3 mb-3">{feature.title}</h3>
                                                <p className="gc-body text-[14px] flex-grow">{feature.desc}</p>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </section>

                            {/* TEAM */}
                            <section id="team" className="gc-section bg-[#FAFAF8] min-h-[70vh] flex items-center">
                                <div className="mx-auto w-full max-w-6xl px-6 flex flex-col items-center">
                                    <div className="text-center mb-20 flex flex-col items-center">
                                        <div className="gc-badge mb-8">Proje Ekibi</div>
                                        <h2 className="gc-h2 text-balance">Çalışma Grubu</h2>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
                                        <div className="gc-card text-center !py-10">
                                            <div className="w-16 h-16 bg-[#0A1628] text-[#C9A84C] rounded-xl flex items-center justify-center mx-auto mb-5">
                                                <BookOpen size={28} />
                                            </div>
                                            <h3 className="gc-h3 mb-1">Vedat Aksoy</h3>
                                            <p className="text-[13px] text-[#A8A29E] font-medium uppercase tracking-wider">Beşeri Bilimler</p>
                                        </div>
                                        <div className="gc-card text-center !py-10">
                                            <div className="w-16 h-16 bg-[#0A1628] text-[#C9A84C] rounded-xl flex items-center justify-center mx-auto mb-5">
                                                <Cpu size={28} />
                                            </div>
                                            <h3 className="gc-h3 mb-1">Umut Aksoy</h3>
                                            <p className="text-[13px] text-[#A8A29E] font-medium uppercase tracking-wider">Dijital Birimler</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* FOOTER */}
                            <footer className="bg-[#0A1628] py-12 mt-auto">
                                <div className="w-full px-12">
                                    <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white/10 flex items-center justify-center rounded-lg text-[#C9A84C]">
                                                <BookOpen size={16} />
                                            </div>
                                            <span className="text-white font-cinzel font-bold tracking-[0.18em] text-sm">
                                                DERSAADET
                                            </span>
                                        </div>
                                        <p className="text-white/30 text-xs font-medium text-center md:text-right max-w-md leading-relaxed">
                                            Osmanlıca belgelerin dijital ortama aktarılması ve modern Türkçeye çevrilmesi
                                            amacıyla geliştirilmiş akademik bir projedir.
                                        </p>
                                    </div>

                                    <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                                        <div className="text-white/20 text-[11px] font-medium tracking-wider">
                                            © 2025 Dersaadet Projesi
                                        </div>
                                        <div className="flex gap-6 text-white/20 text-[11px] font-medium tracking-wider">
                                            <span className="hover:text-white/50 cursor-pointer transition-colors">Gizlilik</span>
                                            <span className="hover:text-white/50 cursor-pointer transition-colors">Kullanım Koşulları</span>
                                        </div>
                                    </div>
                                </div>
                            </footer>

                        </motion.div>

                    ) : (

                        /* ══════════════ DASHBOARD ══════════════ */
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="pt-32 pb-24 bg-[#FAFAF8] min-h-screen flex flex-col justify-center items-center overflow-x-hidden"
                        >
                            <div className="mx-auto w-full max-w-4xl px-8">

                                {!jobId && !result ? (
                                    <div className="flex flex-col items-center">
                                        {/* Dashboard header */}
                                        <div className="mb-14 text-center flex flex-col items-center">
                                            <div className="gc-badge mb-4">Analiz Paneli</div>
                                            <h2 className="gc-h2 mb-4">Belge Yükleme</h2>
                                            <p className="gc-body max-w-xl text-[15px] mx-auto text-balance">
                                                Osmanlıca belgenizi yükleyerek analiz sürecini başlatabilirsiniz.
                                                Yükleme işleminden sonra yapay zeka destekli analiz süreci otomatik olarak başlayacaktır.
                                            </p>
                                        </div>

                                        {/* Two-column layout — balanced and centered */}
                                        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12 items-start w-full">

                                            {/* Main: upload box */}
                                            <div className="w-full">
                                                <UploadBox onUploadSuccess={(id) => setJobId(id)} />
                                            </div>

                                            {/* Sidebar */}
                                            <div className="flex flex-col gap-6 w-full">

                                                {/* Guide card */}
                                                <div className="sidebar-card sidebar-card--guide rounded-2xl border border-[#E8E2D9] bg-white p-7 shadow-sm">
                                                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-[#F0EDE8]">
                                                        <ShieldCheck size={18} className="text-[#6B1422]" />
                                                        <h4 className="text-[13px] font-bold text-[#1C1917] tracking-wider uppercase">
                                                            Yükleme Rehberi
                                                        </h4>
                                                    </div>
                                                    <ul className="flex flex-col gap-4">
                                                        {[
                                                            <>Dosya boyutu en fazla <strong>20 MB</strong> olmalıdır.</>,
                                                            <>Belgelerin <strong>yüksek çözünürlüklü</strong> olması tavsiye edilir.</>,
                                                            <>Desteklenen biçimler: <strong>PDF, JPG, PNG, WEBP</strong>.</>,
                                                            <>Her seferde <strong>tek dosya</strong> yüklenebilir.</>,
                                                        ].map((item, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-[13px] text-[#57534E] leading-snug">
                                                                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#C9A84C] shrink-0" />
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Info card */}
                                                <div className="sidebar-card sidebar-card--info rounded-2xl border border-transparent bg-[#0A1628] p-7 shadow-md">
                                                    <h4 className="text-[13px] font-bold text-[#C9A84C] tracking-widest uppercase mb-4">
                                                        Bilgilendirme
                                                    </h4>
                                                    <p className="text-[13.5px] text-white/70 leading-relaxed font-serif italic">
                                                        Analiz sonuçları; transkripsiyon, günümüz Türkçesi ve dil bilgisi notlarıyla birlikte
                                                        akademik formatta raporlanacaktır.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="max-w-2xl mx-auto w-full flex flex-col items-center">
                                        <div className="w-full space-y-12">
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => { setJobId(null); setResult(null); }}
                                                    className="flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-white border border-[#E8E2D9] text-[#57534E] text-[13px] font-bold shadow-sm hover:shadow-md hover:text-[#1C1917] hover:border-[#C9A84C] transition-all group"
                                                >
                                                    <ChevronRight size={18} className="rotate-180 group-hover:-translate-x-1.5 transition-transform" />
                                                    Yeni Belge Analizine Dön
                                                </button>
                                            </div>

                                            <div className="w-full flex justify-center">
                                                <div className="w-full">
                                                    {jobId && !result && (
                                                        <JobStatus jobId={jobId} onComplete={(data) => setResult(data)} />
                                                    )}
                                                    {result && (
                                                        <ResultViewer jobId={jobId!} data={result} />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <footer className="w-full px-12 py-10 mt-auto border-t border-[#E8E2D9] text-center bg-white/50">
                                <p className="text-[11px] text-[#A8A29E] leading-relaxed tracking-widest uppercase font-bold">
                                    © 2025 Dersaadet Projesi — Tüm Hakları Saklıdır
                                </p>
                            </footer>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default App;