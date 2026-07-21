/* eslint-disable @next/next/no-img-element */
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { TrendingUp, Play } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Konten Populer - ShadowClips.asia',
};

export const revalidate = 60; // ISR: Cache diperbarui tiap 60 detik

export default async function PopulerPage() {
    const { data: videos } = await supabase
        .from('videos')
        .select('*')
        .order('views', { ascending: false })
        .limit(20);

    return (
        <main className="pt-32 pb-20 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight uppercase italic text-glow">
                        Konten Paling <span className="text-cyan-500">Populer</span>
                    </h1>
                    <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto uppercase tracking-widest font-bold opacity-60">
                        Koleksi konten premium pilihan yang paling banyak ditonton.
                    </p>
                </div>

                {videos && videos.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
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
                                        <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest border border-white/10">
                                            {(video.views || 0).toLocaleString()} Views
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
                                        <span className="text-cyan-600/80">Ranked</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-800"></span>
                                        <span>{year}</span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-600 text-center">
                        <TrendingUp className="w-16 h-16 mb-4 opacity-20 mx-auto" />
                        <p className="font-bold uppercase tracking-widest text-[10px]">Belum ada data statistik populer saat ini.</p>
                    </div>
                )}
            </div>
        </main>
    );
}