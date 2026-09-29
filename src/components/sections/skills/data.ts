import { getDocument } from "@/lib/server-utils";

// Shape of site_content/skills, edited in /admin/skills (keep in sync with src/app/admin/skills/types.ts).

export interface SkillItem {
    title: string;
    description: string;
    /** Comma separated */
    tags: string;
    /** Icon name picked in the dashboard: Code | Database | BarChart | FileText */
    icon: string;
}

export interface TechStackItem {
    name: string;
    /** e.g. "90%" */
    val: string;
}

export interface SoftwareItem {
    name: string;
    level: string;
    /** Legacy text-color class saved by the dashboard; no longer displayed */
    color?: string;
}

export interface SkillsData {
    mainSkills?: SkillItem[];
    techStack?: TechStackItem[];
    software?: SoftwareItem[];
}

/** Used only when the skills document can't be read. The real content lives in Firestore. */
export const DEFAULT_SKILLS: SkillsData = {
    mainSkills: [
        {
            title: "Business analysis",
            description: "Mapping how your company works, finding the gaps and defining the system you actually need.",
            tags: "Requirements, Process mapping, Workflows",
            icon: "BarChart",
        },
        {
            title: "ERP systems",
            description: "One system for operations, inventory, sales, purchasing and accounting, built around your processes.",
            tags: "Inventory, Sales, Purchasing, Accounting",
            icon: "Database",
        },
        {
            title: "CRM systems",
            description: "Customers, leads, deals and follow-ups in one place, so your team never loses track.",
            tags: "Leads, Sales pipeline, Follow-ups",
            icon: "FileText",
        },
        {
            title: "Websites",
            description: "Company websites and web apps built with Next.js or WordPress, fast and easy to manage.",
            tags: "Next.js, React, WordPress",
            icon: "Code",
        },
        {
            title: "Shopify themes",
            description: "Professional Shopify themes at a fraction of Shopify Theme Store prices.",
            tags: "Shopify, Liquid, Online stores",
            icon: "Code",
        },
        {
            title: "Hosting",
            description: "Hosting for your website or system, set up and looked after for you.",
            tags: "Web hosting, Domains, SSL",
            icon: "Database",
        },
    ],
    techStack: [
        { name: "React.js", val: "95%" },
        { name: "Next.js", val: "85%" },
        { name: "WordPress", val: "95%" },
        { name: "Shopify", val: "90%" },
        { name: "WhatsApp API", val: "85%" },
    ],
    software: [
        { name: "VS Code", level: "Professional" },
        { name: "WordPress", level: "Advanced" },
        { name: "Shopify", level: "Advanced" },
    ],
};

/**
 * The skills document, read on the server before the page renders (so there is no loading state).
 * A missing document or a failed read falls back to the defaults above.
 */
export async function getSkillsData(): Promise<SkillsData> {
    return (await getDocument<SkillsData>("site_content", "skills")) ?? DEFAULT_SKILLS;
}

/** The daily tools text from /admin/copy: one "name | level" per line → [{ name, level }]. */
export function parseLevelList(text: string) {
    return text
        .split("\n")
        .map((line) => {
            const [name = "", ...level] = line.split("|");
            return { name: name.trim(), level: level.join("|").trim() };
        })
        .filter((item) => item.name);
}
