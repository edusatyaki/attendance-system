'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addBatch(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;

    if (!name) {
        return { error: 'Batch name is required.' };
    }

    try {
        await db.query('INSERT INTO batches (name) VALUES ($1)', [name]);
        revalidatePath('/admin/batches');
        return { success: 'Batch added successfully!' };
    } catch (error) {
        console.error('Add batch error:', error);
        return { error: 'Failed to add batch. Name might be duplicate.' };
    }
}

export async function deleteBatch(id: number) {
    try {
        await db.query('DELETE FROM batches WHERE id = $1', [id]);
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
        const client = await db.connect();
        try {
            await client.query('BEGIN');
            await client.query('DELETE FROM batch_courses WHERE batch_id = $1', [batchId]);

            for (const courseId of courseIds) {
                await client.query('INSERT INTO batch_courses (batch_id, course_id) VALUES ($1, $2)', [batchId, courseId]);
            }
            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }

        revalidatePath('/admin/batches');
        return { success: true };
    } catch (error) {
        console.error('Update mapping error:', error);
        return { error: 'Failed to update mapping.' };
    }
}
