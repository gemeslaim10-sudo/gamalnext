"use client";

import { useMemo, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ExternalLink, FolderOpen } from "lucide-react";
import { AdminPage, SaveBar, useAdminDoc, useDraft, useUnsavedChangesGuard } from "@/components/admin/kit";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";
import { ButtonLink, Card, EmptyState, Field, Input, Select, Skeleton, Textarea } from "@/components/ui";
import { projectSlug } from "@/lib/content/shared";
import {
    applyForm,
    EMPTY_PROJECT,
    normalizeProjects,
    PROJECT_CATEGORIES,
    PROJECTS_PATH,
    toForm,
    type ProjectForm,
    type StoredProject,
} from "../projects";
import { ReadError } from "@/components/admin/kit/ReadError";

const CRUMBS = [{ label: "المشاريع", href: "/admin/projects" }];

/** Editor of one project (`index` in the items array), or of a new one (`index` null) that's added at the top. */
export function ProjectEditor({ index }: { index: number | null }) {
    const router = useRouter();
    const projects = useAdminDoc(PROJECTS_PATH, normalizeProjects);
    const items = projects.data?.items ?? null;
    const isNew = index === null;
    const original = isNew ? null : (items?.[index] ?? null);

    const saved = useMemo(() => (isNew ? EMPTY_PROJECT : original ? toForm(original) : null), [isNew, original]);
    const { draft, update, dirty, reset } = useDraft<ProjectForm>(saved);
    const [saving, setSaving] = useState(false);
    // A new project that was just added: the page moves to its editor, nothing is unsaved any more
    const [added, setAdded] = useState(false);
    const unsaved = dirty && !added;
    useUnsavedChangesGuard(unsaved);

    const title = draft?.title.trim() ?? "";
    const heading = isNew ? "مشروع جديد" : saved?.title.trim() || "مشروع من غير اسم";
    const liveSlug = original && saved?.title.trim() ? projectSlug(original as { title?: string; slug?: string }) : "";

    const save = async () => {
        if (!draft || !items || !title) return;
        let next: StoredProject[];
        if (index === null) {
            next = [applyForm({}, draft), ...items];
        } else {
            next = items.slice();
            next[index] = applyForm(items[index], draft);
        }
        setSaving(true);
        try {
            await projects.save({ items: next }, { refresh: ["projects"] });
            if (isNew) {
                setAdded(true);
                toast.success("اتضاف المشروع — هيظهر أول واحد في الموقع");
                router.replace("/admin/projects/0");
            } else {
                toast.success("اتحفظ المشروع");
            }
        } catch (error) {
            console.error("Saving projects failed:", error);
            toast.error("ماقدرناش نحفظ. اتأكد من الاتصال وجرّب تاني.");
        } finally {
            setSaving(false);
        }
    };

    if (!items) {
        return (
            <AdminPage title={isNew ? "مشروع جديد" : "المشروع"} breadcrumbs={CRUMBS}>
                {projects.error ? (
                    <ReadError message="ماقدرناش نجيب المشاريع. اتأكد من الاتصال وجرّب تاني." onRetry={() => void projects.reload()} />
                ) : (
                    <Card padding="lg" className="space-y-5" aria-busy="true" aria-label="جاري التحميل">
                        {[0, 1, 2].map((row) => (
                            <div key={row} className="space-y-2">
                                <Skeleton className="h-4 w-28" />
                                <Skeleton className="h-10 w-full" />
                            </div>
                        ))}
                    </Card>
                )}
            </AdminPage>
        );
    }

    if (!draft) {
        return (
            <AdminPage title="المشروع" breadcrumbs={CRUMBS}>
                <EmptyState
                    icon={<FolderOpen />}
                    title="المشروع ده مش موجود"
                    description="يمكن يكون اتمسح أو الترتيب اتغيّر. ارجع للقائمة وافتحه من هناك."
                    action={
                        <ButtonLink href="/admin/projects" variant="secondary">
                            رجوع للمشاريع
                        </ButtonLink>
                    }
                />
            </AdminPage>
        );
    }

    const isVideo = draft.category === "video";
    const knownCategory = PROJECT_CATEGORIES.some((category) => category.id === draft.category);

    return (
        <AdminPage
            title={<span dir="auto">{heading}</span>}
            description={isNew ? "هيتضاف أول واحد في قائمة المشاريع، وتقدر تغيّر ترتيبه بعدين." : undefined}
            breadcrumbs={CRUMBS}
            actions={
                liveSlug && (
                    <ButtonLink href={`/projects/${liveSlug}`} external variant="secondary">
                        <ExternalLink /> عرض في الموقع
                    </ButtonLink>
                )
            }
        >
            <div className="space-y-6">
                <Group title="البيانات">
                    <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
                        <Field label="اسم المشروع" htmlFor="project-title" error={dirty && !title ? "اكتب اسم المشروع." : undefined}>
                            <Input id="project-title" dir="auto" value={draft.title} onChange={(e) => update("title", e.target.value)} />
                        </Field>
                        <Field label="النوع" htmlFor="project-category">
                            <Select id="project-category" value={draft.category} onChange={(e) => update("category", e.target.value)}>
                                {PROJECT_CATEGORIES.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.label}
                                    </option>
                                ))}
                                {!knownCategory && <option value={draft.category}>{draft.category}</option>}
                            </Select>
                        </Field>
                    </div>
                    <Field label="التقنيات" htmlFor="project-tags" hint="مفصولة بفاصلة، زي: React، Firebase، Dashboard">
                        <Input id="project-tags" dir="auto" value={draft.tags} onChange={(e) => update("tags", e.target.value)} />
                    </Field>
                    <Field label="الوصف" htmlFor="project-description" hint="سطرين أو تلاتة عن المشروع ونتيجته.">
                        <Textarea
                            id="project-description"
                            dir="auto"
                            rows={3}
                            className="field-sizing-content max-h-72"
                            value={draft.description}
                            onChange={(e) => update("description", e.target.value)}
                        />
                    </Field>
                </Group>

                {draft.category === "software" && (
                    <Group title="الرابط">
                        <Field label="رابط المشروع" htmlFor="project-link" hint="الموقع شغال فين، لو متاح للناس.">
                            <Input
                                id="project-link"
                                type="url"
                                dir="ltr"
                                className="font-mono"
                                placeholder="https://…"
                                value={draft.link}
                                onChange={(e) => update("link", e.target.value)}
                            />
                        </Field>
                    </Group>
                )}

                {isVideo && (
                    <Group title="الفيديو">
                        <Field label="رابط الفيديو" htmlFor="project-video" hint="YouTube أو Google Drive أو غيره.">
                            <Input
                                id="project-video"
                                dir="ltr"
                                placeholder="https://…"
                                value={draft.videoUrl}
                                onChange={(e) => update("videoUrl", e.target.value)}
                            />
                        </Field>
                        <Field label="كود التضمين (Embed)" htmlFor="project-embed" hint="اختياري، بدل الرابط.">
                            <Input
                                id="project-embed"
                                dir="ltr"
                                className="font-mono"
                                placeholder="<iframe>…</iframe>"
                                value={draft.embedCode}
                                onChange={(e) => update("embedCode", e.target.value)}
                            />
                        </Field>
                    </Group>
                )}

                <Group title="الصور">
                    <div className={isVideo ? undefined : "grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]"}>
                        <ImageUpload
                            value={draft.image}
                            onChange={(url) => update("image", url)}
                            label={isVideo ? "الصورة المصغّرة" : "الصورة الأساسية"}
                        />
                        {!isVideo && <MultiImageUpload value={draft.gallery} onChange={(urls) => update("gallery", urls)} label="معرض الصور" />}
                    </div>
                </Group>
            </div>

            <SaveBar dirty={unsaved} saving={saving} disabled={!title} onSave={save} onReset={reset} />
        </AdminPage>
    );
}

function Group({ title, children }: { title: string; children: ReactNode }) {
    return (
        <Card padding="lg">
            <h2 className="mb-5 text-base font-semibold text-foreground">{title}</h2>
            <div className="space-y-4">{children}</div>
        </Card>
    );
}
