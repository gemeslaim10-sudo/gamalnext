"use client";

import React, { useEffect, useState } from "react";
import { getCvData, saveCvData, defaultCvData } from "@/lib/cv/service";
import { CVData } from "@/app/tools/utils/ai-cv-builder/components/CvTemplate";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";

import { AdminCvHeader } from "./components/AdminCvHeader";
import { AdminCvPersonalInfo } from "./components/AdminCvPersonalInfo";
import { AdminCvExperience } from "./components/AdminCvExperience";
import { AdminCvEducation } from "./components/AdminCvEducation";
import { AdminCvSkillsLanguages } from "./components/AdminCvSkillsLanguages";
import { AdminCvSolutions } from "./components/AdminCvSolutions";

export default function AdminCvPage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [cvData, setCvData] = useState<CVData>(defaultCvData);

    useEffect(() => {
        async function load() {
            try {
                const data = await getCvData();
                if (data) {
                    setCvData(data);
                }
            } catch (e) {
                console.error(e);
                toast.error("حدث خطأ أثناء تحميل بيانات السيرة الذاتية");
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const ok = await saveCvData(cvData);
            if (ok) {
                toast.success("تم حفظ السيرة الذاتية (CV) بنجاح ورؤيتها مباشرة على الموقع!");
            } else {
                toast.error("فشل حفظ البيانات");
            }
        } catch {
            toast.error("حدث خطأ في الاتصال");
        } finally {
            setSaving(false);
        }
    };

    const handleResetDefault = () => {
        if (confirm("هل أنت متاكد من إعادة تعيين البيانات إلى القيمة الافتراضية؟")) {
            setCvData(defaultCvData);
            toast.success("تمت الإعادة للقيم الافتراضية. لا تنس الضغط على حفظ التغييرات.");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-16">
            <AdminCvHeader saving={saving} onResetDefault={handleResetDefault} />

            {/* Capacity Protection Banner */}
            <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 px-4 rounded-xl flex items-center justify-between text-xs text-emerald-400">
                <span className="flex items-center gap-2 font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    حماية الصفحة الواحدة مفعلة: جميع الحقول مضبوطة بحدود صارمة لضمان عدم تجاوز صفحة A4 واحدة على الموقع.
                </span>
                <span className="font-bold bg-emerald-500/20 px-2.5 py-1 rounded-md">صفحة 1 من 1</span>
            </div>

            {/* Data Editing Form */}
            <form id="cv-admin-form" onSubmit={handleSave} className="space-y-6">
                <AdminCvPersonalInfo cvData={cvData} setCvData={setCvData} />
                <AdminCvExperience cvData={cvData} setCvData={setCvData} />
                <AdminCvEducation cvData={cvData} setCvData={setCvData} />
                <AdminCvSkillsLanguages cvData={cvData} setCvData={setCvData} />
                <AdminCvSolutions cvData={cvData} setCvData={setCvData} />
            </form>
        </div>
    );
}
