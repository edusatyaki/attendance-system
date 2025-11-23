import { getSession, logout } from '@/actions/auth';
import { redirect } from 'next/navigation';

import Sidebar from '@/components/Sidebar';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session || session.role !== 'admin') {
        redirect('/login');
    }

    const links = [
        { href: '/admin/dashboard', label: 'Dashboard' },
        { href: '/admin/students', label: 'Manage Students' },
        { href: '/admin/queries', label: 'Query Management' },
        { href: '/admin/batches', label: 'Manage Batches' },
        { href: '/admin/classes', label: 'Manage Classes' },
        { href: '/admin/analytics', label: 'Analytics' },
        { href: '/admin/profile', label: 'Profile' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar title="Admin Portal" links={links} logoutAction={logout} />

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', marginLeft: '250px', transition: 'margin-left 0.3s ease' }}>
                {children}
            </main>
        </div>
    );
}
