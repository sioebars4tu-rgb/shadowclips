import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Play, Eye, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import Script from 'next/script';

export const revalidate = 60; // ISR: Cache diperbarui setiap 60 detik

// Definisikan tipe untuk searchParams (Next.js 15+)
type Props = {
    searchParams: Promise<{ page?: string }>;
};

export default async function Home({ searchParams }: Props) {
    // --- LOGIKA PAGINATION ---
    const resolvedSearchParams = await searchParams;
    const currentPage = parseInt(resolvedSearchParams.page || '1', 10);
    const ITEMS_PER_PAGE = 18; // Batas 18 postingan per halaman
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    // Ambil data Hero (Hanya jika pengguna berada di halaman 1)
    let heroVideo = null;
    if (currentPage === 1) {
        const { data } = await supabase
            .from('videos')
            .select('*')
            .order('views', { ascending: false })
            .limit(1)
            .single();
        heroVideo = data;
    }

    // Ambil daftar video terbaru beserta total jumlah data (count: 'exact')
    const { data: videos, count } = await supabase
        .from('videos')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

    // Hitung total halaman
    const totalPages = count ? Math.ceil(count / ITEMS_PER_PAGE) : 0;
    const heroImg = heroVideo?.img ? heroVideo.img.split(',')[0].trim() : '';

    return (
        <main className="pt-24 pb-20 min-h-screen">
            {/* Script Iklan */}
            <Script 
                id="ad-script" 
                strategy="afterInteractive" 
                src="//corny-wear.com/bLXqVused.G/lX0dYQW_cl/Xepms9YukZ/Uyl/kBPPTlYV4lM/TGMW1/O/TyMrt/N-jEgxxEMBzvUK5BNJwN" 
            />

            {/* --- HERO SECTION (Hanya Muncul di Page 1) --- */}
            {heroVideo && currentPage === 1 && (
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="relative h-[300px] md:h-[450px] rounded-3xl overflow-hidden group border border-white/5 shadow-2xl shadow-cyan-900/20">
                        <img src={heroImg} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Hero" />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent"></div>
                        <div className="absolute bottom-10 left-8 md:left-12 max-w-3xl z-10">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-cyan-500 text-[10px] font-black px-2.5 py-1 rounded inline-block uppercase tracking-widest text-black shadow-lg shadow-cyan-500/40">
                                    #1 Paling Populer
                                </span>
                                <span className="bg-black/50 border border-white/10 text-[10px] font-bold px-2.5 py-1 rounded inline-block uppercase tracking-widest text-white backdrop-blur-md flex items-center gap-1">
                                    <Eye className="w-3 h-3" /> {(heroVideo.views || 0).toLocaleString()} Views
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-6xl font-black leading-tight uppercase tracking-tighter text-glow mb-6 line-clamp-2 text-white">
                                {heroVideo.title}
                            </h1>
                            <Link href={`/streaming/${heroVideo.slug || heroVideo.id}`} className="inline-flex bg-white text-black hover:bg-cyan-500 hover:text-black transition-all px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs items-center gap-2 shadow-xl">
                                <Play className="w-4 h-4 fill-current" /> Tonton Sekarang
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* --- DAFTAR GRID VIDEO --- */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-10 pb-4 border-b border-white/5">
                    <h2 className="text-xl font-black uppercase tracking-[0.3em] flex items-center gap-3 text-white">
                        <Sparkles className="w-5 h-5 text-cyan-500" /> Konten Terbaru
                    </h2>
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
                                            
                                            {/* Label Kategori */}
                                            <div className="absolute top-2 left-2 bg-cyan-500 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest shadow-xl z-20">
                                                {video.category || 'Video'}
                                            </div>

                                            {/* Badge Views (Sama dengan Halaman Kategori) */}
                                            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-1 z-20">
                                                <Eye className="w-3 h-3 text-cyan-400" />
                                                {(video.views || 0).toLocaleString()}
                                            </div>

                                            {/* Ikon Play Animasi */}
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

                        {/* --- KONTROL PAGINATION --- */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3">
                                {/* Tombol Mundur (Prev) */}
                                {currentPage > 1 ? (
                                    <Link href={`/?page=${currentPage - 1}`} scroll={true} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500 hover:text-black transition-all">
                                        <ChevronLeft className="w-5 h-5" />
                                    </Link>
                                ) : (
                                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 opacity-30 cursor-not-allowed">
                                        <ChevronLeft className="w-5 h-5" />
                                    </div>
                                )}

                                {/* Indikator Halaman */}
                                <div className="px-5 h-10 flex items-center justify-center rounded-xl bg-cyan-500 text-black font-black text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                                    {currentPage} / {totalPages}
                                </div>

                                {/* Tombol Maju (Next) */}
                                {currentPage < totalPages ? (
                                    <Link href={`/?page=${currentPage + 1}`} scroll={true} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-cyan-500 hover:text-black transition-all">
                                        <ChevronRight className="w-5 h-5" />
                                    </Link>
                                ) : (
                                    <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 opacity-30 cursor-not-allowed">
                                        <ChevronRight className="w-5 h-5" />
                                    </div>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-500 font-bold uppercase tracking-widest text-xs">
                        Belum ada konten untuk ditampilkan.
                    </div>
                )}
            </section>
        </main>
    );
}