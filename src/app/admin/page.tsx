"use client";

import { useEffect, useState } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Code, Briefcase, FileText, MessageSquare, Users } from "lucide-react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        skills: 0,
        projects: 0,
        experience: 0,
        reviews: 0,
        users: 0
    });

    useEffect(() => {
        async function fetchStats() {
            try {
                // Fetch counts from array-based content (Site Content)
                const { getDoc, doc } = await import("firebase/firestore");

                // Helper to get array length
                const getArrayCount = async (docName: string, fieldName: string) => {
                    const d = await getDoc(doc(db, "site_content", docName));
                    if (d.exists()) {
                        const data = d.data();
                        // Check for specific array field or default to 'items' or 'mainSkills'
                        if (docName === 'skills') return (data.mainSkills?.length || 0) + (data.techStack?.length || 0);
                        if (docName === 'projects') return data.items?.length || 0;
                        if (docName === 'experience') return data.items?.length || 0;
                    }
                    return 0;
                };

                const skillsCount = await getArrayCount("skills", "mainSkills");
                const projectsCount = await getArrayCount("projects", "items");
                const expCount = await getArrayCount("experience", "items");

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
                    experience: expCount,
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
        { label: "Total Skills", value: stats.skills, icon: Code, color: "bg-blue-500" },
        { label: "Projects", value: stats.projects, icon: FileText, color: "bg-purple-500" },
        { label: "Experience", value: stats.experience, icon: Briefcase, color: "bg-green-500" },
        { label: "Reviews", value: stats.reviews, icon: MessageSquare, color: "bg-orange-500" },
        { label: "Registered Users", value: stats.users, icon: Users, color: "bg-pink-500" },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-4">
                            <div className={`p-4 rounded-lg ${card.color} bg-opacity-10 text-white`}>
                                <Icon className={`w-8 h-8 ${card.color.replace('bg-', 'text-')}`} />
                            </div>
                            <div>
                                <p className="text-slate-400 text-sm">{card.label}</p>
                                <p className="text-3xl font-bold text-white">{card.value}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-12 p-8 rounded-xl bg-slate-900 border border-slate-800">
                <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
                <div className="text-slate-400">
                    Select a category from the sidebar to start managing your dynamic content.
                    Everything you edit will be instantly updated on the live website.
                </div>
            </div>
        </div>
    );
}
