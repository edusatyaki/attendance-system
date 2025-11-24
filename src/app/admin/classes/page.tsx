import db from '@/lib/db';
import { AddCourseForm, CourseList } from './components';

export default async function ClassesPage() {
    const coursesRes = await db.query('SELECT * FROM courses ORDER BY name');
    const courses = coursesRes.rows;

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>Manage Classes</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
                <AddCourseForm />
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>All Classes</h2>
                    <CourseList courses={courses} />
                </div>
            </div>
        </div>
    );
}
