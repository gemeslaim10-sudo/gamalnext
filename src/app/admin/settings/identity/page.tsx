"use client";

import { ImageUpload } from "@/components/admin/ImageUpload";
import { Field, Input, Textarea } from "@/components/ui";
import { SettingsEditor } from "../SettingsEditor";

const FIELDS = ["siteName", "siteLogo", "siteDescription"] as const;

export default function IdentitySettingsPage() {
    return (
        <SettingsEditor
            title="الهوية"
            description="اسم الموقع وصورتك ووصف قصير، وبيظهروا في كل الموقع وفي نتايج جوجل."
            fields={FIELDS}
        >
            {({ values, set, input, field }) => (
                <div className="space-y-6">
                    <Field label="اسم الموقع" hint="بيظهر في القائمة وفي عنوان كل صفحة." {...field("siteName")}>
                        <Input {...input("siteName")} dir="auto" autoComplete="off" />
                    </Field>

                    <div className="space-y-1.5">
                        <ImageUpload label="صورتك / اللوجو" value={values.siteLogo} onChange={(url) => set("siteLogo", url)} />
                        <p className="text-xs text-subtle">
                            بتظهر في القائمة وكارت البروفايل والمنشورات، وفي مقدمة البروفايل لو ما حطّيتش صورة خاصة بيها.
                        </p>
                    </div>

                    <Field label="وصف الموقع" hint="جملة أو اتنين عن الموقع، بيستخدمهم جوجل والمساعد الذكي." {...field("siteDescription")}>
                        <Textarea {...input("siteDescription")} dir="auto" rows={3} />
                    </Field>
                </div>
            )}
        </SettingsEditor>
    );
}
