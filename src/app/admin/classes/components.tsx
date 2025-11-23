'use client';

import { useActionState } from 'react';
import { addCourse, deleteCourse } from '@/actions/courses';

export function AddCourseForm() {
    const [state, formAction, isPending] = useActionState(addCourse, null);

    return (
        <div className="card" style={{ height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add New Class</h2>
            <form action={formAction}>
                <div style={{ marginBottom: '1rem' }}>
                    <label className="label">Class Name</label>
                    <input name="name" className="input" placeholder="e.g. Data Structures" required />
                </div>

                {state?.success && <p style={{ color: 'var(--success)', marginBottom: '1rem' }}>{state.success}</p>}
                {state?.error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{state.error}</p>}

                <button type="submit" className="btn btn-primary" disabled={isPending}>
                    {isPending ? 'Adding...' : 'Add Class'}
                </button>
            </form>
        </div>
    );
}

export function CourseList({ courses }: { courses: any[] }) {
    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                    <th style={{ padding: '0.75rem' }}>ID</th>
                    <th style={{ padding: '0.75rem' }}>Name</th>
                    <th style={{ padding: '0.75rem' }}>Actions</th>
                </tr>
            </thead>
            <tbody>
                {courses.length === 0 ? (
                    <tr>
                        <td colSpan={3} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-light)' }}>
                            No classes found.
                        </td>
                    </tr>
                ) : (
                    courses.map((course) => (
                        <tr key={course.id} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '0.75rem' }}>{course.id}</td>
                            <td style={{ padding: '0.75rem' }}>{course.name}</td>
                            <td style={{ padding: '0.75rem' }}>
                                <DeleteButton id={course.id} />
                            </td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}

function DeleteButton({ id }: { id: number }) {
    const deleteWithId = async () => {
        await deleteCourse(id);
    };

    return (
        <form action={deleteWithId} onSubmit={(e) => { if (!confirm('Are you sure?')) e.preventDefault() }}>
            <button type="submit" style={{ color: 'var(--danger)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}>
                Delete
            </button>
        </form>
    );
}
