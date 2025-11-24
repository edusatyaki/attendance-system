import db from '@/lib/db';
import { getSession } from '@/actions/auth';

export default async function MyQueriesPage() {
    const session = await getSession();
    if (!session) return null;

    const queriesRes = await db.query('SELECT * FROM queries WHERE student_id = $1 ORDER BY created_at DESC', [session.student_id]);
    const queries = queriesRes.rows;

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>My Queries</h1>

            <div className="card table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                            <th style={{ padding: '0.75rem' }}>Issue Date</th>
                            <th style={{ padding: '0.75rem' }}>Lecture</th>
                            <th style={{ padding: '0.75rem' }}>Reason</th>
                            <th style={{ padding: '0.75rem' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {queries.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                    No queries submitted yet.
                                </td>
                            </tr>
                        ) : (
                            queries.map((query) => (
                                <tr key={query.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                    <td style={{ padding: '0.75rem' }}>
                                        {query.query_date ? new Date(query.query_date).toLocaleDateString() : '-'}
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Submitted: {new Date(query.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <div>{query.lecture_name}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{query.lecture_type}</div>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        {query.reason}
                                        {query.other_reason && <div style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>{query.other_reason}</div>}
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '999px',
                                            fontSize: '0.75rem',
                                            fontWeight: 'bold',
                                            backgroundColor: query.status === 'Approved' ? '#dcfce7' : query.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                                            color: query.status === 'Approved' ? '#166534' : query.status === 'Rejected' ? '#991b1b' : '#92400e'
                                        }}>
                                            {query.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
