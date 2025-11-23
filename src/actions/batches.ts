'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addBatch(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;

    if (!name) {
        return { error: 'Batch name is required.' };
    }

    try {
        db.prepare('INSERT INTO batches (name) VALUES (?)').run(name);
        revalidatePath('/admin/batches');
        return { success: 'Batch added successfully!' };
    } catch (error) {
        console.error('Add batch error:', error);
        return { error: 'Failed to add batch. Name might be duplicate.' };
    }
}

export async function deleteBatch(id: number) {
    try {
        db.prepare('DELETE FROM batches WHERE id = ?').run(id);
        revalidatePath('/admin/batches');
        return { success: true };
    } catch (error) {
        console.error('Delete batch error:', error);
        return { error: 'Failed to delete batch.' };
    }
}

export async function updateBatchMapping(batchId: number, courseIds: number[]) {
    try {
        // Transaction to update mapping
        const insert = db.prepare('INSERT INTO batch_courses (batch_id, course_id) VALUES (?, ?)');
        const deleteOld = db.prepare('DELETE FROM batch_courses WHERE batch_id = ?');

        db.transaction(() => {
            deleteOld.run(batchId);
            for (const courseId of courseIds) {
                insert.run(batchId, courseId);
            }
        })();

        revalidatePath('/admin/batches');
        return { success: true };
    } catch (error) {
        console.error('Update mapping error:', error);
        return { error: 'Failed to update mapping.' };
    }
}
