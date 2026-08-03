'use client';

import { Wrench, RefreshCw } from 'lucide-react';
import { useToolsAdmin } from './useToolsAdmin';
import { ToolRow } from './components/ToolRow';

export default function AdminToolsPage() {
    const { tools, loading, seedDatabase, debouncedSave } = useToolsAdmin();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Wrench className="text-blue-500" />
                    Manage Tools
                </h1>
                <button
                    onClick={seedDatabase}
                    className="flex items-center gap-2 bg-slate-800 text-slate-400 hover:text-white px-4 py-2 rounded-lg text-sm border border-slate-700"
                >
                    <RefreshCw className="w-4 h-4" />
                    Reset / Seed Defaults
                </button>
            </div>

            {loading ? (
                <div className="text-center text-slate-500 py-10">Loading tools...</div>
            ) : tools.length === 0 ? (
                <div className="text-center py-20 bg-slate-900 rounded-xl border border-dashed border-slate-700">
                    <p className="text-slate-400 mb-4">No tools found in database.</p>
                    <button onClick={seedDatabase} className="bg-blue-600 text-white px-6 py-2 rounded-lg">Initialize Database</button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {tools.map((tool) => (
                        <ToolRow key={tool.id} tool={tool} onSave={debouncedSave} />
                    ))}
                </div>
            )}
        </div>
    );
}
