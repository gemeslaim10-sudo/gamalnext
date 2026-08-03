import { UseFormRegister, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { MultiImageUpload } from "@/components/admin/MultiImageUpload";
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
    return (
        <div className="border-t border-slate-800/60 p-4 bg-slate-950/40 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
                {/* Image & Gallery */}
                <div className="space-y-4">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Title</label>
                        <input
                            {...register(`items.${index}.title`)}
                            className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-white w-full focus:border-blue-500 outline-none transition-all text-sm"
                            placeholder="Project title..."
                        />
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Category</label>
                        <select
                            {...register(`items.${index}.category`)}
                            className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-white w-full focus:border-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer"
                        >
                            <option value="design">Design</option>
                            <option value="video">Video</option>
                            <option value="software">Software</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Tags</label>
                        <input
                            {...register(`items.${index}.tags`)}
                            className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-white w-full focus:border-blue-500 outline-none transition-all text-sm"
                            placeholder="React, UI/UX, Firebase"
                        />
                    </div>

                    {/* Link for Software */}
                    {item?.category === 'software' && (
                        <div>
                            <label className="block text-[10px] font-bold text-blue-400 mb-1 uppercase tracking-wider">Project URL</label>
                            <input
                                {...register(`items.${index}.link`)}
                                className="bg-blue-500/5 border border-blue-500/20 p-2.5 rounded-lg text-white w-full focus:border-blue-500 outline-none transition-all text-xs font-mono"
                                placeholder="https://..."
                            />
                        </div>
                    )}

                    {/* Video Fields */}
                    {item?.category === 'video' && (
                        <>
                            <div>
                                <label className="block text-[10px] font-bold text-purple-400 mb-1 uppercase tracking-wider">Video URL</label>
                                <input
                                    {...register(`items.${index}.videoUrl`)}
                                    className="bg-purple-500/5 border border-purple-500/20 p-2.5 rounded-lg text-white w-full focus:border-purple-500 outline-none transition-all text-xs"
                                    placeholder="YouTube, Drive, etc."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-purple-400 mb-1 uppercase tracking-wider">Embed Code</label>
                                <input
                                    {...register(`items.${index}.embedCode`)}
                                    className="bg-purple-500/5 border border-purple-500/20 p-2.5 rounded-lg text-white w-full focus:border-purple-500 outline-none transition-all text-[10px] font-mono"
                                    placeholder="<iframe>...</iframe>"
                                />
                            </div>
                        </>
                    )}

                    <div className="sm:col-span-2">
                        <label className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Description</label>
                        <textarea
                            {...register(`items.${index}.description`)}
                            className="bg-slate-900 border border-slate-800 p-2.5 rounded-lg text-white w-full h-16 focus:border-blue-500 outline-none transition-all resize-none text-xs leading-relaxed"
                            placeholder="Describe the project..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
