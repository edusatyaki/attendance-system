import db from '@/lib/db';
import { QueryList, DownloadButton } from './components';
import SearchInput from '@/components/SearchInput';
import StatusFilter from '@/components/StatusFilter';

export default async function Page({ searchParams }: { searchParams: Promise<{ q?: string, status?: string }> }) {
    const { q, status: s } = await searchParams;
    const query = q || '';
    const status = s || '';

    let sql = `
    SELECT q.*, s.name as student_name 
    FROM queries q
    JOIN students s ON q.student_id = s.id
    WHERE (s.name ILIKE $1 OR s.id ILIKE $2)
  `;

    const params = [`%${query}%`, `%${query}%`];

    if (status) {
        sql += ` AND q.status = $3`;
        params.push(status);
    }

    sql += ` ORDER BY q.created_at DESC`;

    const queriesRes = await db.query(sql, params);
    const queries = queriesRes.rows;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>Query Management</h1>
                <DownloadButton queries={queries} />
            </div>

            <div className="card">
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <SearchInput placeholder="Search by Name or Enrollment..." />

                    {/* Status Filter - We can make this a separate component or just a simple client component if needed, 
                        but for now let's keep it simple or create a Filter component. 
                        Since I can't easily mix server/client in one file without separation, 
                        I'll use a new Client Component for the Status Filter or just let the SearchInput handle the text 
                        and keep the Status Filter as a form for now, OR better, make a unified FilterBar component.
                        
                        Actually, the user asked for "search option should be changeable while adding text".
                        I will replace the text input with SearchInput.
                        The Status dropdown currently requires a button. I should probably make it auto-submit too.
                    */}
                    <StatusFilter />
                </div>

                <QueryList queries={queries} />
            </div>
        </div>
    );
}
