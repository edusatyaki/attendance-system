import db from '@/lib/db';

export default async function AdminDashboard() {
    // Fetch stats
    const studentCountRes = await db.query('SELECT COUNT(*) as count FROM students');
    const studentCount = studentCountRes.rows[0];
    const queryCountRes = await db.query('SELECT COUNT(*) as count FROM queries');
    const queryCount = queryCountRes.rows[0];
    const pendingCountRes = await db.query("SELECT COUNT(*) as count FROM queries WHERE status = 'Pending'");
    const pendingCount = pendingCountRes.rows[0];

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
