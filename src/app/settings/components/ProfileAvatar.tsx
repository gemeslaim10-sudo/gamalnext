import { Camera } from "lucide-react";

interface ProfileAvatarProps {
    photoURL: string;
    name: string;
    handlePhotoUpload: () => void;
}

export function ProfileAvatar({ photoURL, name, handlePhotoUpload }: ProfileAvatarProps) {
    return (
        <div className="flex justify-center mb-8 relative">
            <div className="relative group cursor-pointer" onClick={handlePhotoUpload}>
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-800 bg-slate-950 shadow-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={photoURL || "https://ui-avatars.com/api/?name=" + (name || "User") + "&background=0D8ABC&color=fff"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-8 h-8 text-white" />
                </div>
            </div>
        </div>
    );
}
