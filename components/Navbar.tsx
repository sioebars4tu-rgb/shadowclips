"use client";
import { useState } from 'react';
import Link from 'next/link';
import { Play, Search, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            router.push('/');
        }
    };

    return (
        <>
            <nav className="fixed top-0 w-full z-50 bg-[#0a0a0c]/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                                <Play className="text-white fill-white w-5 h-5" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-cyan-500 uppercase">
                                SHADOW<span className="text-white">CLIPS</span>
                            </span>
                        </Link>

                        {/* DESKTOP MENU */}
                        <div className="hidden md:flex items-center gap-8">
                            <div className="relative group">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors w-4 h-4" />
                                <input 
                                    type="text" 
                                    placeholder="Cari konten..." 
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleSearch}
                                    className="bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-white/10 transition-all text-sm text-white" 
                                />
                            </div>
                            <ul className="flex items-center gap-6 font-medium text-sm text-slate-300">
                                <li><Link href="/" className="hover:text-cyan-500 transition-colors">Beranda</Link></li>
                                <li><Link href="/populer" className="hover:text-cyan-500 transition-colors">Populer</Link></li>
                                {/* LINK DIUBAH KE /categories */}
                                <li><Link href="/categories" className="hover:text-cyan-500 transition-colors">Kategori</Link></li>
                            </ul>
                        </div>

                        {/* MOBILE MENU TOGGLE */}
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-300">
                                <Menu />
                            </button>
                        </div>
                    </div>
                </div>
                
                {/* MOBILE MENU */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-[#0a0a0c] border-b border-white/5 p-4 animate-in slide-in-from-top">
                        <ul className="space-y-4 font-medium text-slate-300 text-sm">
                            <li><Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-cyan-500">Beranda</Link></li>
                            <li><Link href="/populer" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-cyan-500">Populer</Link></li>
                            {/* LINK DIUBAH KE /categories */}
                            <li><Link href="/categories" onClick={() => setIsMobileMenuOpen(false)} className="block hover:text-cyan-500">Kategori</Link></li>
                        </ul>
                    </div>
                )}
            </nav>
        </>
    );
}