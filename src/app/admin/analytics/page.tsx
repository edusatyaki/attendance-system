import db from '@/lib/db';
import { AnalyticsCharts } from './components';

export default async function AnalyticsPage() {
    // Status Distribution
    const statusStatsRes = await db.query('SELECT status, COUNT(*) as count FROM queries GROUP BY status');
    const statusStats = statusStatsRes.rows;

    // Monthly Trends (Mocking month extraction for SQLite)
    // SQLite doesn't have easy month extraction without extensions, so we'll fetch all and process in JS for this scale.
    const allQueriesRes = await db.query('SELECT created_at FROM queries');
    const allQueries = allQueriesRes.rows;

    const monthlyStats = allQueries.reduce((acc, q) => {
        const month = new Date(q.created_at).toLocaleString('default', { month: 'short' });
        acc[month] = (acc[month] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>Analytics Dashboard</h1>
            <AnalyticsCharts statusStats={statusStats} monthlyStats={monthlyStats} />
        </div>
    );
}
