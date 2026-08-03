import Link from "next/link";
import { Briefcase, MapPin, Heart, Calendar } from "lucide-react";
import { ALLOWED_ADMINS } from "@/lib/constants";
import type { UserProfile } from "../types";
import type { User } from "firebase/auth";

interface UserProfileCardProps {
    profile: UserProfile;
    currentUser: User | null;
    profileId: string;
}

export function UserProfileCard({ profile, currentUser, profileId }: UserProfileCardProps) {
    const isOwner = currentUser && currentUser.uid === profileId;
    const isAdmin = currentUser && ALLOWED_ADMINS.includes(currentUser.email || "");

    return (
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl mb-12">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Avatar */}
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-slate-800 overflow-hidden shadow-xl bg-slate-950">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={profile.photoURL || `https://ui-avatars.com/api/?name=${profile.name}&background=0D8ABC&color=fff`}
                            alt={profile.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Info */}
                <div className="flex-1 text-center md:text-right space-y-4 pt-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{profile.name}</h1>
                        {profile.jobTitle && (
                            <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-sm font-medium border border-blue-500/20">
                                <Briefcase className="w-4 h-4" /> {profile.jobTitle}
                            </div>
                        )}
                    </div>

                    <p className="text-slate-300 leading-relaxed max-w-2xl ml-auto">
                        {profile.bio || "لا توجد نبذة شخصية بعد."}
                    </p>

                    <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 text-slate-400 text-sm pt-2">
                        {profile.location && (
                            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                <MapPin className="w-4 h-4 text-purple-400" /> {profile.location}
                            </div>
                        )}
                        {profile.socialStatus && (
                            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                                <Heart className={`w-4 h-4 ${profile.socialStatus === 'Single' ? 'text-green-400' : 'text-red-400'}`} /> {profile.socialStatus}
                            </div>
                        )}
                        <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-lg">
                            <Calendar className="w-4 h-4 text-orange-400" /> انضم {profile.createdAt ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString('ar-EG') : 'قريباً'}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-4 border-t border-slate-800 mt-4">
                        {/* Admin Dashboard Button - Only for Admins checking their own profile */}
                        {isOwner && isAdmin && (
                            <>
                                <Link
                                    href="/admin"
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    لوحة التحكم (Admin)
                                </Link>
                                <Link
                                    href="/gamal-cv"
                                    target="_blank"
                                    className="bg-slate-700 hover:bg-slate-600 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-600"
                                >
                                    السيرة الذاتية (CV)
                                </Link>
                            </>
                        )}

                        {isOwner && (
                            <>
                                <Link
                                    href="/write"
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                                >
                                    <span className="text-lg">✍️</span> كتابة مقال
                                </Link>

                                <Link
                                    href="/settings"
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                                >
                                    تعديل الملف الشخصي
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
