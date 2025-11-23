'use client';

import { useActionState } from 'react';
import { updatePassword } from '@/actions/profile';

export default function AdminProfilePage() {
    const [state, formAction, isPending] = useActionState(updatePassword, null);

    return (
        <div>
            <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '2rem', color: 'var(--foreground)' }}>Admin Profile</h1>

            <div className="card" style={{ maxWidth: '600px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem', color: 'var(--foreground)' }}>Change Password</h2>

                <form action={formAction}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="password" className="label">New Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={6}
                            className="input"
                            placeholder="••••••••"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="confirmPassword" className="label">Confirm New Password</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            className="input"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.error && (
                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '0.375rem', marginBottom: '1rem' }}>
                            {state.error}
                        </div>
                    )}

                    {state?.success && (
                        <div style={{ padding: '0.75rem', backgroundColor: 'rgba(34, 197, 94, 0.2)', color: '#86efac', borderRadius: '0.375rem', marginBottom: '1rem' }}>
                            {state.success}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isPending}
                    >
                        {isPending ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
