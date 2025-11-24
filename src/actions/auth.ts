'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import db from '@/lib/db';

const COOKIE_NAME = 'session_token';

export async function login(prevState: any, formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { error: 'Please enter both email and password.' };
    }

    try {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || user.password !== password) {
            return { error: 'Invalid email or password.' };
        }

        // In a real app, use a signed JWT or a session ID stored in DB.
        // For this playground, we'll just store the user ID and role in a simple JSON object.
        // WARNING: This is not secure for production, but fine for this demo.
        const sessionData = JSON.stringify({ id: user.id, role: user.role, email: user.email, student_id: user.student_id });

        // Set cookie
        (await cookies()).set(COOKIE_NAME, sessionData, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 1 week
            path: '/',
        });

        // Redirect based on role
        if (user.role === 'admin') {
            redirect('/admin/dashboard');
        } else {
            redirect('/student/dashboard');
        }
    } catch (error) {
        if ((error as any).message === 'NEXT_REDIRECT') {
            throw error;
        }
        console.error('Login error:', error);
        return { error: 'An unexpected error occurred.' };
    }
}

export async function logout() {
    (await cookies()).delete(COOKIE_NAME);
    redirect('/login');
}

export async function getSession() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(COOKIE_NAME);

    if (!sessionCookie) {
        return null;
    }

    try {
        return JSON.parse(sessionCookie.value);
    } catch (e) {
        return null;
    }
}
