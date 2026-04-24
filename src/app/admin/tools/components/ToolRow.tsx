import { useState } from 'react';
import { Save } from 'lucide-react';
import type { ToolData } from '../types';

interface ToolRowProps {
    tool: ToolData;
    onSave: (toolData: ToolData) => void;
}

export function ToolRow({ tool, onSave }: ToolRowProps) {
    const [localTool, setLocalTool] = useState<ToolData>(tool);

    const handleChange = (field: keyof ToolData, value: any) => {
        const updated = { ...localTool, [field]: value };
        setLocalTool(updated);
        onSave(updated);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-1 space-y-4 w-full">
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Tool Name</label>
                        <input
                            value={localTool.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white"
                        />
                    </div>
                    <div className="w-1/3">
                        <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Category</label>
                        <input
                            value={localTool.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white"
                        />
                    </div>
                </div>
                <div>
                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Description</label>
                    <textarea
                        value={localTool.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-white h-20"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-3 min-w-[150px]">
                <label className="flex items-center gap-2 cursor-pointer bg-slate-950 p-2 rounded border border-slate-800">
                    <input
                        type="checkbox"
                        checked={localTool.isActive}
                        onChange={(e) => handleChange('isActive', e.target.checked)}
                        className="w-4 h-4 rounded"
                    />
                    <span className={localTool.isActive ? "text-green-400" : "text-slate-500"}>
                        {localTool.isActive ? "Active" : "Disabled"}
                    </span>
                </label>

                <button
                    onClick={() => onSave(localTool)}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors"
                >
                    <Save className="w-4 h-4" /> Save
                </button>
            </div>
        </div>
    );
}
