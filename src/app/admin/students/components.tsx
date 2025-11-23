'use client';

import { useActionState, useState } from 'react';
import { addStudent, deleteStudent, uploadStudents } from '@/actions/students';

export function AddStudentForm({ batches }: { batches: { name: string }[] }) {
    const [state, formAction, isPending] = useActionState(addStudent, null);

    return (
        <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add Student</h2>
            <form action={formAction}>
                <div style={{ marginBottom: '1rem' }}>
                    <label className="label">Enrollment No.</label>
                    <input name="enrollment" className="input" placeholder="e.g. ST123" required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label className="label">Full Name</label>
                    <input name="name" className="input" placeholder="John Doe" required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label className="label">Email</label>
                    <input name="email" type="email" className="input" placeholder="john@example.com" required />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                    <label className="label">Batch</label>
                    <select name="batch" className="input" required>
                        <option value="">Select Batch</option>
                        {batches.map(b => (
                            <option key={b.name} value={b.name}>{b.name}</option>
                        ))}
                    </select>
                </div>

                {state?.success && <p style={{ color: 'var(--success)', marginBottom: '1rem' }}>{state.success}</p>}
                {state?.error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{state.error}</p>}

                <button type="submit" className="btn btn-primary" disabled={isPending}>
                    {isPending ? 'Adding...' : 'Add Student'}
                </button>
            </form>
        </div>
    );
}

export function BulkUploadForm() {
    const [state, formAction, isPending] = useActionState(uploadStudents, null);

    return (
        <div className="card">
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Bulk Upload</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '1rem' }}>
                Upload .xlsx file with columns: Enrollment, Name, Email, Batch
            </p>
            <form action={formAction}>
                <div style={{ marginBottom: '1rem' }}>
                    <input name="file" type="file" accept=".xlsx, .xls" className="input" required />
                </div>

                {state?.success && <p style={{ color: 'var(--success)', marginBottom: '1rem' }}>{state.success}</p>}
                {state?.error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{state.error}</p>}

                <button type="submit" className="btn btn-outline" disabled={isPending}>
                    {isPending ? 'Uploading...' : 'Upload File'}
                </button>
            </form>
        </div>
    );
}

export function StudentList({ students }: { students: any[] }) {
    return (
        <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '0.75rem' }}>Enrollment</th>
                        <th style={{ padding: '0.75rem' }}>Name</th>
                        <th style={{ padding: '0.75rem' }}>Email</th>
                        <th style={{ padding: '0.75rem' }}>Batch</th>
                        <th style={{ padding: '0.75rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan={5} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                No students found.
                            </td>
                        </tr>
                    ) : (
                        students.map((student) => (
                            <tr key={student.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '0.75rem' }}>{student.id}</td>
                                <td style={{ padding: '0.75rem' }}>{student.name}</td>
                                <td style={{ padding: '0.75rem' }}>{student.email}</td>
                                <td style={{ padding: '0.75rem' }}>{student.batch}</td>
                                <td style={{ padding: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                                    <ChangePasswordButton id={student.id} />
                                    <DeleteButton id={student.id} />
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

import { updateStudentPassword } from '@/actions/students';

function ChangePasswordButton({ id }: { id: string }) {
    const [isPending, setIsPending] = useState(false);

    const handleClick = async () => {
        const newPassword = prompt('Enter new password for ' + id + ':', 'abcd@1234');
        if (!newPassword) return;

        setIsPending(true);
        const result = await updateStudentPassword(id, newPassword);
        setIsPending(false);

        if (result.error) {
            alert(result.error);
        } else {
            alert('Password updated successfully!');
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={isPending}
            style={{ color: 'var(--primary)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer' }}
        >
            {isPending ? 'Updating...' : 'Reset Pass'}
        </button>
    );
}

function DeleteButton({ id }: { id: string }) {
    const deleteWithId = async () => {
        await deleteStudent(id);
    };

    return (
        <form action={deleteWithId} onSubmit={(e) => { if (!confirm('Are you sure?')) e.preventDefault() }}>
            <button type="submit" style={{ color: 'var(--danger)', background: 'none', border: 'none', textDecoration: 'underline' }}>
                Delete
            </button>
        </form>
    );
}
