"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import { CircleAlert, RefreshCw } from "lucide-react";
import toast from "react-hot-toast";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { AdminPage, SaveBar, useAdminDoc, useDraft, useUnsavedChangesGuard } from "@/components/admin/kit";
import { Alert, Button, Card, EmptyState, Field, Input, LoadingBlock, Textarea } from "@/components/ui";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { cn } from "@/lib/utils";
import { HERO_DOC, HERO_FIELDS, heroError, normalizeHero, type HeroField } from "./heroDoc";

const LINK = "text-muted underline underline-offset-4 hover:text-foreground";

/** The intro at the top of the profile page: photo, name, one line, bio and the CV link. */
export default function HeroEditorPage() {
    const hero = useAdminDoc(HERO_DOC, normalizeHero);
    const { draft, update, dirty, reset } = useDraft(hero.data);
    useUnsavedChangesGuard(dirty);

    const [saving, setSaving] = useState(false);
    const [touched, setTouched] = useState<ReadonlySet<HeroField>>(() => new Set());
    const [showAllErrors, setShowAllErrors] = useState(false);

    const clearErrors = () => {
        setTouched(new Set());
        setShowAllErrors(false);
    };

    const error = (key: HeroField) => (draft && (showAllErrors || touched.has(key)) ? heroError(key, draft[key]) : undefined);

    const input = (key: HeroField) => ({
        id: `hero-${key}`,
        value: draft?.[key] ?? "",
        onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(key, event.target.value),
        onBlur: () => setTouched((current) => (current.has(key) ? current : new Set(current).add(key))),
        "aria-invalid": error(key) ? (true as const) : undefined,
    });

    const field = (key: HeroField) => ({ htmlFor: `hero-${key}`, error: error(key) });

    const save = async () => {
        const saved = hero.data;
        if (!draft || !saved) return;
        if (HERO_FIELDS.some((key) => heroError(key, draft[key]))) {
            setShowAllErrors(true);
            toast.error("فيه خانات محتاجة تتظبط الأول.");
            return;
        }
        const patch = Object.fromEntries(HERO_FIELDS.filter((key) => draft[key] !== saved[key]).map((key) => [key, draft[key].trim()]));
        setSaving(true);
        try {
            await hero.save(patch, { refresh: [CACHE_TAGS.hero] });
            clearErrors();
            toast.success("اتحفظ، والموقع اتحدّث.");
        } catch (saveError) {
            console.error("Couldn't save the hero:", saveError);
            toast.error("ماقدرناش نحفظ. اتأكد من النت وجرّب تاني.");
        } finally {
            setSaving(false);
        }
    };

    const reloading = hero.status === "loading";

    return (
        <AdminPage
            title="الواجهة"
            description="أول حاجة الزائر بيشوفها في صفحة البروفايل: صورتك واسمك وجملة تعريفية ونبذة وزرار الـ CV."
            actions={
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void hero.reload()}
                    disabled={dirty || saving || reloading}
                    title={dirty ? "احفظ أو تراجع عن التعديلات الأول" : "هات آخر نسخة من قاعدة البيانات"}
                >
                    <RefreshCw className={cn(reloading && "animate-spin")} />
                    تحديث
                </Button>
            }
        >
            {hero.loading ? (
                <LoadingBlock label="جاري التحميل…" />
            ) : !draft ? (
                <EmptyState
                    icon={<CircleAlert />}
                    title="ماقدرناش نقرا بيانات الواجهة"
                    description={
                        <>
                            اتأكد من النت وجرّب تاني. مش هنعرض الخانات فاضية عشان ما تتحفظش فوق بياناتك بالغلط.
                            {hero.error && (
                                <span dir="ltr" className="mt-2 block text-xs text-subtle">
                                    {hero.error}
                                </span>
                            )}
                        </>
                    }
                    action={
                        <Button variant="secondary" onClick={() => void hero.reload()}>
                            <RefreshCw />
                            جرّب تاني
                        </Button>
                    }
                />
            ) : (
                <>
                    {hero.status === "error" && (
                        <Alert variant="warning" className="mb-4">
                            ماقدرناش نجيب آخر نسخة، والمعروض هو اللي اتحمّل قبل كده.
                        </Alert>
                    )}

                    <Card padding="lg" className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-[13rem_minmax(0,1fr)]">
                            <div className="space-y-1.5">
                                <ImageUpload label="الصورة" value={draft.avatarImage} onChange={(url) => update("avatarImage", url)} />
                                <p className="text-xs text-subtle">لو سبتها فاضية هتظهر صورتك من إعدادات الموقع.</p>
                            </div>
                            <div className="space-y-5">
                                <Field label="الاسم" hint="العنوان الكبير. لو فاضي هيظهر اسمك من إعدادات الموقع." {...field("heroTitle")}>
                                    <Input {...input("heroTitle")} dir="auto" />
                                </Field>
                                <Field label="الجملة اللي تحت الاسم" hint="لو فاضية هيظهر مسمّاك الوظيفي." {...field("heroSubtitle")}>
                                    <Input {...input("heroSubtitle")} dir="auto" />
                                </Field>
                            </div>
                        </div>

                        <Field label="النبذة" hint="لو فاضية هتظهر النبذة اللي في إعدادات الموقع." {...field("heroDescription")}>
                            <Textarea {...input("heroDescription")} dir="auto" rows={4} />
                        </Field>

                        <Field label="رابط الـ CV" hint="رابط ملف PDF أو صفحة. سيبه فاضي عشان زرار الـ CV يختفي." {...field("resumeLink")}>
                            <Input {...input("resumeLink")} type="url" dir="ltr" autoComplete="off" placeholder="https://…/cv.pdf" />
                        </Field>
                    </Card>

                    <p className="mt-4 text-xs leading-relaxed text-subtle">
                        أزرار المقدمة والأرقام اللي تحتها بتتعدّل من{" "}
                        <Link href="/admin/copy/profile" className={LINK}>
                            نصوص الموقع ← صفحة البروفايل
                        </Link>
                        ، والاسم والصورة والنبذة الأساسية ورقم الواتساب من{" "}
                        <Link href="/admin/settings" className={LINK}>
                            إعدادات الموقع
                        </Link>
                        .
                    </p>

                    <SaveBar
                        dirty={dirty}
                        saving={saving}
                        onSave={save}
                        onReset={() => {
                            reset();
                            clearErrors();
                        }}
                    />
                </>
            )}
        </AdminPage>
    );
}
