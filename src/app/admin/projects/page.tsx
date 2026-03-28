"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm, useFieldArray } from "react-hook-form";
import { Save, Plus, Trash, Video } from "lucide-react";
import { toast, Toaster } from "react-hot-toast";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { revalidateProjects } from "@/app/actions";

type ProjectItem = {
    title: string;
    image: string;
    tags: string;
    link: string;
    description: string;
    category: 'design' | 'video' | 'software';
    videoUrl?: string;
    embedCode?: string;
}

interface ProjectsForm {
    items: ProjectItem[];
}

const defaultProjectsData: ProjectsForm = {
    items: [
        {
            title: 'تصميم هوية بصرية',
            image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
            tags: 'Branding, UI/UX',
            link: '',
            description: 'وصف المشروع هنا',
            category: 'design'
        }
    ]
};

export default function ProjectsPage() {
    const { register, control, handleSubmit, setValue, watch, formState: { isSubmitting } } = useForm<ProjectsForm>({
        defaultValues: defaultProjectsData
    });

    const { fields, append, remove } = useFieldArray({ control, name: "items" });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const snap = await getDoc(doc(db, "site_content", "projects"));
                if (snap.exists()) {
                    const data = snap.data() as ProjectsForm;
                    setValue("items", data.items || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [setValue]);

    const onSubmit = async (data: ProjectsForm) => {
        try {
            await setDoc(doc(db, "site_content", "projects"), data);
            await revalidateProjects();
            toast.success("تم تحديث المشاريع بنجاح!");
        } catch (e) {
            toast.error("حدث خطأ أثناء الحفظ.");
        }
    };

    if (loading) return <div className="text-white p-8">جاري التحميل...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8">
            <Toaster />
            <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">إدارة معرض الأعمال</h1>
                    <p className="text-slate-400 text-sm mt-1 font-medium">تحكم في المشاريع وتصنيفاتها بذكاء</p>
                </div>
                <button 
                    onClick={handleSubmit(onSubmit)} 
                    disabled={isSubmitting}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl text-white font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    <Save className="w-5 h-5" /> {isSubmitting ? "جاري الحفظ..." : "حفظ التغييرات"}
                </button>
            </div>

            <div className="bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-2xl font-black text-white flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                        قائمة المشاريع
                    </h2>
                    <button 
                        type="button" 
                        onClick={() => append({ title: "", image: "", tags: "", link: "", description: "", category: "design" })} 
                        className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-6 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 transition-all border border-blue-500/20"
                    >
                        <Plus className="w-5 h-5" /> إضافة مشروع جديد
                    </button>
                </div>

                <div className="space-y-10">
                    {fields.map((field, index) => {
                        const currentCategory = watch(`items.${index}.category`);
                        return (
                            <div key={field.id} className="p-8 bg-slate-950/50 rounded-[2rem] border border-slate-800 relative group transition-all hover:border-blue-500/30 shadow-inner overflow-hidden">
                                <div className="absolute top-0 right-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-all"></div>
                                
                                <button 
                                    type="button" 
                                    onClick={() => remove(index)} 
                                    className="absolute top-4 left-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-2.5 rounded-xl transition-all z-10 border border-red-500/20"
                                    title="حذف المشروع"
                                >
                                    <Trash className="w-5 h-5" />
                                </button>

                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                                    {/* Image Column */}
                                    <div className="lg:col-span-4">
                                        <ImageUpload
                                            value={watch(`items.${index}.image`)}
                                            onChange={(val) => setValue(`items.${index}.image`, val)}
                                            label={currentCategory === 'video' ? "صورة مصغرة (Thumbnail)" : "صورة المشروع"}
                                        />
                                    </div>

                                    {/* Details Column */}
                                    <div className="lg:col-span-8 space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="md:col-span-2">
                                                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">عنوان المشروع</label>
                                                <input {...register(`items.${index}.title`)} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-white w-full focus:border-blue-500 outline-none transition-all font-bold placeholder:text-slate-700" placeholder="مثال: تطبيق متجر إلكتروني احترافي" />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">التصنيف الرئيسي</label>
                                                <div className="relative">
                                                    <select 
                                                        {...register(`items.${index}.category`)} 
                                                        className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-white w-full focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer font-bold"
                                                    >
                                                        <option value="design">تصميمات (Design)</option>
                                                        <option value="video">فيديوهات (Video)</option>
                                                        <option value="software">برمجيات (Software)</option>
                                                    </select>
                                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">▼</div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">التقنيات المستخدمة (Tags)</label>
                                                <input {...register(`items.${index}.tags`)} className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-white w-full focus:border-blue-500 outline-none transition-all placeholder:text-slate-700" placeholder="React, UI/UX, Firebase" />
                                            </div>

                                            {/* Conditional Fields for Software */}
                                            {currentCategory === 'software' && (
                                                <div className="md:col-span-2">
                                                    <label className="block text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em]">رابط المشروع (المبرمجين فقط)</label>
                                                    <div className="relative">
                                                        <input {...register(`items.${index}.link`)} className="bg-blue-500/5 border border-blue-500/20 p-4 pr-12 rounded-2xl text-white w-full focus:border-blue-500 outline-none transition-all font-mono text-sm" placeholder="https://..." />
                                                        <Plus className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5 p-1 bg-blue-500/10 rounded-full" />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Conditional Fields for Video */}
                                            {currentCategory === 'video' && (
                                                <div className="md:col-span-2 space-y-4 bg-purple-500/5 p-6 rounded-2xl border border-purple-500/10">
                                                    <h4 className="text-xs font-black text-purple-400 mb-4 uppercase flex items-center gap-2">
                                                        <Video className="w-4 h-4" /> إعدادات الفيديو
                                                    </h4>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-500 mb-2">رابط الفيديو (Direct Link)</label>
                                                            <input {...register(`items.${index}.videoUrl`)} className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-white w-full focus:border-purple-500 outline-none transition-all text-sm" placeholder="YouTube, Drive, etc." />
                                                        </div>
                                                        <div>
                                                            <label className="block text-[10px] font-bold text-slate-500 mb-2">كود التضمين (Embed Code)</label>
                                                            <textarea {...register(`items.${index}.embedCode`)} className="bg-slate-900 border border-slate-800 p-3 rounded-xl text-white w-full h-11 focus:border-purple-500 outline-none transition-all text-xs resize-none" placeholder="<iframe>...</iframe>" />
                                                        </div>
                                                    </div>
                                                    <p className="text-[10px] text-slate-600 italic">* يمكنك رفع الفيديو لـ Cloudinary عبر أيقونة الرفع في خانة الصورة إذا كنت تفضل ذلك.</p>
                                                </div>
                                            )}

                                            <div className="md:col-span-2">
                                                <label className="block text-[10px] font-black text-slate-500 mb-2 uppercase tracking-[0.2em]">وصف المشروع الإبداعي</label>
                                                <textarea 
                                                    {...register(`items.${index}.description`)} 
                                                    className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl text-white w-full h-32 focus:border-blue-500 outline-none transition-all resize-none leading-relaxed" 
                                                    placeholder="صف رؤيتك للمشروع وكيف حققت أهداف العميل..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {fields.length === 0 && (
                    <div className="text-center py-24 border-2 border-dashed border-slate-800 rounded-[2rem] bg-slate-950/30">
                        <div className="bg-slate-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Plus className="text-slate-700 w-8 h-8" />
                        </div>
                        <p className="text-slate-500 font-bold mb-6">لا توجد مشاريع مضافة حالياً في معرضك</p>
                        <button 
                            type="button" 
                            onClick={() => append({ title: "", image: "", tags: "", link: "", description: "", category: "design" })} 
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-blue-600/20"
                        >
                            ابدأ بإضافة أول عمل إبداعي
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
