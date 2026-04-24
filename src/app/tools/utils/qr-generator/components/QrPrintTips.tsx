export function QrPrintTips() {
    return (
        <div className="mt-8 bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-bold text-white mb-4">📋 نصائح للطباعة بأعلى جودة</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-400">
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                    <h3 className="text-white font-bold mb-2">1. استخدم SVG دايماً</h3>
                    <p>صيغة SVG هي صيغة Vector – بتحافظ على الجودة مهما كبّرت الحجم. مثالية للبانرات والفلاير واللوحات الكبيرة.</p>
                </div>
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                    <h3 className="text-white font-bold mb-2">2. مستوى التصحيح H</h3>
                    <p>مستوى H بيسمح باستعادة 30% من البيانات. يعني لو جزء من الكود اتقطع أو اتغطى، الماسح الضوئي هيقدر يقرأه.</p>
                </div>
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800">
                    <h3 className="text-white font-bold mb-2">3. كونتراست عالي</h3>
                    <p>خلي لون الرمز غامق والخلفية فاتحة. أقوى كونتراست = أسود على أبيض. ده بيضمن قراءة سريعة من أي جهاز.</p>
                </div>
            </div>
        </div>
    );
}
