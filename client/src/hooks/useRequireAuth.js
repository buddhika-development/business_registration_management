'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const PUBLIC_ROUTES = new Set([
    '/', '/AboutUs', '/ContactUs', '/NameChecker', '/Login'
]);

export function useRequireAuth() {
    const router = useRouter();
    const { status } = useAuth();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace('/');
        }
    }, [status, router]);

    return { status, PUBLIC_ROUTES };
}
