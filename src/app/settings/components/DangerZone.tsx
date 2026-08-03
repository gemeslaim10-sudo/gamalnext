import { AlertTriangle, Trash2 } from "lucide-react";

interface DangerZoneProps {
    handleDeleteAccount: () => void;
}

export function DangerZone({ handleDeleteAccount }: DangerZoneProps) {
    return (
        <div className="mt-12 pt-8 border-t border-red-500/20">
            <h2 className="text-xl font-bold text-red-500 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> منطقة الخطر
            </h2>
            <p className="text-slate-400 text-sm mb-6">
                بمجرد حذف حسابك، لا يمكن التراجع عن هذا الإجراء. سيتم حذف جميع بياناتك نهائياً.
            </p>
            <button
                type="button"
                onClick={handleDeleteAccount}
                className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2"
            >
                <Trash2 className="w-4 h-4" /> حذف الحساب نهائياً
            </button>
        </div>
    );
}
