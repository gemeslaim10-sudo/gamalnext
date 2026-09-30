"use client";

import { LevelListEditor } from "../components/LevelListEditor";

export default function ToolsEditorPage() {
    return (
        <LevelListEditor
            list="tools"
            title="أدوات يومية"
            description="أدوات الإنتاجية اللي بتستخدمها كل يوم، وبتظهر في صفحة المهارات."
            noun="أداة"
            empty="لسه مفيش أدوات"
            levelPlaceholder="المستوى، زي Daily"
        />
    );
}
