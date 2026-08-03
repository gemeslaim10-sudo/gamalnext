export type SkillCard = {
    title: string;
    description: string;
    tags: string; 
    icon: string;
};

export type TechItem = {
    name: string;
    val: string; 
};

export type SoftwareItem = {
    name: string;
    level: string; 
    color: string; 
};

export interface SkillsForm {
    mainSkills: SkillCard[];
    techStack: TechItem[];
    software: SoftwareItem[];
}

export const defaultSkillsData: SkillsForm = {
    mainSkills: [
        { title: "تطوير الويب والـ AI", description: "بناء مواقع Full Stack باستخدام Next.js...", tags: "Next.js, React, Gemini API, Tailwind", icon: "Code" },
        { title: "تحليل البيانات", description: "إدارة قواعد بيانات معقدة...", tags: "MySQL, PostgreSQL, Data Entry", icon: "Database" }
    ],
    techStack: [
        { name: "React.js", val: "95%" },
        { name: "Next.js", val: "85%" }
    ],
    software: [
        { name: "VS Code", level: "احترافي", color: "text-green-400" }
    ]
};
