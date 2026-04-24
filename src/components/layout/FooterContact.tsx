import { Mail, Phone, MapPin } from 'lucide-react';

export function FooterContact() {
    return (
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
    );
}
