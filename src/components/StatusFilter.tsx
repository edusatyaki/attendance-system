'use client';

import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export default function StatusFilter() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const status = searchParams.get('status') || '';

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const term = e.target.value;
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('status', term);
        } else {
            params.delete('status');
        }
        replace(`${pathname}?${params.toString()}`);
    };

    return (
        <select
            value={status}
            onChange={handleChange}
            className="input"
            style={{ maxWidth: '150px' }}
        >
            <option value="">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
        </select>
    );
}
