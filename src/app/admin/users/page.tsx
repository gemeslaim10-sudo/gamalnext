"use client";

import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Download, User } from "lucide-react";
import { CSVLink } from "react-csv";

type UserData = {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: any;
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);

    useEffect(() => {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
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
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Registered Users</h1>

                {users.length > 0 && (
                    <CSVLink
                        data={users}
                        headers={csvHeaders}
                        filename={"users_export.csv"}
                        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg flex items-center gap-2 transition-colors"
                    >
                        <Download className="w-5 h-5" /> Export CSV
                    </CSVLink>
                )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
                        <tr>
                            <th className="p-4 font-medium">User</th>
                            <th className="p-4 font-medium">Email</th>
                            <th className="p-4 font-medium">Role</th>
                            <th className="p-4 font-medium">Joined</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-800/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                                            <User className="w-4 h-4 text-slate-400" />
                                        </div>
                                        <span className="text-slate-200 font-medium">{user.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-300 font-mono text-sm">{user.email}</td>
                                <td className="p-4 text-slate-300">
                                    <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-400' : 'bg-blue-500/20 text-blue-400'
                                        }`}>
                                        {user.role || 'User'}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-400 text-sm">{user.createdAt}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && <div className="p-8 text-center text-slate-500">No registered users yet.</div>}
            </div>
        </div>
    );
}
