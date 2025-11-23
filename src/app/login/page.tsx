'use client';

import { useActionState } from 'react';
import { login } from '@/actions/auth';

export default function LoginPage() {
    const [state, formAction, isPending] = useActionState(login, null);

    return (
        <div style={{
            display: 'flex',
            minHeight: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            // backgroundColor: 'var(--background)' // Removed to show global gradient
        }}>
            <div className="card" style={{ width: '100%', maxWidth: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                        Student Attendance System
                    </h1>
                    <p style={{ color: 'var(--text-light)', marginTop: '0.5rem' }}>
                        Sign in to your account
                    </p>
                </div>

                <form action={formAction}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="email" className="label">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="input"
                            placeholder="admin@newtonschool.co"
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="password" className="label">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="input"
                            placeholder="••••••••"
                        />
                    </div>

                    {state?.error && (
                        <div style={{
                            padding: '0.75rem',
                            backgroundColor: '#fee2e2',
                            color: '#ef4444',
                            borderRadius: '0.375rem',
                            marginBottom: '1rem',
                            fontSize: '0.875rem'
                        }}>
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                        disabled={isPending}
                    >
                        {isPending ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

            </div>
        </div>
    );
}
