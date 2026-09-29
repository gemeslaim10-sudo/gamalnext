import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";
import { Field, Input, Select, Textarea } from "@/components/ui";
import { type ProjectsForm, type ProjectItem } from "../types";

interface ProjectExpandedFormProps {
    index: number;
    item: ProjectItem | undefined;
    register: UseFormRegister<ProjectsForm>;
    watch: UseFormWatch<ProjectsForm>;
    setValue: UseFormSetValue<ProjectsForm>;
}

export function ProjectExpandedForm({
    index, item, register, watch, setValue
}: ProjectExpandedFormProps) {
    const id = (name: string) => `project-${index}-${name}`;

    return (
        <div className="border-t border-border p-4">
            <div className="grid gap-5 @2xl:grid-cols-[15rem_1fr]">
                {/* Image & Gallery */}
                <div className="min-w-0 space-y-4">
                    <ImageUpload
                        value={watch(`items.${index}.image`)}
                        onChange={(val) => setValue(`items.${index}.image`, val)}
                        label={item?.category === 'video' ? "Thumbnail" : "Main Project Image"}
                    />
                    {item?.category !== 'video' && (
                        <MultiImageUpload
                            value={watch(`items.${index}.gallery`) || []}
                            onChange={(urls) => setValue(`items.${index}.gallery`, urls)}
                            label="Project Gallery"
                        />
                    )}
                </div>

                {/* Fields */}
                <div className="grid min-w-0 content-start gap-4 @md:grid-cols-2">
                    <Field label="Title" htmlFor={id("title")}>
                        <Input id={id("title")} {...register(`items.${index}.title`)} placeholder="Project title..." />
                    </Field>
                    <Field label="Category" htmlFor={id("category")}>
                        <Select id={id("category")} {...register(`items.${index}.category`)}>
                            <option value="design">Design</option>
                            <option value="video">Video</option>
                            <option value="software">Software</option>
                        </Select>
                    </Field>
                    <Field label="Tags" htmlFor={id("tags")}>
                        <Input id={id("tags")} {...register(`items.${index}.tags`)} placeholder="React, UI/UX, Firebase" />
                    </Field>

                    {/* Link for Software */}
                    {item?.category === 'software' && (
                        <Field label="Project URL" htmlFor={id("link")}>
                            <Input id={id("link")} {...register(`items.${index}.link`)} className="font-mono" placeholder="https://..." />
                        </Field>
                    )}

                    {/* Video Fields */}
                    {item?.category === 'video' && (
                        <>
                            <Field label="Video URL" htmlFor={id("video-url")}>
                                <Input id={id("video-url")} {...register(`items.${index}.videoUrl`)} placeholder="YouTube, Drive, etc." />
                            </Field>
                            <Field label="Embed Code" htmlFor={id("embed")}>
                                <Input id={id("embed")} {...register(`items.${index}.embedCode`)} className="font-mono" placeholder="<iframe>...</iframe>" />
                            </Field>
                        </>
                    )}

                    <Field label="Description" htmlFor={id("description")} className="@md:col-span-2">
                        <Textarea id={id("description")} {...register(`items.${index}.description`)} rows={3} placeholder="Describe the project..." />
                    </Field>
                </div>
            </div>
        </div>
    );
}
