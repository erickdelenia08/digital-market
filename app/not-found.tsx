import Link from 'next/link';
import { Terminal, Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="py-20 px-4 flex flex-col items-center justify-center font-sans selection:bg-indigo-600 selection:text-white">

            {/* Tactile Card Container */}
            <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 p-8 shadow-md text-center space-y-6">

                {/* Badge Tech */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold shadow-inner">
                    <Terminal className="w-3.5 h-3.5 text-indigo-600" />
                    <span>404 : NOT_FOUND</span>
                </div>

                {/* 404 Text & Description */}
                <div className="space-y-2">
                    <h2 className="text-5xl font-black text-slate-900 tracking-tight">
                        404
                    </h2>
                    <p className="text-base font-bold text-slate-800">
                        Halaman tidak ditemukan.
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                        Maaf, halaman yang Anda cari tidak ada, telah dibatalkan, atau telah dipindahkan.
                    </p>
                </div>

                {/* Button Action */}
                <div className="pt-2 border-t border-slate-100">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-all shadow-md hover:-translate-y-0.5"
                    >
                        <Home className="w-4 h-4" />
                        <span>Kembali ke Beranda</span>
                    </Link>
                </div>

            </div>

        </div>
    );
}