import db from '@/lib/db';
import { getSession } from '@/actions/auth';
import { SubmitQueryForm } from './components';

export default async function SubmitQueryPage() {
    const session = await getSession();
    if (!session) return null;

    const student = db.prepare('SELECT * FROM students WHERE id = ?').get(session.student_id) as any;

    if (!student) {
        return <div className="card">Student record not found. Please contact admin.</div>;
    }

    const courses = JSON.parse(student.course_list || '[]');

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>Submit Attendance Query</h1>
            <div className="card" style={{ maxWidth: '600px' }}>
                <SubmitQueryForm student={student} courses={courses} />
            </div>
        </div>
    );
}
