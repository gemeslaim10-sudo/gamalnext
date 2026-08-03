import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useBrandingContext } from '../../providers/BrandingProvider';
import { useContent } from '@/hooks/useContent';

export function useNavbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const initialBranding = useBrandingContext();
    const { data: branding } = useContent("site_content", "settings", initialBranding);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        const handleOpenAuth = () => setIsAuthModalOpen(true);
        document.addEventListener('open-auth-modal', handleOpenAuth);

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            document.removeEventListener('open-auth-modal', handleOpenAuth);
        };
    }, []);

    const isActive = (path: string) => pathname === path;

    return {
        isScrolled,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isAuthModalOpen,
        setIsAuthModalOpen,
        user,
        logout,
        isActive,
        branding
    };
}
