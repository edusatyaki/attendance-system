import db from '@/lib/db';
import { AddStudentForm, BulkUploadForm, StudentList } from './components';
import SearchInput from '@/components/SearchInput';

export default async function StudentsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const query = q || '';

    // Fetch students
    // Fetch students
    const studentsRes = await db.query(`
    SELECT * FROM students 
    WHERE name ILIKE $1 OR id ILIKE $2 OR batch ILIKE $3
    ORDER BY batch, name
  `, [`%${query}%`, `%${query}%`, `%${query}%`]);
    const students = studentsRes.rows;

    // Fetch batches for the dropdown
    const batchesRes = await db.query('SELECT name FROM batches ORDER BY name');
    const batches = batchesRes.rows as { name: string }[];

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>Manage Students</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                <AddStudentForm batches={batches} />
                <BulkUploadForm />
            </div>

            <div className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--foreground)' }}>Registered Students ({students.length})</h2>
                    <SearchInput placeholder="Search students..." />
                </div>
                <StudentList students={students} />
            </div>
        </div>
    );
}
