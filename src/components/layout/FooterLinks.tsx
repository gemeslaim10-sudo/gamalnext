import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function FooterLinks() {
    return (
        <>
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
        </>
    );
}
