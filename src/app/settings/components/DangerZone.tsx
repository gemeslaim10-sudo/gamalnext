import { Trash2 } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useCopy } from "@/components/providers/CopyProvider";

interface DangerZoneProps {
    handleDeleteAccount: () => void;
}

export function DangerZone({ handleDeleteAccount }: DangerZoneProps) {
    const t = useCopy();
    return (
        <Card padding="lg" className="border-danger/30">
            <h2 className="text-base font-semibold text-foreground">{t("account.settingsDangerTitle")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-muted">{t("account.settingsDangerText")}</p>
            <Button variant="danger" className="mt-4" onClick={handleDeleteAccount}>
                <Trash2 />
                {t("account.settingsDeleteButton")}
            </Button>
        </Card>
    );
}
