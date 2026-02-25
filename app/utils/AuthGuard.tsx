'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { token } = useAuth(); // <--- Get token from Context

    useEffect(() => {
        const isProtected = pathname?.startsWith('/dashboard');
        const isGuest = pathname === '/auth/login' || pathname === '/auth/register';

        if (isProtected && !token) {
            router.replace('/auth/login');
        } else if (isGuest && token) {
            router.replace('/dashboard');
        }
    }, [pathname, token, router]);

    return <>{children}</>;
}