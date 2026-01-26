'use client';

import { useEffect, useRef } from 'react';

interface RevealProps {
    children: React.ReactNode;
    className?: string;
    threshold?: number;
}

export default function Reveal({ children, className = '', threshold = 0.1 }: RevealProps) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optional: Verify progress bars if any
                    const bars = entry.target.querySelectorAll<HTMLElement>('.progress-bar');
                    bars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-width') || '0%';
                    });
                    observer.unobserve(entry.target);
                }
            },
            { threshold }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [threshold]);

    return (
        <div ref={ref} className={`reveal ${className}`}>
            {children}
        </div>
    );
}
