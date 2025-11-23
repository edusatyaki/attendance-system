'use client';

import { useActionState } from 'react';
import { updatePassword } from '@/actions/profile';

export default function ProfilePage() {
    const [state, formAction, isPending] = useActionState(updatePassword, null);

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem' }}>My Profile</h1>

            <div className="card" style={{ maxWidth: '500px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>Change Password</h2>
                <form action={formAction}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">New Password</label>
                        <input name="password" type="password" className="input" required minLength={6} />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label className="label">Confirm Password</label>
                        <input name="confirmPassword" type="password" className="input" required minLength={6} />
                    </div>

                    {state?.success && <p style={{ color: 'var(--success)', marginBottom: '1rem' }}>{state.success}</p>}
                    {state?.error && <p style={{ color: 'var(--danger)', marginBottom: '1rem' }}>{state.error}</p>}

                    <button type="submit" className="btn btn-primary" disabled={isPending}>
                        {isPending ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
