"use client";

import { LevelListEditor } from "../components/LevelListEditor";

export default function SoftwareEditorPage() {
    return (
        <LevelListEditor
            list="software"
            title="البرامج"
            description="البرامج اللي بتشتغل عليها ومستواك في كل واحد، وبتظهر في صفحة المهارات."
            noun="برنامج"
            empty="لسه مفيش برامج"
            levelPlaceholder="المستوى، زي Advanced"
        />
    );
}
