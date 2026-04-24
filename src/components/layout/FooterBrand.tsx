import Link from 'next/link';
import Image from 'next/image';
import { Terminal, Github, Linkedin, Facebook } from 'lucide-react';
import type { BrandingSettings } from '@/types';

interface FooterBrandProps {
    branding: BrandingSettings | null;
}

export function FooterBrand({ branding }: FooterBrandProps) {
    return (
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
    );
}
