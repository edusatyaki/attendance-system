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
        db.prepare('UPDATE users SET password = ? WHERE id = ?').run(password, session.id);
        return { success: 'Password updated successfully.' };
    } catch (error) {
        console.error('Update password error:', error);
        return { error: 'Failed to update password.' };
    }
}
