"use client";

import { useParams } from "next/navigation";
import { ProjectEditor } from "../components/ProjectEditor";

/** `/admin/projects/0` edits the first project in the list (the order the site shows them in). */
export default function EditProjectPage() {
    const { index } = useParams<{ index: string }>();
    return <ProjectEditor index={/^\d+$/.test(index ?? "") ? Number(index) : -1} />;
}
