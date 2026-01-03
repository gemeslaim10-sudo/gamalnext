'use client';
import { MessageSquare, Mail, MapPin, Send } from 'lucide-react';
import Reveal from './Reveal';
import { FormEvent } from 'react';
import { useContent } from '@/hooks/useContent';

const defaultContactData = {
    whatsappNumber: "201024531452",
    phoneDisplay: "01024531452",
    phoneAlt: "01105432048",
    emailPrimary: "montasrrm@gmail.com",
    emailSecondary: "gemeslaim10@gmail.com",
    location: "مدينة نصر، مصر"
};

export default function Contact() {
    const { data } = useContent("site_content", "contact", defaultContactData);
    const contact = data || defaultContactData;

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const nameInput = form.elements.namedItem('name') as HTMLInputElement;
        const msgInput = form.elements.namedItem('message') as HTMLTextAreaElement;

        const name = nameInput.value;
        const msg = msgInput.value;
        const text = `*رسالة جديدة من الموقع*%0A*الاسم:* ${name}%0A*الرسالة:* ${msg}`;
        window.open(`https://wa.me/${contact.whatsappNumber}?text=${text}`, '_blank');
    };

    return (
        <section id="contact" className="py-16 md:py-20 bg-slate-950 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-900/20 rounded-full blur-[80px]"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                <Reveal className="text-center mb-12 md:mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">اتصل بنا</h2>
                    <p className="text-slate-400">نرحب بمناقشة فرص التعاون والشراكات الاستراتيجية</p>
                </Reveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Info */}
                    <Reveal className="stagger-1 space-y-5 md:space-y-6">
                        <div className="glass-card p-6 rounded-2xl flex items-center gap-5 group hover:bg-slate-800/40 transition-colors">
                            <div className="bg-green-500/10 p-4 rounded-xl border border-green-500/20 group-hover:border-green-500/50 transition-colors">
                                <MessageSquare className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <h4 className="text-slate-400 font-medium text-xs mb-1">التواصل الفوري</h4>
                                <p className="text-white font-mono text-xl font-bold tracking-wider">{contact.phoneDisplay}</p>
                                <p className="text-slate-500 font-mono text-sm">{contact.phoneAlt}</p>
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-2xl flex items-center gap-5 group hover:bg-slate-800/40 transition-colors">
                            <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 group-hover:border-blue-500/50 transition-colors">
                                <Mail className="w-6 h-6 text-blue-500" />
                            </div>
                            <div className="overflow-hidden">
                                <h4 className="text-slate-400 font-medium text-xs mb-1">المراسلات الرسمية</h4>
                                <p className="text-white font-mono font-bold truncate hover:text-blue-400 transition-colors cursor-pointer">{contact.emailPrimary}</p>
                                <p className="text-slate-500 font-mono text-sm truncate">{contact.emailSecondary}</p>
                            </div>
                        </div>
                        <div className="glass-card p-6 rounded-2xl flex items-center gap-5 group hover:bg-slate-800/40 transition-colors">
                            <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 group-hover:border-purple-500/50 transition-colors">
                                <MapPin className="w-6 h-6 text-purple-500" />
                            </div>
                            <div>
                                <h4 className="text-slate-400 font-medium text-xs mb-1">المقر</h4>
                                <p className="text-white font-bold">{contact.location}</p>
                            </div>
                        </div>
                    </Reveal>

                    {/* Form */}
                    <Reveal className="stagger-2 glass-card p-8 rounded-3xl relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-transparent"></div>
                        <h3 className="text-2xl font-bold text-white mb-8">نموذج التواصل المباشر</h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-slate-300 text-sm font-medium pr-1">الاسم الكامل</label>
                                <input type="text" id="name" name="name" required className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-600" placeholder="يرجى إدخال الاسم..." />
                            </div>
                            <div className="space-y-2">
                                <label htmlFor="message" className="text-slate-300 text-sm font-medium pr-1">محتوى الرسالة</label>
                                <textarea id="message" name="message" required rows={5} className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/50 transition-all resize-none placeholder:text-slate-600" placeholder="يرجى توضيح طبيعة الاستفسار أو المشروع المقترح..."></textarea>
                            </div>
                            <button type="submit" className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-lg shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all transform hover:-translate-y-1 active:scale-[0.98] flex items-center justify-center gap-3">
                                <Send className="w-5 h-5" />
                                إرسال الاستفسار
                            </button>
                        </form>
                    </Reveal>
                </div>
            </div>
        </section>
    );
}
