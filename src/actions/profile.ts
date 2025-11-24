'use server';

import db from '@/lib/db';
import { getSession } from '@/actions/auth';
import { revalidatePath } from 'next/cache';

export async function updatePassword(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session) return { error: 'Not authenticated' };

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
        return { error: 'Passwords do not match.' };
    }

    if (password.length < 6) {
        return { error: 'Password must be at least 6 characters.' };
    }

    try {
        await db.query('UPDATE users SET password = $1 WHERE id = $2', [password, session.id]);
        return { success: 'Password updated successfully.' };
    } catch (error) {
        console.error('Update password error:', error);
        return { error: 'Failed to update password.' };
    }
}
