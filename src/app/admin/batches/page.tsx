import db from '@/lib/db';
import { AddBatchForm, BatchList } from './components';

export default async function BatchesPage() {
    const batchesRes = await db.query('SELECT * FROM batches ORDER BY name');
    const batches = batchesRes.rows;
    const coursesRes = await db.query('SELECT * FROM courses ORDER BY name');
    const courses = coursesRes.rows;

    // Get mappings
    const mappingsRes = await db.query('SELECT * FROM batch_courses');
    const mappings = mappingsRes.rows as { batch_id: number, course_id: number }[];

    // Attach courses to batches
    const batchesWithCourses = batches.map(batch => ({
        ...batch,
        courseIds: mappings.filter(m => m.batch_id === batch.id).map(m => m.course_id)
    }));

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>Manage Batches</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <AddBatchForm />
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>All Batches</h2>
                    <BatchList batches={batchesWithCourses} allCourses={courses} />
                </div>
            </div>
        </div>
    );
}
