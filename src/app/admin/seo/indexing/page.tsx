"use client";

import { useState } from "react";
import { ExternalLink, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { SectionCard } from "@/components/admin/SectionCard";
import { AdminPage } from "@/components/admin/kit";
import { Button, ButtonLink, Spinner } from "@/components/ui";
import { auth } from "@/lib/firebase-app";
import { SEO_CRUMBS } from "../components/SeoEditor";

const SEO_FILES: { path: string; description: string }[] = [
    { path: "/sitemap.xml", description: "قايمة بكل صفحات الموقع. ضيفها مرة واحدة في Search Console و Bing Webmaster Tools." },
    { path: "/robots.txt", description: "بيقول لمحركات البحث والمساعدات الذكية يقروا إيه." },
    { path: "/rss.xml", description: "آخر المقالات، للي بيتابعوا المدونة ولمحركات البحث." },
    { path: "/llms.txt", description: "ملخص الموقع للمساعدات الذكية (بيتعدّل من «المساعدات الذكية و llms.txt»)." },
];

interface IndexNowResponse {
    ok?: boolean;
    submitted?: number;
    status?: number;
    skipped?: string;
    error?: string;
}

/** Sends every sitemap page to IndexNow (Bing & co.) through the admin-only API route. */
async function submitAllPages() {
    const token = await auth.currentUser?.getIdToken();
    if (!token) {
        toast.error("لازم تكون داخل بحساب الأدمن.");
        return;
    }

    const res = await fetch("/api/seo/indexnow", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: "{}",
    });
    // A missing route answers with an HTML page, so the body may not be JSON
    const data = (await res.json().catch(() => null)) as IndexNowResponse | null;

    if (data?.skipped === "not-production") {
        toast("الإرسال بيشتغل من الموقع الحقيقي (gamaltech.info) بس، مش من النسخة المحلية أو التجريبية.", { duration: 6000 });
    } else if (res.ok && data?.ok) {
        toast.success(data.submitted ? `اتبعتت ${data.submitted} صفحة لـ Bing و IndexNow.` : "مفيش صفحات للإرسال.");
    } else if (res.status === 401 || res.status === 403) {
        toast.error("لازم تكون داخل بحساب الأدمن.");
    } else if (res.status === 404) {
        toast.error("خدمة الإرسال مش متاحة على السيرفر لسه.");
    } else {
        const reason = data?.status ? ` (رد IndexNow: ${data.status})` : res.ok ? "" : ` (${res.status})`;
        toast.error(`تعذّر الإرسال${reason}. جرّب تاني بعد شوية.`, { duration: 6000 });
    }
}

/** The files search engines read, and "send all pages to IndexNow". Reads nothing from the database. */
export default function SeoIndexingPage() {
    const [submitting, setSubmitting] = useState(false);

    const submit = async () => {
        setSubmitting(true);
        try {
            await submitAllPages();
        } catch (error) {
            console.error("IndexNow submission failed:", error);
            toast.error("تعذّر الاتصال بالسيرفر. اتأكد من النت وجرّب تاني.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <AdminPage
            title="إرسال الصفحات والملفات"
            description="الموقع بيعمل ملفات محركات البحث ويحدّثها لوحده، وتقدر تبلّغ Bing إن صفحاتك اتحدّثت."
            breadcrumbs={SEO_CRUMBS}
        >
            <div className="space-y-6">
                <SectionCard
                    title="إرسال الصفحات لـ Bing و IndexNow"
                    description="بيبلّغ Bing (ومنه ChatGPT search و Copilot) و Yandex وباقي المحركات اللي بتدعم IndexNow إن صفحاتك اتحدّثت، بدل ما يستنوا لحد ما يزوروا الموقع."
                >
                    <div className="space-y-3">
                        <Button onClick={submit} disabled={submitting} className="h-auto min-h-10 w-full whitespace-normal py-2 sm:w-auto">
                            {submitting ? <Spinner className="size-4 text-primary-foreground" /> : <Send />}
                            {submitting ? "جارٍ الإرسال…" : "إرسال كل الصفحات"}
                        </Button>
                        <p className="text-xs leading-relaxed text-subtle">
                            استخدمه بعد تعديلات كبيرة؛ المقالات الجديدة والمعدّلة بتتبعت لوحدها. جوجل مش بيدعم IndexNow — بيعرف صفحاتك من
                            الـ sitemap.
                        </p>
                    </div>
                </SectionCard>

                <SectionCard title="ملفات محركات البحث" description="افتحها لو عايز تتأكد منها.">
                    <ul className="divide-y divide-border rounded-control border border-border">
                        {SEO_FILES.map((file) => (
                            <li key={file.path} className="flex items-center gap-3 py-2 ps-3 pe-1.5">
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium text-foreground">
                                        <bdi dir="ltr">{file.path}</bdi>
                                    </p>
                                    <p className="mt-0.5 text-xs text-subtle">{file.description}</p>
                                </div>
                                <ButtonLink
                                    href={file.path}
                                    external
                                    variant="ghost"
                                    size="icon"
                                    aria-label={`فتح ${file.path} في تبويب جديد`}
                                    title="فتح في تبويب جديد"
                                    className="shrink-0"
                                >
                                    <ExternalLink />
                                </ButtonLink>
                            </li>
                        ))}
                    </ul>
                </SectionCard>
            </div>
        </AdminPage>
    );
}
