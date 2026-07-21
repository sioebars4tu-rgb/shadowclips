import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { FolderOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Daftar Kategori - ShadowClips',
};

export const revalidate = 60; // Refresh data setiap 60 detik

export default async function CategoriesPage() {
    // Tarik sebagian besar data untuk mengekstrak kategori uniknya
    const { data: videos } = await supabase
        .from('videos')
        .select('category')
        .order('created_at', { ascending: false })
        .limit(1000);

    // Filter duplikat menggunakan Set
    const uniqueCategories = Array.from(
        new Set(videos?.map(v => v.category).filter(Boolean))
    ).sort();

    return (
        <main className="pt-32 pb-20 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight uppercase italic text-glow">
                        Eksplorasi <span className="text-cyan-500">Kategori</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto uppercase tracking-widest font-bold opacity-60">
                        Jelajahi koleksi premium berdasarkan genre favorit Anda.
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {uniqueCategories.map((cat, index) => (
                        // LINK MENGARAH KE FOLDER /category/[nama]
                        <Link href={`/category/${encodeURIComponent(cat)}`} key={index}>
                            <div className="bg-[#111114] border border-white/5 hover:border-cyan-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all group hover:bg-cyan-500/5 cursor-pointer text-center">
                                <div className="w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FolderOpen className="w-6 h-6 text-cyan-500" />
                                </div>
                                <span className="text-sm font-black text-white uppercase tracking-widest">{cat}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
}