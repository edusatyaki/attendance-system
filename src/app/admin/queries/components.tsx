'use client';

import { updateQueryStatus } from '@/actions/queries';
import * as XLSX from 'xlsx';

export function QueryList({ queries }: { queries: any[] }) {
    return (
        <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '0.75rem' }}>Student</th>
                        <th style={{ padding: '0.75rem' }}>Batch</th>
                        <th style={{ padding: '0.75rem' }}>Lecture</th>
                        <th style={{ padding: '0.75rem' }}>Reason</th>
                        <th style={{ padding: '0.75rem' }}>Issue Date</th>
                        <th style={{ padding: '0.75rem' }}>Status</th>
                        <th style={{ padding: '0.75rem' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {queries.length === 0 ? (
                        <tr>
                            <td colSpan={7} style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-light)' }}>
                                No queries found.
                            </td>
                        </tr>
                    ) : (
                        queries.map((query) => (
                            <tr key={query.id} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '0.75rem' }}>
                                    <div>{query.student_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{query.student_id}</div>
                                </td>
                                <td style={{ padding: '0.75rem' }}>{query.batch}</td>
                                <td style={{ padding: '0.75rem' }}>
                                    <div>{query.lecture_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{query.lecture_type}</div>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    {query.reason}
                                    {query.other_reason && <div style={{ fontSize: '0.75rem', fontStyle: 'italic' }}>{query.other_reason}</div>}
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    {query.query_date ? new Date(query.query_date).toLocaleDateString() : '-'}
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Sub: {new Date(query.created_at).toLocaleDateString()}</div>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '999px',
                                        fontSize: '0.75rem',
                                        fontWeight: 'bold',
                                        backgroundColor: query.status === 'Approved' ? '#dcfce7' : query.status === 'Rejected' ? '#fee2e2' : '#fef3c7',
                                        color: query.status === 'Approved' ? '#166534' : query.status === 'Rejected' ? '#991b1b' : '#92400e'
                                    }}>
                                        {query.status}
                                    </span>
                                </td>
                                <td style={{ padding: '0.75rem' }}>
                                    {query.status === 'Pending' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <StatusButton id={query.id} status="Approved" label="Approve" color="var(--success)" />
                                            <StatusButton id={query.id} status="Rejected" label="Reject" color="var(--danger)" />
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

function StatusButton({ id, status, label, color }: { id: number, status: 'Approved' | 'Rejected', label: string, color: string }) {
    const update = async () => {
        await updateQueryStatus(id, status);
    };

    return (
        <form action={update}>
            <button type="submit" style={{ color, background: 'none', border: '1px solid ' + color, borderRadius: '0.25rem', padding: '0.25rem 0.5rem', fontSize: '0.75rem', cursor: 'pointer' }}>
                {label}
            </button>
        </form>
    );
}

export function DownloadButton({ queries }: { queries: any[] }) {
    const handleDownload = () => {
        const data = queries.map(q => ({
            ID: q.id,
            StudentName: q.student_name,
            Enrollment: q.student_id,
            Batch: q.batch,
            Lecture: q.lecture_name,
            Type: q.lecture_type,
            Reason: q.reason,
            OtherReason: q.other_reason,
            IssueDate: q.query_date,
            SubmittedDate: new Date(q.created_at).toLocaleDateString(),
            Status: q.status
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Queries");
        XLSX.writeFile(wb, "attendance_queries.xlsx");
    };

    return (
        <button onClick={handleDownload} className="btn btn-primary">
            Download Queries (XLSX)
        </button>
    );
}
