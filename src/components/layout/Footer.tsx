'use client';

import { useContent } from '@/hooks/useContent';
import { useBrandingContext } from '../providers/BrandingProvider';
import { FooterCTA } from './FooterCTA';
import { FooterBrand } from './FooterBrand';
import { FooterLinks } from './FooterLinks';
import { FooterContact } from './FooterContact';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const initialBranding = useBrandingContext();
    const { data: branding } = useContent("site_content", "settings", initialBranding);

    return (
        <footer className="bg-[#020617] relative z-10 overflow-hidden pt-20 border-t border-slate-800/50">
            {/* Premium Background Effects */}
            <div className="absolute top-0 inset-x-0 h-[500px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.1),rgba(255,255,255,0))] pointer-events-none"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                
                <FooterCTA />

                {/* Main Grid */}
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 mb-16">
                    <FooterBrand branding={branding} />
                    <FooterLinks />
                    <FooterContact />
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
    );
}
