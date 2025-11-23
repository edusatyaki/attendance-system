import { getSession, logout } from '@/actions/auth';
import { redirect } from 'next/navigation';

import Sidebar from '@/components/Sidebar';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session || session.role !== 'student') {
        redirect('/login');
    }

    const links = [
        { href: '/student/dashboard', label: 'Dashboard' },
        { href: '/student/submit-query', label: 'Submit Query' },
        { href: '/student/my-queries', label: 'My Queries' },
        { href: '/student/profile', label: 'Profile' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar title="Student Portal" links={links} logoutAction={logout} />

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', marginLeft: '250px', transition: 'margin-left 0.3s ease' }}>
                {children}
            </main>
        </div>
    );
}
