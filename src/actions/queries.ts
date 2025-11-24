'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateQueryStatus(id: number, status: 'Approved' | 'Rejected') {
    try {
        await db.query('UPDATE queries SET status = $1 WHERE id = $2', [status, id]);
        revalidatePath('/admin/queries');
        return { success: true };
    } catch (error) {
        console.error('Update status error:', error);
        return { error: 'Failed to update status.' };
    }
}
