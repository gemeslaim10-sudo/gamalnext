import { MessageCircle, Zap, Briefcase, FolderGit2 } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <>
            <footer className="bg-gradient-to-b from-slate-950 to-[#020617] border-t border-slate-800/50 relative z-10 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800/20 via-transparent to-transparent"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-20 relative z-10">
                    {/* Main Navigation Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-16">
                        {/* Skills Section */}
                        <Link
                            href="/skills"
                            className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(59,130,246,0.3)]"
                        >
                            <div className="bg-blue-500/10 p-4 rounded-xl text-blue-400 group-hover:text-blue-300 group-hover:bg-blue-500/20 transition-colors w-fit mb-4">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-white text-2xl mb-3 group-hover:text-blue-400 transition-colors">مجالات التخصص</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">التطوير الرقمي و SEO</p>
                        </Link>

                        {/* Experience Section */}
                        <Link
                            href="/experience"
                            className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)]"
                        >
                            <div className="bg-purple-500/10 p-4 rounded-xl text-purple-400 group-hover:text-purple-300 group-hover:bg-purple-500/20 transition-colors w-fit mb-4">
                                <Briefcase className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-white text-2xl mb-3 group-hover:text-purple-400 transition-colors">السجل المهني</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">مسيرتي المهنية والشركات</p>
                        </Link>

                        {/* Projects Section */}
                        <Link
                            href="/projects"
                            className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-8 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(34,197,94,0.3)]"
                        >
                            <div className="bg-green-500/10 p-4 rounded-xl text-green-400 group-hover:text-green-300 group-hover:bg-green-500/20 transition-colors w-fit mb-4">
                                <FolderGit2 className="w-8 h-8" />
                            </div>
                            <h3 className="font-bold text-white text-2xl mb-3 group-hover:text-green-400 transition-colors">سجل المشاريع</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">نخبة المشاريع المنجزة</p>
                        </Link>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent mb-8"></div>

                    {/* Bottom Section */}
                    <div className="text-center">
                        <p className="font-medium text-slate-400 mb-2">
                            © 2024 <span className="text-white font-bold">جمال عبد العاطي</span>. جميع الحقوق محفوظة.
                        </p>
                        <p className="text-slate-600 font-mono text-xs tracking-wide">Built with Next.js & Gemini AI</p>
                    </div>
                </div>
            </footer>

            {/* Floating WhatsApp */}
            <a href="https://wa.me/201024531452" target="_blank" className="fixed bottom-6 left-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 border-2 border-slate-900 group">
                <MessageCircle className="w-8 h-8" />
                <span className="absolute left-full ml-4 bg-slate-800 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none border border-slate-700 shadow-xl hidden md:block z-50 translate-x-2">
                    محادثة فورية
                </span>
            </a>
        </>
    );
}
