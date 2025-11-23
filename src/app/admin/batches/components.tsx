'use client';

import { useActionState, useState } from 'react';
import { addBatch, deleteBatch, updateBatchMapping } from '@/actions/batches';

export function AddBatchForm() {
    const [state, formAction, isPending] = useActionState(addBatch, null);

    return (
        <div className="card" style={{ height: 'fit-content' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Add New Batch</h2>
            <form action={formAction}>
                <div style={{ marginBottom: '1rem' }}>
                    <label className="label">Batch Name</label>
                    <input name="name" className="input" placeholder="e.g. CS-2025" required />
                </div>

                {state?.success && <p style={{ color: 'var(--success)', marginBottom: '1rem' }}>{state.success}</p>}
                {state?.error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{state.error}</p>}

                <button type="submit" className="btn btn-primary" disabled={isPending}>
                    {isPending ? 'Adding...' : 'Add Batch'}
                </button>
            </form>
        </div>
    );
}

export function BatchList({ batches, allCourses }: { batches: any[], allCourses: any[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {batches.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>No batches found.</p>
            ) : (
                batches.map((batch) => (
                    <BatchItem key={batch.id} batch={batch} allCourses={allCourses} />
                ))
            )}
        </div>
    );
}

function BatchItem({ batch, allCourses }: { batch: any, allCourses: any[] }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedCourses, setSelectedCourses] = useState<number[]>(batch.courseIds || []);
    const [isSaving, setIsSaving] = useState(false);

    const handleToggleCourse = (courseId: number) => {
        if (selectedCourses.includes(courseId)) {
            setSelectedCourses(selectedCourses.filter(id => id !== courseId));
        } else {
            setSelectedCourses([...selectedCourses, courseId]);
        }
    };

    const handleSaveMapping = async () => {
        setIsSaving(true);
        const result = await updateBatchMapping(batch.id, selectedCourses);
        setIsSaving(false);
        if (result.success) {
            alert('Courses updated successfully!');
            setIsExpanded(false);
        } else {
            alert('Failed to update courses.');
        }
    };

    return (
        <div style={{ border: '1px solid var(--border)', borderRadius: '0.5rem', padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h3 style={{ fontWeight: 'bold' }}>{batch.name}</h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>{batch.courseIds.length} Classes Mapped</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', cursor: 'pointer', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '0.25rem' }}
                    >
                        {isExpanded ? 'Close' : 'Map Classes'}
                    </button>
                    <DeleteButton id={batch.id} />
                </div>
            </div>

            {isExpanded && (
                <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Select Classes for {batch.name}:</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
                        {allCourses.map(course => (
                            <label key={course.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedCourses.includes(course.id)}
                                    onChange={() => handleToggleCourse(course.id)}
                                />
                                {course.name}
                            </label>
                        ))}
                    </div>
                    <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                        <button
                            onClick={handleSaveMapping}
                            disabled={isSaving}
                            className="btn btn-primary"
                            style={{ fontSize: '0.875rem' }}
                        >
                            {isSaving ? 'Saving...' : 'Save Mapping'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

function DeleteButton({ id }: { id: number }) {
    const deleteWithId = async () => {
        await deleteBatch(id);
    };

    return (
        <form action={deleteWithId} onSubmit={(e) => { if (!confirm('Are you sure?')) e.preventDefault() }}>
            <button type="submit" style={{ color: 'var(--danger)', background: 'none', border: 'none', textDecoration: 'underline', cursor: 'pointer', fontSize: '0.875rem' }}>
                Delete
            </button>
        </form>
    );
}
