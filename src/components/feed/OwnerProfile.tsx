"use client";

import Image from "next/image";
import { Github, Linkedin, Mail, MapPin, Briefcase, Globe, User, MessageSquare, ArrowUpRight, Copy, CheckCircle2, Terminal, Code2, Cpu, Zap, Activity, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useBrandingContext } from "@/components/providers/BrandingProvider";

export default function OwnerProfile() {
    const branding = useBrandingContext();
    const [copiedItem, setCopiedItem] = useState<string | null>(null);
    
    // Pull strictly from database via Branding Context
    const siteName = branding?.siteName || "";
    const siteDescription = branding?.siteDescription || "";
    
    const name = branding?.ownerName || "";
    const title = branding?.ownerTitle || "";
    const bio = branding?.ownerBio || "";
    const role = branding?.ownerRole || "";
    const location = branding?.ownerLocation || "";
    
    const github = branding?.githubUrl || "";
    const linkedin = branding?.linkedinUrl || "";
    const email = branding?.emailAddress || "";
    const phone = branding?.phoneDisplay || branding?.whatsappNumber || "";
    const avatar = branding?.siteLogo || "/gamal.jpg"; // Fallback image just in case

    const handleCopy = (text: string, type: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedItem(type);
        setTimeout(() => setCopiedItem(null), 2000);
    };

    return (
        <div className="space-y-5 w-full">
            {/* Card 1: Site Intro - Complex */}
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none transition-all group-hover:bg-blue-500/20" />
                
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-blue-500/20 shadow-inner">
                            <Globe className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="font-black text-white tracking-wide">{siteName}</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">All Systems Operational</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <p className="text-slate-400 text-xs leading-relaxed mb-4 relative z-10 font-medium">
                    {siteDescription}
                </p>

                <div className="grid grid-cols-2 gap-2 relative z-10">
                    <div className="bg-slate-950/50 rounded-xl p-2.5 border border-slate-800/50 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-slate-500" />
                        <div className="flex flex-col">
                            <span className="text-white text-xs font-bold">15+</span>
                            <span className="text-slate-500 text-[9px] uppercase">Tools</span>
                        </div>
                    </div>
                    <div className="bg-slate-950/50 rounded-xl p-2.5 border border-slate-800/50 flex items-center gap-2">
                        <Activity className="w-4 h-4 text-slate-500" />
                        <div className="flex flex-col">
                            <span className="text-white text-xs font-bold">24/7</span>
                            <span className="text-slate-500 text-[9px] uppercase">Uptime</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card 2: Contact Info - Complex */}
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
                                onClick={() => handleCopy(phone, 'phone')}
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
                                onClick={() => handleCopy(email, 'email')}
                                className="p-1.5 hover:bg-slate-800 rounded-md transition-colors text-slate-400 hover:text-white"
                                title="Copy Email"
                            >
                                {copiedItem === 'email' ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Card 3: Social Links - Complex */}
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
                <h3 className="font-bold text-white text-sm mb-4">Connect With Me</h3>
                <div className="flex flex-col gap-3">
                    {github && (
                        <Link href={github} target="_blank" className="group flex items-center justify-between p-3 bg-slate-950/50 hover:bg-slate-800 rounded-xl transition-all border border-slate-800/80 hover:border-slate-600 shadow-inner">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-slate-800 rounded-md group-hover:bg-slate-700 transition-colors">
                                    <Github className="w-4 h-4 text-slate-300 group-hover:text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white leading-none">GitHub</span>
                                    <span className="text-[10px] text-slate-500 mt-1">Open Source Projects</span>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-white transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    )}
                    {linkedin && (
                        <Link href={linkedin} target="_blank" className="group flex items-center justify-between p-3 bg-slate-950/50 hover:bg-[#0A66C2]/10 rounded-xl transition-all border border-slate-800/80 hover:border-[#0A66C2]/30 shadow-inner">
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-slate-800 rounded-md group-hover:bg-[#0A66C2] transition-colors">
                                    <Linkedin className="w-4 h-4 text-slate-300 group-hover:text-white" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-bold text-white leading-none">LinkedIn</span>
                                    <span className="text-[10px] text-slate-500 mt-1 group-hover:text-blue-200/70">Professional Network</span>
                                </div>
                            </div>
                            <ArrowUpRight className="w-4 h-4 text-slate-600 group-hover:text-[#0A66C2] transition-colors group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>
                    )}
                </div>
            </div>

            {/* Card 4: About Me - Complex */}
            <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl p-5 shadow-2xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-5 pointer-events-none" />
                <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none transform group-hover:scale-110 transition-transform duration-700">
                    <User className="w-32 h-32" />
                </div>
                
                <div className="flex items-center gap-4 mb-5 relative z-10">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-700 shrink-0 shadow-xl group-hover:border-emerald-500/50 transition-colors">
                        <Image
                            src={avatar}
                            alt={name}
                            fill
                            sizes="56px"
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5">
                            <h2 className="text-base font-black text-white leading-tight">{name}</h2>
                            <CheckCircle2 className="w-4 h-4 text-blue-500" />
                        </div>
                        <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mt-1 bg-emerald-500/10 inline-block px-2 py-0.5 rounded-md border border-emerald-500/20">
                            {title}
                        </p>
                    </div>
                </div>
                
                <p className="text-slate-300 text-xs leading-relaxed relative z-10 mb-4 font-medium">
                    {bio}
                </p>

                {/* Tech Stack Badges */}
                <div className="flex flex-wrap gap-1.5 relative z-10">
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                        <Code2 className="w-3 h-3 text-blue-400" /> React & Next.js
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                        <Cpu className="w-3 h-3 text-purple-400" /> AI Integration
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-300 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
                        <Zap className="w-3 h-3 text-amber-400" /> Performance
                    </span>
                </div>
            </div>
        </div>
    );
}
