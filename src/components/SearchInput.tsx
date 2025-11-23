'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

// Simple debounce implementation if use-debounce is not available, 
// but I will assume I can use a simple useEffect approach or install it.
// To be safe and dependency-free, I'll implement a custom hook or just logic inside.

export default function SearchInput({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const [term, setTerm] = useState(searchParams.get('q')?.toString() || '');

    // Update local state when URL changes (e.g. back button)
    useEffect(() => {
        setTerm(searchParams.get('q')?.toString() || '');
    }, [searchParams]);

    // Debounce logic
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const params = new URLSearchParams(searchParams);
            if (term) {
                params.set('q', term);
            } else {
                params.delete('q');
            }
            replace(`${pathname}?${params.toString()}`);
        }, 300); // 300ms debounce

        return () => clearTimeout(timeoutId);
    }, [term, pathname, replace, searchParams]);

    return (
        <div style={{ display: 'flex', flex: 1 }}>
            <input
                className="input"
                placeholder={placeholder}
                onChange={(e) => setTerm(e.target.value)}
                value={term}
                style={{ width: '100%', maxWidth: '300px' }}
            />
        </div>
    );
}
