"use client";

import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { FileText } from "lucide-react";
import { ButtonLink, Card, PageHeader } from "@/components/ui";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        skills: 0,
        projects: 0,
        reviews: 0,
        users: 0
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch counts from array-based content (Site Content)
                const { getDoc, doc } = await import("firebase/firestore");

                // Helper to get array length
                const getArrayCount = async (docName: string) => {
                    const d = await getDoc(doc(db, "site_content", docName));
                    if (d.exists()) {
                        const data = d.data();
                        // Check for specific array field or default to 'items' or 'mainSkills'
                        if (docName === 'skills') return (data.mainSkills?.length || 0) + (data.techStack?.length || 0);
                        if (docName === 'projects') return data.items?.length || 0;
                    }
                    return 0;
                };

                const skillsCount = await getArrayCount("skills");
                const projectsCount = await getArrayCount("projects");

                // Fetch counts from actual collections
                let reviewCount = 0;
                let userCount = 0;
                try {
                    reviewCount = (await getCountFromServer(collection(db, "reviews"))).data().count;
                    userCount = (await getCountFromServer(collection(db, "users"))).data().count;
                } catch (err) {
                    console.error("Error fetching collection stats (reviews/users):", err);
                }

                setStats({
                    skills: skillsCount,
                    projects: projectsCount,
                    reviews: reviewCount,
                    users: userCount
                });
            } catch (e) {
                console.error("Error fetching stats", e);
            }
        }
        fetchStats();
    }, []);

    const cards = [
        { label: "Total Skills", value: stats.skills },
        { label: "Projects", value: stats.projects },
        { label: "Reviews", value: stats.reviews },
        { label: "Registered Users", value: stats.users },
    ];

    return (
        <>
            <PageHeader title="Dashboard Overview" description="A quick look at your site content and community." />

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                {cards.map((card) => (
                    <Card key={card.label}>
                        <p className="text-sm text-muted">{card.label}</p>
                        <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{card.value}</p>
                    </Card>
                ))}
            </div>

            <Card className="mt-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                        <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
                        <p className="mt-1 text-sm leading-relaxed text-muted">
                            Select a category from the sidebar to start managing your dynamic content.
                            Everything you edit will be instantly updated on the live website.
                        </p>
                    </div>
                    <ButtonLink href="/gamal-cv" external variant="secondary" className="shrink-0 self-start sm:self-auto">
                        <FileText /> View My Static CV
                    </ButtonLink>
                </div>
            </Card>
        </>
    );
}
