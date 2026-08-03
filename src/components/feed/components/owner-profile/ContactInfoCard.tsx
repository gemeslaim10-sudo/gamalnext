import { MessageSquare, Phone, Briefcase, MapPin, Mail, CheckCircle2, Copy } from "lucide-react";

interface ContactInfoCardProps {
    phone: string;
    role: string;
    location: string;
    email: string;
    copiedItem: string | null;
    onCopy: (text: string, type: string) => void;
}

export function ContactInfoCard({
    phone,
    role,
    location,
    email,
    copiedItem,
    onCopy
}: ContactInfoCardProps) {
    return (
        <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 shadow-2xl group">
            <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                        <MessageSquare className="w-4 h-4 text-cyan-400" />
                    </div>
                    <h3 className="font-bold text-white text-sm">Contact Details</h3>
                </div>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-full border border-cyan-500/20 animate-pulse">
                    Available
                </span>
            </div>
            
            <div className="space-y-4">
                {phone && (
                    <div className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-3 text-slate-300 text-xs font-medium">
                            <Phone className="w-4 h-4 text-slate-500 group-hover/item:text-emerald-400 transition-colors shrink-0" />
                            <span className="truncate">{phone}</span>
                        </div>
                        <button 
                            onClick={() => onCopy(phone, 'phone')}
                            className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white"
                            title="Copy Phone"
                        >
                            {copiedItem === 'phone' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                )}

                {role && (
                    <div className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-3 text-slate-300 text-xs font-medium">
                            <Briefcase className="w-4 h-4 text-slate-500 group-hover/item:text-blue-400 transition-colors shrink-0" />
                            <span className="truncate">{role}</span>
                        </div>
                    </div>
                )}
                
                {location && (
                    <div className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-3 text-slate-300 text-xs font-medium">
                            <MapPin className="w-4 h-4 text-slate-500 group-hover/item:text-red-400 transition-colors shrink-0" />
                            <span className="truncate">{location}</span>
                        </div>
                    </div>
                )}
                
                {email && (
                    <div className="flex items-center justify-between group/item">
                        <div className="flex items-center gap-3 text-slate-300 text-xs font-medium">
                            <Mail className="w-4 h-4 text-slate-500 group-hover/item:text-green-400 transition-colors shrink-0" />
                            <span className="truncate">{email}</span>
                        </div>
                        <button 
                            onClick={() => onCopy(email, 'email')}
                            className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white"
                            title="Copy Email"
                        >
                            {copiedItem === 'email' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
