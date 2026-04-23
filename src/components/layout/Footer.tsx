'use client';

import { MessageCircle, Zap, FolderGit2, Mail, Phone, MapPin, Github, Linkedin, Twitter, Facebook, ArrowRight, Terminal, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useContent } from '@/hooks/useContent';
import Image from 'next/image';
import { useBrandingContext } from '../providers/BrandingProvider';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const initialBranding = useBrandingContext();
    const { data: branding } = useContent("site_content", "settings", initialBranding);

    return (
        <>
            <footer className="bg-[#020617] relative z-10 overflow-hidden pt-20 border-t border-slate-800/50">
                {/* Premium Background Effects */}
                <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.1),rgba(255,255,255,0))] pointer-events-none"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    
                    {/* Top CTA Section */}
                    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl"></div>
                        
                        <div className="text-center md:text-left relative z-10 max-w-2xl">
                            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Have a project in mind?</h2>
                            <p className="text-slate-400 text-lg">Let&apos;s transform your idea into a highly scalable, premium digital experience. We are ready to build the next big thing.</p>
                        </div>
                        <div className="relative z-10 shrink-0">
                            <Link href="/contact" className="group flex items-center gap-3 bg-white text-slate-950 px-8 py-4 rounded-full font-bold text-lg hover:bg-blue-50 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] hover:scale-105">
                                Start a Project <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>
                    </div>

                    {/* Main Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 mb-16">
                        
                        {/* Column 1: Brand */}
                        <div className="space-y-6">
                            <Link href="/" className="flex items-center gap-2 cursor-pointer group w-fit">
                                {branding?.siteLogo ? (
                                    <div className="relative w-8 h-8 rounded-xl overflow-hidden group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all">
                                        <Image src={branding.siteLogo} alt="Logo" fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="bg-gradient-to-tr from-blue-500 to-cyan-400 p-1.5 rounded-xl group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all">
                                        <Terminal className="text-white w-5 h-5" />
                                    </div>
                                )}
                                <span className="font-bold text-xl tracking-wider text-white">
                                    {branding?.siteName ? (
                                        branding.siteName
                                    ) : (
                                        <>GAMAL<span className="text-blue-400">TECH</span></>
                                    )}
                                </span>
                            </Link>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                Full-Stack Developer & Tech Consultant specializing in modern Web Applications, E-commerce platforms, and intelligent AI/WhatsApp Automations.
                            </p>
                            <div className="flex items-center gap-4">
                                <a href="https://github.com/gamalselim" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-lg hover:-translate-y-1">
                                    <Github className="w-4 h-4" />
                                </a>
                                <a href="https://linkedin.com/in/gamalselim" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-lg hover:-translate-y-1">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                                <a href="https://facebook.com/gamalselim" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 hover:border-blue-500 transition-all shadow-lg hover:-translate-y-1">
                                    <Facebook className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Column 2: Services */}
                        <div className="space-y-6">
                            <h3 className="text-white font-bold text-lg tracking-wide">Premium Services</h3>
                            <ul className="space-y-3">
                                {['Custom Web Apps', 'Shopify & E-commerce', 'WhatsApp API Bots', 'AI Integrations', 'UI/UX Design'].map((item) => (
                                    <li key={item}>
                                        <Link href="/skills" className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 group text-sm">
                                            <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-colors" />
                                            {item}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 3: Quick Links */}
                        <div className="space-y-6">
                            <h3 className="text-white font-bold text-lg tracking-wide">Quick Links</h3>
                            <ul className="space-y-3">
                                {[
                                    { name: 'Home', path: '/' },
                                    { name: 'Portfolio', path: '/projects' },
                                    { name: 'Articles & Blog', path: '/articles' },
                                    { name: 'Free Tools', path: '/tools' },
                                    { name: 'Contact Me', path: '/contact' }
                                ].map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.path} className="text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2 group text-sm">
                                            <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-colors" />
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Column 4: Contact */}
                        <div className="space-y-6">
                            <h3 className="text-white font-bold text-lg tracking-wide">Get in Touch</h3>
                            <ul className="space-y-4">
                                <li>
                                    <a href="mailto:gamal.dev1@gmail.com" className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group">
                                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-colors">
                                            <Mail className="w-4 h-4 text-blue-400" />
                                        </div>
                                        <span className="text-sm mt-1">gamal.dev1@gmail.com</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+201024531452" className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group">
                                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 group-hover:border-green-500/50 group-hover:bg-green-500/10 transition-colors">
                                            <Phone className="w-4 h-4 text-green-400" />
                                        </div>
                                        <span className="text-sm mt-1" dir="ltr">+20 102 453 1452</span>
                                    </a>
                                </li>
                                <li>
                                    <div className="flex items-start gap-3 text-slate-400 group">
                                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                                            <MapPin className="w-4 h-4 text-red-400" />
                                        </div>
                                        <span className="text-sm mt-1">Cairo, Egypt<br/>Available Worldwide</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-8"></div>

                    {/* Bottom Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-8 text-center md:text-left">
                        <p className="text-slate-500 text-sm">
                            © {currentYear} <span className="text-white font-bold tracking-wider">{branding?.siteName || "GAMALTECH"}</span>. All rights reserved.
                        </p>
                        <div className="flex items-center gap-6 text-sm text-slate-500 font-mono">
                            <span>Built with Next.js & TailwindCSS</span>
                            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                            <span className="hidden sm:inline-block">Powered by Gemini AI</span>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Floating WhatsApp - Preserved perfectly */}
            <a href="https://wa.me/201024531452" target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_0_20px_rgba(37,211,102,0.4)] hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300 border-2 border-slate-900 group flex items-center justify-center">
                <MessageCircle className="w-7 h-7 md:w-8 md:h-8" />
                <span className="absolute right-full mr-4 bg-slate-800 text-white px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none border border-slate-700 shadow-xl hidden md:block z-50 translate-x-4 group-hover:-translate-x-2">
                    Let&apos;s Chat! 🚀
                </span>
            </a>
        </>
    );
}
