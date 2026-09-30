"use client";

import { Field, Input } from "@/components/ui";
import { SettingsEditor } from "../SettingsEditor";

const FIELDS = ["githubUrl", "linkedinUrl"] as const;

export default function LinksSettingsPage() {
    return (
        <SettingsEditor
            title="الروابط"
            description="حساباتك اللي بتظهر كأزرار في كارت البروفايل وصفحة التواصل. سيب الخانة فاضية عشان الزرار يختفي."
            fields={FIELDS}
        >
            {({ input, field }) => (
                <div className="space-y-5">
                    <Field label="GitHub" {...field("githubUrl")}>
                        <Input {...input("githubUrl")} type="url" dir="ltr" autoComplete="off" placeholder="https://github.com/username" />
                    </Field>
                    <Field label="LinkedIn" {...field("linkedinUrl")}>
                        <Input {...input("linkedinUrl")} type="url" dir="ltr" autoComplete="off" placeholder="https://linkedin.com/in/username" />
                    </Field>
                </div>
            )}
        </SettingsEditor>
    );
}
