import db from '@/lib/db';
import { getSession } from '@/actions/auth';

export default async function StudentDashboard() {
    const session = await getSession();
    if (!session) return null;

    const totalQueriesRes = await db.query('SELECT COUNT(*) as count FROM queries WHERE student_id = $1', [session.student_id]);
    const totalQueries = totalQueriesRes.rows[0];
    const pendingQueriesRes = await db.query("SELECT COUNT(*) as count FROM queries WHERE student_id = $1 AND status = 'Pending'", [session.student_id]);
    const pendingQueries = pendingQueriesRes.rows[0];
    const approvedQueriesRes = await db.query("SELECT COUNT(*) as count FROM queries WHERE student_id = $1 AND status = 'Approved'", [session.student_id]);
    const approvedQueries = approvedQueriesRes.rows[0];

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>My Dashboard</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card">
                    <h3 className="label" style={{ color: 'var(--text-light)' }}>Total Queries</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--text)' }}>{totalQueries.count}</p>
                </div>

                <div className="card">
                    <h3 className="label" style={{ color: 'var(--text-light)' }}>Pending</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{pendingQueries.count}</p>
                </div>

                <div className="card">
                    <h3 className="label" style={{ color: 'var(--text-light)' }}>Approved</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--success)' }}>{approvedQueries.count}</p>
                </div>
            </div>

            <div className="card">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Welcome Back</h2>
                <p style={{ color: 'var(--text-light)' }}>
                    Need to report an attendance issue? Go to "Submit Query" to get started.
                </p>
            </div>
        </div>
    );
}
