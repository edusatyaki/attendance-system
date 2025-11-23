'use client';

import { useActionState, useState } from 'react';
import { submitQuery } from '@/actions/student-queries';

export function SubmitQueryForm({ student, courses }: { student: any, courses: string[] }) {
    const [state, formAction, isPending] = useActionState(submitQuery, null);
    const [reason, setReason] = useState('');

    return (
        <form action={formAction}>
            <div style={{ marginBottom: '1rem' }}>
                <label className="label">Batch</label>
                <input name="batch" className="input" value={student.batch} readOnly style={{ backgroundColor: '#f1f5f9' }} />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label className="label">Section</label>
                <input name="section" className="input" placeholder="e.g. A" required />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label className="label">Lecture Type</label>
                <select name="lectureType" className="input" required>
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Lab</option>
                </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label className="label">Lecture Name</label>
                <select name="lectureName" className="input" required>
                    <option value="">Select Course</option>
                    {courses.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label className="label">Date</label>
                <input name="date" type="date" className="input" required />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label className="label">Time</label>
                <input name="time" type="time" className="input" required />
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label className="label">Reason</label>
                <select
                    name="reason"
                    className="input"
                    required
                    onChange={(e) => setReason(e.target.value)}
                >
                    <option value="">Select Reason</option>
                    <option value="Forgot to mark attendance">Forgot to mark attendance</option>
                    <option value="Device showing unknown error">Device showing unknown error</option>
                    <option value="Face not detected">Face not detected</option>
                    <option value="Other">Other</option>
                </select>
            </div>

            {reason === 'Other' && (
                <div style={{ marginBottom: '1rem' }}>
                    <label className="label">Specify Reason</label>
                    <textarea name="otherReason" className="input" rows={3} required />
                </div>
            )}

            {state?.success && <p style={{ color: 'var(--success)', marginBottom: '1rem' }}>{state.success}</p>}
            {state?.error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{state.error}</p>}

            <button type="submit" className="btn btn-primary" disabled={isPending}>
                {isPending ? 'Submitting...' : 'Submit Query'}
            </button>
        </form>
    );
}
