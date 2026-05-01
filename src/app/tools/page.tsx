import { Wrench } from 'lucide-react';
import { getCollection } from '@/lib/server-utils';
import { DEFAULT_TOOLS } from './constants';
import { ToolCard } from './components/ToolCard';

export const metadata = {
    title: "Tools Center | Gamal Tech",
    alternates: {
        canonical: './',
    },
};

export const revalidate = 0; // Revalidate immediately (dynamic)

interface Tool {
    id: string;
    name: string;
    description: string;
    icon: string;
    route?: string;
    href?: string;
    isActive?: boolean;
    color?: string;
    bg?: string;
    border?: string;
    category?: string;
}

export default async function ToolsPage() {
    const dbTools = await getCollection<Tool>("tools");

    let tools: Tool[] = dbTools.length > 0 ? dbTools : (DEFAULT_TOOLS as unknown as Tool[]);

    if (dbTools.length > 0) {
        tools = tools.filter(t => t.isActive !== false);
    }

    const displayTools = tools.map((tool: Tool) => {
        const defaultVer = DEFAULT_TOOLS.find(d => d.id === tool.id);
        return {
            id: tool.id,
            name: tool.name,
            description: tool.description,
            icon: tool.icon,
            color: tool.color || defaultVer?.color || 'text-blue-400',
            bg: tool.bg || defaultVer?.bg || 'bg-blue-400/10',
            border: tool.border || defaultVer?.border || 'border-blue-400/20',
            href: tool.route || tool.href || defaultVer?.href || '#'
        };
    });

    return (
        <div>
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <Wrench className="w-8 h-8 text-blue-500" />
                    Smart Tools Center
                </h1>
                <p className="text-slate-400 text-lg">
                    A selection of tools that help you accomplish web and e-commerce development tasks efficiently.
                </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {displayTools.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} />
                ))}
            </div>
        </div>
    );
}
