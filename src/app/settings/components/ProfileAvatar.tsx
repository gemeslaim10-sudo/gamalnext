import { Camera } from "lucide-react";
import { Avatar, Button } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";

interface ProfileAvatarProps {
    photoURL: string;
    name: string;
    handlePhotoUpload: () => void;
}

/** Photo row at the top of the profile card. The new photo is stored with "Save". */
export function ProfileAvatar({ photoURL, name, handlePhotoUpload }: ProfileAvatarProps) {
    const t = useCopy();
    return (
        <div className="flex items-center gap-4 border-b border-border pb-6">
            <Avatar src={photoURL} alt={name || "Profile photo"} size={64} />
            <Button variant="secondary" onClick={handlePhotoUpload}>
                <Camera />
                {t("account.settingsChangePhoto")}
            </Button>
        </div>
    );
}
