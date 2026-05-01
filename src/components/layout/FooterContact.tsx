import { Mail, Phone, MapPin } from 'lucide-react';
import type { BrandingSettings } from '@/types';

interface FooterContactProps {
    branding: BrandingSettings | null;
}

export function FooterContact({ branding }: FooterContactProps) {
    const email = branding?.emailAddress || "gamal.dev1@gmail.com";
    const phone = branding?.whatsappNumber || "+201024531452";
    const phoneDisplay = branding?.phoneDisplay || "+20 102 453 1452";
    const location = branding?.ownerLocation || "Cairo, Egypt\nAvailable Worldwide";

    return (
        <div className="space-y-6">
            <h3 className="text-white font-bold text-lg tracking-wide">Get in Touch</h3>
            <ul className="space-y-4">
                <li>
                    <a href={`mailto:${email}`} className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group">
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-colors">
                            <Mail className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm mt-1">{email}</span>
                    </a>
                </li>
                <li>
                    <a href={`tel:${phone}`} className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group">
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 group-hover:border-green-500/50 group-hover:bg-green-500/10 transition-colors">
                            <Phone className="w-4 h-4 text-green-400" />
                        </div>
                        <span className="text-sm mt-1" dir="ltr">{phoneDisplay}</span>
                    </a>
                </li>
                <li>
                    <div className="flex items-start gap-3 text-slate-400 group">
                        <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                            <MapPin className="w-4 h-4 text-red-400" />
                        </div>
                        <span className="text-sm mt-1 whitespace-pre-line">{location}</span>
                    </div>
                </li>
            </ul>
        </div>
    );
}
