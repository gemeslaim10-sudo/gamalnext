"use client";

import Link from "next/link";
import { Field, Input } from "@/components/ui";
import { SettingsEditor } from "../SettingsEditor";

const FIELDS = ["whatsappNumber", "phoneDisplay", "emailAddress"] as const;

export default function ContactSettingsPage() {
    return (
        <SettingsEditor
            title="التواصل"
            description="الأرقام والإيميل اللي الزوار بيكلموك عليهم، في كارت البروفايل والفوتر وصفحة التواصل."
            fields={FIELDS}
        >
            {({ input, field }) => (
                <div className="space-y-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Field label="رقم الواتساب" hint="بالصيغة الدولية من غير + ولا مسافات، مثال: 201024531452" {...field("whatsappNumber")}>
                            <Input {...input("whatsappNumber")} dir="ltr" inputMode="tel" autoComplete="off" placeholder="201024531452" />
                        </Field>
                        <Field label="الرقم زي ما يظهر للزوار" hint="لو سبته فاضي هيظهر رقم الواتساب زي ما هو." {...field("phoneDisplay")}>
                            <Input {...input("phoneDisplay")} dir="ltr" inputMode="tel" autoComplete="off" placeholder="+20 102 453 1452" />
                        </Field>
                    </div>

                    <Field label="الإيميل" hint="سيبه فاضي عشان زرار الإيميل يختفي." {...field("emailAddress")}>
                        <Input {...input("emailAddress")} type="email" dir="ltr" autoComplete="off" placeholder="name@example.com" />
                    </Field>

                    <p className="border-t border-border pt-4 text-xs leading-relaxed text-subtle">
                        العناوين الصغيرة فوق البيانات دي في صفحة التواصل بتتعدّل من{" "}
                        <Link href="/admin/copy/contact" className="text-muted underline underline-offset-4 hover:text-foreground">
                            نصوص الموقع ← صفحة التواصل
                        </Link>
                        ، وفورم التواصل من{" "}
                        <Link href="/admin/leads/capture" className="text-muted underline underline-offset-4 hover:text-foreground">
                            نافذة جمع الأرقام
                        </Link>
                        .
                    </p>
                </div>
            )}
        </SettingsEditor>
    );
}
