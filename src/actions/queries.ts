'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function updateQueryStatus(id: number, status: 'Approved' | 'Rejected') {
    try {
        db.prepare('UPDATE queries SET status = ? WHERE id = ?').run(status, id);
        revalidatePath('/admin/queries');
        return { success: true };
    } catch (error) {
        console.error('Update status error:', error);
        return { error: 'Failed to update status.' };
    }
}
