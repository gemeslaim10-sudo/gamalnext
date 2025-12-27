import { MessageCircle } from 'lucide-react';

export default function Footer() {
    return (
        <>
            <footer className="bg-[#020617] border-t border-slate-900 py-10 text-center text-slate-500 text-sm relative z-10">
                <p className="font-medium">© 2024 <span className="text-white font-bold">جمال عبد العاطي</span>. جميع الحقوق محفوظة.</p>
                <p className="mt-2 text-slate-600 font-mono text-xs tracking-wide">Built with Next.js & Gemini AI</p>
            </footer>

            {/* Floating WhatsApp */}
            <a href="https://wa.me/201024531452" target="_blank" className="fixed bottom-6 left-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 border-2 border-slate-900 group">
                <MessageCircle className="w-8 h-8" />
                <span className="absolute left-full ml-4 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-slate-700 shadow-xl hidden md:block z-50 translate-x-2">
                    تواصل معي مباشرة
                </span>
            </a>
        </>
    );
}
