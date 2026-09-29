"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot, limit } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Download } from "lucide-react";
import { CSVLink } from "react-csv";
import { Avatar, Badge, buttonVariants, Card, EmptyState, PageHeader } from "@/components/ui";

type UserData = {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

function RoleBadge({ role }: { role?: string }) {
    return (
        <Badge variant={role === 'admin' ? 'neutral' : 'outline'} className="capitalize">
            {role || 'User'}
        </Badge>
    );
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);

    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(50));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate().toLocaleDateString() || "N/A"
            } as UserData));
            setUsers(data);
        });
        return () => unsubscribe();
    }, []);

    const csvHeaders = [
        { label: "User ID", key: "id" },
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Role", key: "role" },
        { label: "Join Date", key: "createdAt" }
    ];

    return (
        <>
            <PageHeader
                title="Registered Users"
                description="People who signed in to the site, newest first."
                actions={
                    users.length > 0 && (
                        <CSVLink
                            data={users}
                            headers={csvHeaders}
                            filename={"users_export.csv"}
                            className={buttonVariants({ variant: "secondary", className: "w-full sm:w-auto" })}
                        >
                            <Download /> Export CSV
                        </CSVLink>
                    )
                }
            />

            {users.length === 0 ? (
                <EmptyState title="No registered users yet." />
            ) : (
                <Card padding="none" className="overflow-hidden">
                    {/* Phones: stacked rows */}
                    <ul className="divide-y divide-border md:hidden">
                        {users.map((user) => (
                            <li key={user.id} className="flex items-center gap-3 px-4 py-3">
                                <Avatar alt={user.name || "User"} size={32} />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
                                    <p className="truncate text-xs text-muted">{user.email}</p>
                                    <p className="mt-0.5 text-xs text-subtle">Joined {user.createdAt}</p>
                                </div>
                                <RoleBadge role={user.role} />
                            </li>
                        ))}
                    </ul>

                    {/* Tablets and up: table */}
                    <table className="hidden w-full text-left text-sm md:table">
                        <thead className="border-b border-border text-xs text-subtle">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-medium">User</th>
                                <th scope="col" className="px-4 py-3 font-medium">Email</th>
                                <th scope="col" className="px-4 py-3 font-medium">Role</th>
                                <th scope="col" className="px-4 py-3 font-medium">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {users.map((user) => (
                                <tr key={user.id} className="transition-colors hover:bg-surface-hover">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar alt={user.name || "User"} size={32} />
                                            <span className="font-medium text-foreground">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="break-all px-4 py-3 text-muted">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <RoleBadge role={user.role} />
                                    </td>
                                    <td className="whitespace-nowrap px-4 py-3 text-subtle">{user.createdAt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            )}
        </>
    );
}
