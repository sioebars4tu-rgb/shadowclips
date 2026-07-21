"use client";
import { useState, useEffect } from 'react';
import { Play, ShieldAlert, CheckCircle2, X } from 'lucide-react';

export default function AgeVerification() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const isVerified = localStorage.getItem('ageVerified');
        if (!isVerified) {
            // eslint-disable-next-line
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-sm animate-in fade-in duration-300">
            {/* Modal Container */}
            <div className="relative w-full max-w-md p-8 mx-4 overflow-hidden text-center bg-[#0f0f13] border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300">
                
                {/* Background Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-32 bg-cyan-500/10 blur-[100px] pointer-events-none"></div>

                {/* Brand / Logo */}
                <div className="flex items-center justify-center gap-3 mb-6">
                    <div className="flex items-center justify-center w-10 h-10 shadow-lg bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-xl shadow-cyan-500/20">
                        <Play className="w-5 h-5 text-white fill-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter uppercase text-cyan-500">
                        SHADOW<span className="text-white">CLIPS</span>
                    </span>
                </div>
                
                {/* Warning Badge */}
                <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 mb-6 border rounded-full bg-red-500/10 border-red-500/20">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    <span className="text-xs font-bold tracking-widest text-red-500 uppercase">Akses Dibatasi</span>
                </div>
                
                {/* Text Content */}
                <h2 className="mb-3 text-2xl font-bold tracking-tight text-white">
                    Verifikasi Umur
                </h2>
                <p className="mb-8 text-sm leading-relaxed text-gray-400">
                    Situs ini mungkin berisi konten dewasa. Anda harus berusia minimal{' '}
                    <span className="px-2 py-0.5 font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 rounded">
                        18 TAHUN
                    </span>{' '}
                    untuk dapat melanjutkan.
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button 
                        onClick={handleYes} 
                        className="flex items-center justify-center w-full gap-2 py-3.5 text-sm font-bold tracking-wide text-black uppercase transition-all bg-cyan-500 rounded-xl hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    >
                        <CheckCircle2 className="w-5 h-5" /> 
                        Ya, Saya 18+
                    </button>
                    <button 
                        onClick={handleNo} 
                        className="flex items-center justify-center w-full gap-2 py-3.5 text-sm font-bold tracking-wide text-gray-500 uppercase transition-all bg-transparent border border-white/10 rounded-xl hover:bg-white/5 hover:text-white"
                    >
                        <X className="w-4 h-4" /> 
                        Tidak, Keluar
                    </button>
                </div>
            </div>
        </div>
    );
}