"use client";

import { Settings2, ArrowLeft, Printer } from "lucide-react";
import Link from "next/link";

interface CvPreviewHeaderProps {
    onOpenSidebar: () => void;
    onPrint: () => void;
}

export function CvPreviewHeader({ onOpenSidebar, onPrint }: CvPreviewHeaderProps) {
    return (
        <div className="max-w-[210mm] mx-auto flex justify-between items-center bg-white p-4 rounded-xl shadow-sm mb-6 print:hidden">
            <div className="flex items-center gap-3">
                <button onClick={onOpenSidebar} className="md:hidden p-2 bg-gray-100 rounded-lg">
                    <Settings2 className="w-5 h-5 text-gray-700" />
                </button>
                <Link href="/admin" className="text-gray-600 hover:text-gray-900 flex items-center gap-2 font-medium">
                    <ArrowLeft className="w-5 h-5" /> Admin
                </Link>
            </div>
            <button
                onClick={onPrint}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
            >
                <Printer className="w-4 h-4" /> Print PDF
            </button>
        </div>
    );
}
