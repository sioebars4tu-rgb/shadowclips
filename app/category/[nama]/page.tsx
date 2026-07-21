/* eslint-disable @next/next/no-img-element */
export const runtime = 'edge';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Play, Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';

// PERBAIKAN: Type Props diperbarui agar murni Promise sesuai aturan strict Next.js terbaru
type Props = {
    params: Promise<{ nama: string }>;
    searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
    const params = await props.params;
    const decodedKategori = decodeURIComponent(params.nama);
    return {
        title: `Kategori: ${decodedKategori} - ShadowClips`,
    };
}

export default async function CategoryResultPage(props: Props) {
    const params = await props.params;
    // PERBAIKAN: Langsung await searchParams tanpa ternary operator
    const searchParams = await props.searchParams;
    
    const nama = params.nama;
    const decodedKategori = decodeURIComponent(nama);

    // PERBAIKAN: Menggunakan optional chaining (?.) untuk menghindari error saat build statis
    const pageQuery = searchParams?.page;
    const currentPage = Math.max(1, parseInt(pageQuery || '1', 10));
    const ITEMS_PER_PAGE = 16; 
    
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data: videos, count } = await supabase
        .from('videos')
        .select('*', { count: 'exact' })
        .ilike('category', `%${decodedKategori}%`)
        .order('created_at', { ascending: false })
        .range(from, to);

    const totalCount = count || 0;
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;
        let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
        
        const end = Math.min(totalPages, start + maxVisible - 1);

        if (end - start + 1 < maxVisible) {
            start = Math.max(1, end - maxVisible + 1);
        }

        for (let i = start; i <= end; i++) {
            if (i > 0) pages.push(i);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <main className="pt-32 pb-20 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 border-b border-white/5 pb-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <p className="text-cyan-500 text-xs font-black uppercase tracking-[0.3em] mb-2">Menampilkan Hasil Untuk:</p>
                        <h1 className="text-3xl md:text-5xl font-black text-white uppercase italic text-glow">
                            {decodedKategori}
                        </h1>
                    </div>
                    <Link href="/categories" className="px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold uppercase tracking-widest text-white transition-all border border-white/10">
                        Kembali ke Kategori
                    </Link>
                </div>

                {videos && videos.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
                            {videos.map((video) => {
                                const year = new Date(video.created_at).getFullYear();
                                const thumbImg = video.img ? video.img.split(',')[0].trim() : '';

                                return (
                                    <Link href={`/streaming/${video.slug || video.id}`} key={video.id} className="group cursor-pointer animate-in fade-in duration-500">
                                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-white/5 shadow-2xl bg-[#111114]">
                                            <img src={thumbImg} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" loading="lazy" alt={video.title} />
                                            
                                            <div className="absolute top-2 left-2 bg-cyan-500 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-xl z-20">
                                                {video.category}
                                            </div>

                                            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-1 z-20">
                                                <Eye className="w-3 h-3 text-cyan-400" />
                                                {(video.views || 0).toLocaleString()}
                                            </div>

                                            <div className="absolute inset-0 bg-cyan-950/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-black scale-75 group-hover:scale-100 transition-transform shadow-[0_0_30px_rgba(6,182,212,0.5)]">
                                                    <Play className="w-5 h-5 fill-current" />
                                                </div>
                                            </div>
                                        </div>
                                        <h3 className="font-bold text-xs md:text-sm mb-1 group-hover:text-cyan-400 transition-colors line-clamp-1 tracking-tight uppercase text-white">
                                            {video.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-[9px] text-slate-500 font-black uppercase tracking-widest">
                                            <span>{year}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                                            <span>{(video.views || 0).toLocaleString()} Views</span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-xs text-slate-400 font-medium">
                                    Menampilkan <span className="text-white font-bold">{from + 1}</span> - <span className="text-white font-bold">{Math.min(to + 1, totalCount)}</span> dari <span className="text-cyan-400 font-bold">{totalCount}</span> konten
                                </div>

                                <div className="flex items-center gap-2">
                                    {currentPage > 1 ? (
                                        <Link
                                            href={`/category/${nama}?page=${currentPage - 1}`}
                                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-white/10 bg-white/5 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 text-slate-300 shadow-lg"
                                        >
                                            <ChevronLeft className="w-4 h-4" /> Prev
                                        </Link>
                                    ) : (
                                        <button
                                            disabled
                                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed opacity-40"
                                        >
                                            <ChevronLeft className="w-4 h-4" /> Prev
                                        </button>
                                    )}

                                    <div className="flex items-center gap-1.5 mx-1">
                                        {pageNumbers.map((pageNum) => {
                                            const isActive = pageNum === currentPage;
                                            return isActive ? (
                                                <span
                                                    key={pageNum}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs transition-all border bg-cyan-500 text-black border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                                                >
                                                    {pageNum}
                                                </span>
                                            ) : (
                                                <Link
                                                    key={pageNum}
                                                    href={`/category/${nama}?page=${pageNum}`}
                                                    className="w-10 h-10 flex items-center justify-center rounded-xl font-black text-xs transition-all border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:border-cyan-500/50 hover:text-cyan-400"
                                                >
                                                    {pageNum}
                                                </Link>
                                            );
                                        })}
                                    </div>

                                    {currentPage < totalPages ? (
                                        <Link
                                            href={`/category/${nama}?page=${currentPage + 1}`}
                                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all border border-white/10 bg-white/5 hover:bg-cyan-500 hover:text-black hover:border-cyan-500 text-slate-300 shadow-lg"
                                        >
                                            Next <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    ) : (
                                        <button
                                            disabled
                                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed opacity-40"
                                        >
                                            Next <ChevronRight className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-xs">
                        Tidak ada konten di kategori ini pada halaman {currentPage}.
                    </div>
                )}
            </div>
        </main>
    );
}