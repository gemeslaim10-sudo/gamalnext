"use client";

import { useState } from "react";
import { useBrandingContext } from "@/components/providers/BrandingProvider";
import { SiteIntroCard } from "./components/owner-profile/SiteIntroCard";
import { ContactInfoCard } from "./components/owner-profile/ContactInfoCard";
import { ConnectCard } from "./components/owner-profile/ConnectCard";
import { OwnerDetailsCard } from "./components/owner-profile/OwnerDetailsCard";

export default function OwnerProfile() {
    const branding = useBrandingContext();
    const [copiedItem, setCopiedItem] = useState<string | null>(null);
    
    // Pull strictly from database via Branding Context
    const siteName = branding?.siteName || "";
    const siteDescription = branding?.siteDescription || "";
    
    const name = branding?.ownerName || "";
    const title = branding?.ownerTitle || "";
    const bio = branding?.ownerBio || "";
    const role = branding?.ownerRole || "";
    const location = branding?.ownerLocation || "";
    
    const github = branding?.githubUrl || "";
    const linkedin = branding?.linkedinUrl || "";
    const email = branding?.emailAddress || "";
    const phone = branding?.phoneDisplay || branding?.whatsappNumber || "";
    const avatar = branding?.siteLogo || ""; 

    const handleCopy = (text: string, type: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedItem(type);
        setTimeout(() => setCopiedItem(null), 2000);
    };

    return (
        <div className="space-y-5 w-full">
            <SiteIntroCard 
                siteName={siteName} 
                siteDescription={siteDescription} 
            />

            <ContactInfoCard 
                phone={phone}
                role={role}
                location={location}
                email={email}
                copiedItem={copiedItem}
                onCopy={handleCopy}
            />

            <ConnectCard 
                github={github}
                linkedin={linkedin}
            />

            <OwnerDetailsCard 
                name={name}
                avatar={avatar}
                title={title}
                bio={bio}
            />
        </div>
    );
}
