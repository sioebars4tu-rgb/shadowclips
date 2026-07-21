import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { Download, Eye, Sparkles, Files, Server, HardDrive, DownloadCloud } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

type Props = {
    params: Promise<{ slug: string }>
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const identifier = slug;
    
    let { data: video } = await supabase.from('videos').select('*').eq('slug', identifier).single();
    if (!video) {
        const { data: videoById } = await supabase.from('videos').select('*').eq('id', identifier).single();
        video = videoById;
    }

    if (!video) return { title: 'Konten Tidak Ditemukan - ShadowClips' };
    
    return {
        title: `${video.title} - ShadowClips`,
        description: video.description || `Tonton video ${video.title} di ShadowClips`,
        openGraph: {
            images: [video.img ? video.img.split(',')[0].trim() : ''],
        }
    };
}

export default async function StreamingPage({ params }: Props) {
    const { slug } = await params;
    const identifier = slug;

    let { data: video, error } = await supabase.from('videos').select('*').eq('slug', identifier).single();
    
    if (error || !video) {
        const { data: videoById, error: errorId } = await supabase.from('videos').select('*').eq('id', identifier).single();
        if (errorId || !videoById) return notFound();
        video = videoById;
    }

    try {
        await supabase.rpc('increment_views', { row_id: video.id });
    } catch (e) {}

    const isGalleryLabel = video.labels && String(video.labels).toLowerCase().includes('gallery');
    const allImages = video.img ? video.img.split(',').map((url: string) => url.trim()).filter(Boolean) : [];
    
    // Logika Pemutar Video
    const videoUrl = video.trailer_url || '';
    const isEmbed = videoUrl.includes('dood') || videoUrl.includes('embed') || videoUrl.includes('youtube') || videoUrl.includes('stream') || !videoUrl.match(/\.(mp4|webm|ogg)$/i);

    // Logika Download Link
    const embedLinks = video.embed_url ? video.embed_url.split(/[\n,]+/).map((l: string) => l.trim()).filter(Boolean) : [];

    // --- LOGIKA VIDEO TERKAIT (DIPERBAIKI) ---
    // Ambil semua kategori dari video (misal: "Viral, Indo" menjadi array ["Viral", "Indo"])
    const categories = video.category 
        ? video.category.split(',').map((c: string) => c.trim()).filter(Boolean) 
        : [];

    // Siapkan query dasar
    let relatedQuery = supabase
        .from('videos')
        .select('*')
        .neq('id', video.id) // Jangan tampilkan video yang sedang diputar
        .order('created_at', { ascending: false })
        .limit(8); // Tampilkan hingga 12 video agar terlihat banyak

    // Jika ada kategori, cari video yang memiliki SETIDAKNYA SALAH SATU kategori tersebut
    if (categories.length > 0) {
        // Membuat string query OR: category.ilike.%Viral%,category.ilike.%Indo%
        const orConditions = categories.map((cat: string) => `category.ilike.%${cat}%`).join(',');
        relatedQuery = relatedQuery.or(orConditions);
    }

    const { data: relatedVideos } = await relatedQuery;

    return (
        <main className="pt-24 pb-24 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Area Pemutar Video / Galeri */}
                <div className="mb-8 rounded-[23px] overflow-hidden shadow-2xl shadow-cyan-900/10 border border-cyan-500/20 bg-black">
                    {isGalleryLabel && allImages.length > 1 ? (
                        <div className="w-full p-6 md:p-8 bg-[#0a0a0c] min-h-[400px]">
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                                {allImages.slice(1).map((imgUrl: string, idx: number) => (
                                    <div key={idx} className="relative aspect-[3/4] rounded-xl overflow-hidden border border-white/5 shadow-2xl bg-[#111114]">
                                        <img src={imgUrl} className="w-full h-full object-cover" alt={`Gallery ${idx}`} loading="lazy" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="relative w-full pb-[56.25%] bg-black">
                            {isEmbed ? (
                                <iframe 
                                    src={videoUrl} 
                                    className="absolute inset-0 w-full h-full bg-black" 
                                    frameBorder="0" 
                                    allowFullScreen 
                                />
                            ) : (
                                <video 
                                    src={videoUrl} 
                                    className="absolute inset-0 w-full h-full bg-black object-contain mx-auto" 
                                    controls 
                                    playsInline 
                                />
                            )}
                        </div>
                    )}
                </div>

                {/* Metadata & Tombol Download */}
                <div className="bg-gradient-to-br from-cyan-500/10 to-[#0a0a0c] p-8 md:p-12 rounded-[23px] border border-cyan-500/20 mb-12">
                    <div className="flex flex-col md:flex-row justify-between gap-8">
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3 mb-4 text-[10px] font-black uppercase tracking-widest">
                                <span className="bg-cyan-500 text-black px-2.5 py-1 rounded shadow-lg shadow-cyan-500/20">
                                    {video.category || 'Video'}
                                </span>
                                
                                {video.labels && (
                                    <span className="bg-white/10 text-white px-2.5 py-1 rounded border border-white/10">
                                        {video.labels}
                                    </span>
                                )}
                                
                                {video.type && (
                                    <div className="flex items-center gap-1.5 bg-white/10 text-white px-2.5 py-1 rounded border border-white/10">
                                        <Files className="w-3 h-3 text-cyan-500" /> <span>{video.type}</span>
                                    </div>
                                )}

                                {video.source && (
                                    <div className="flex items-center gap-1.5 bg-white/10 text-pink-400 px-2.5 py-1 rounded border border-white/10">
                                        <Server className="w-3 h-3" /> <span>{video.source}</span>
                                    </div>
                                )}

                                {video.size && (
                                    <div className="flex items-center gap-1.5 bg-white/10 text-cyan-400 px-2.5 py-1 rounded border border-white/10">
                                        <HardDrive className="w-3 h-3" /> <span>{video.size}</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-1.5 bg-white/5 text-slate-300 px-2.5 py-1 rounded border border-white/5">
                                    <Eye className="w-3 h-3 text-slate-500" /> {(video.views || 0).toLocaleString()} Views
                                </div>
                            </div>
                            
                            <h1 className="text-3xl md:text-5xl font-black text-white leading-tight uppercase tracking-tight mb-2 break-words">
                                {video.title}
                            </h1>
                            <p className="text-slate-400 text-sm opacity-80 line-clamp-2 mt-4">{video.description}</p>
                        </div>
                        
                        <div className="shrink-0 flex flex-col gap-3 min-w-[200px]">
                            {embedLinks.length > 0 ? (
                                embedLinks.map((link: string, i: number) => (
                                    <a key={i} href={link} target="_blank" className="flex items-center justify-center gap-3 bg-cyan-500 hover:bg-cyan-400 text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all w-full">
                                        <Download className="w-4 h-4" /> {embedLinks.length > 1 ? `Server ${i + 1}` : 'Download'}
                                    </a>
                                ))
                            ) : (
                                <button className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-slate-400 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl cursor-not-allowed w-full hover:bg-white/10 hover:text-white transition-all group">
                                    <DownloadCloud className="w-4 h-4 group-hover:text-cyan-500 transition-colors" /> Download
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- BAGIAN KONTEN TERKAIT --- */}
                <section>
                    <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
                        <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3 text-white">
                            <Sparkles className="w-5 h-5 text-cyan-500" /> Konten Terkait
                        </h2>
                    </div>
                    {relatedVideos && relatedVideos.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                            {relatedVideos.map((rel) => {
                                const thumbImage = rel.img ? rel.img.split(',')[0].trim() : '';
                                return (
                                    <Link href={`/streaming/${rel.slug || rel.id}`} key={rel.id} className="group cursor-pointer">
                                        <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 border border-white/5 bg-[#111114]">
                                            <img src={thumbImage} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all group-hover:scale-105" alt={rel.title} />
                                            <div className="absolute top-2 left-2 bg-cyan-500 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest">{rel.category || 'Video'}</div>
                                        </div>
                                        <h4 className="font-bold text-xs text-white line-clamp-1">{rel.title}</h4>
                                        <div className="mt-1 text-[9px] text-slate-500 font-bold uppercase">{(rel.views || 0).toLocaleString()} Views</div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-sm">Tidak ada video terkait ditemukan.</p>
                    )}
                </section>
                
            </div>
        </main>
    );
}