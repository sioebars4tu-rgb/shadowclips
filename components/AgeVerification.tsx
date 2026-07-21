"use client";
import { useState, useEffect } from 'react';
import { Play, ShieldAlert, CheckCircle2, X } from 'lucide-react';

export default function AgeVerification() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (!localStorage.getItem('ageVerified')) {
            setIsVisible(true);
            document.body.style.overflow = 'hidden';
        }
    }, []);

    const handleYes = () => {
        localStorage.setItem('ageVerified', 'true');
        setIsVisible(false);
        document.body.style.overflow = 'auto';
    };

    const handleNo = () => {
        window.location.href = 'https://www.google.com';
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-[#0a0a0c]/95 backdrop-blur-2xl flex items-center justify-center transition-all duration-500">
            <div className="relative bg-[#111114] bg-opacity-95 backdrop-blur-xl p-8 md:p-12 rounded-[23px] max-w-md w-full text-center border border-white/5 mx-4">
                <div className="flex items-center justify-center gap-3 mb-8">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30">
                        <Play className="text-white fill-white w-6 h-6" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-cyan-500 uppercase">
                        SHADOW<span className="text-white">CLIPS</span>
                    </span>
                </div>
                
                <div className="inline-flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-1.5 rounded-full mb-6">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">Akses Terbatas</span>
                </div>
                
                <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight mb-4">Verifikasi <span className="text-cyan-500">Umur</span></h2>
                <p className="text-slate-400 text-sm mb-8 leading-relaxed font-medium">
                    Situs ini mungkin berisi konten dewasa. Anda harus berusia minimal <span className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded font-black">18 TAHUN</span> untuk melanjutkan.
                </p>
                
                <div className="flex flex-col gap-3">
                    <button onClick={handleYes} className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black uppercase tracking-widest py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-5 h-5" /> Ya, Saya 18+
                    </button>
                    <button onClick={handleNo} className="w-full bg-[#0a0a0c] hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 text-slate-500 hover:text-red-500 font-bold uppercase tracking-widest py-4 rounded-xl transition-all flex items-center justify-center gap-2">
                        <X className="w-4 h-4" /> Tidak, Keluar
                    </button>
                </div>
            </div>
        </div>
    );
}