import db from '@/lib/db';

export default function AdminDashboard() {
    // Fetch stats
    const studentCount = db.prepare('SELECT COUNT(*) as count FROM students').get() as { count: number };
    const queryCount = db.prepare('SELECT COUNT(*) as count FROM queries').get() as { count: number };
    const pendingCount = db.prepare("SELECT COUNT(*) as count FROM queries WHERE status = 'Pending'").get() as { count: number };

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                {/* Stat Card 1 */}
                <div className="card">
                    <h3 className="label" style={{ color: 'var(--foreground)' }}>Total Students</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>{studentCount.count}</p>
                </div>

                {/* Stat Card 2 */}
                <div className="card">
                    <h3 className="label" style={{ color: 'var(--foreground)' }}>Total Queries</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--foreground)' }}>{queryCount.count}</p>
                </div>

                {/* Stat Card 3 */}
                <div className="card">
                    <h3 className="label" style={{ color: 'var(--foreground)' }}>Pending Queries</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{pendingCount.count}</p>
                </div>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--foreground)' }}>Welcome, Admin</h2>
                <p style={{ color: 'var(--foreground)' }}>
                    Use the sidebar to manage students, view queries, and check analytics.
                </p>
            </div>
        </div>
    );
}
