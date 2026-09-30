"use client";

import { Badge, Field, Input, Textarea } from "@/components/ui";
import { SettingsEditor } from "../SettingsEditor";

const FIELDS = ["ownerName", "ownerTitle", "ownerRole", "ownerLocation", "availabilityStatus", "ownerBio", "ownerBadges"] as const;

/** The site shows badges split on English commas, so the preview does the same. */
const splitBadges = (text: string) =>
    text
        .split(",")
        .map((badge) => badge.trim())
        .filter(Boolean);

export default function ProfileSettingsPage() {
    return (
        <SettingsEditor
            title="الصفحة الشخصية"
            description="بياناتك اللي بتظهر في كارت البروفايل في الصفحة الرئيسية وفي مقدمة صفحة البروفايل."
            fields={FIELDS}
        >
            {({ values, input, field }) => {
                const badges = splitBadges(values.ownerBadges);
                return (
                    <div className="space-y-6">
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="اسمك" {...field("ownerName")}>
                                <Input {...input("ownerName")} dir="auto" autoComplete="name" />
                            </Field>
                            <Field label="المسمّى الوظيفي" hint="بيظهر تحت اسمك." {...field("ownerTitle")}>
                                <Input {...input("ownerTitle")} dir="auto" />
                            </Field>
                            <Field label="دورك في الشركة" {...field("ownerRole")}>
                                <Input {...input("ownerRole")} dir="auto" placeholder="Founder, GTech" />
                            </Field>
                            <Field label="المكان" hint="في كارت البروفايل والفوتر وصفحة التواصل." {...field("ownerLocation")}>
                                <Input {...input("ownerLocation")} dir="auto" />
                            </Field>
                            <Field label="حالة التوفر" hint="الشارة اللي جنب اسمك. سيبها فاضية عشان تختفي." {...field("availabilityStatus")}>
                                <Input {...input("availabilityStatus")} dir="auto" placeholder="Available" />
                            </Field>
                        </div>

                        <Field label="نبذة عنك" hint="في كارت البروفايل، وفي المقدمة لو ما كتبتش نبذة هناك." {...field("ownerBio")}>
                            <Textarea {...input("ownerBio")} dir="auto" rows={4} />
                        </Field>

                        <div className="space-y-2">
                            <Field label="الشارات" hint="كلمات قصيرة بتظهر تحت النبذة، افصل بينها بفاصلة إنجليزي (,)." {...field("ownerBadges")}>
                                <Input {...input("ownerBadges")} dir="auto" placeholder="ERP & CRM systems, Websites, Hosting" />
                            </Field>
                            {badges.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="text-xs text-subtle">معاينة:</span>
                                    {badges.map((badge, index) => (
                                        <Badge key={`${badge}-${index}`} variant="outline" dir="auto">
                                            {badge}
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            }}
        </SettingsEditor>
    );
}
