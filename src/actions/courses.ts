'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addCourse(prevState: any, formData: FormData) {
    const name = formData.get('name') as string;

    if (!name) {
        return { error: 'Course name is required.' };
    }

    try {
        await db.query('INSERT INTO courses (name) VALUES ($1)', [name]);
        revalidatePath('/admin/classes');
        return { success: 'Course added successfully!' };
    } catch (error) {
        console.error('Add course error:', error);
        return { error: 'Failed to add course.' };
    }
}

export async function deleteCourse(id: number) {
    try {
        await db.query('DELETE FROM courses WHERE id = $1', [id]);
        revalidatePath('/admin/classes');
        return { success: true };
    } catch (error) {
        console.error('Delete course error:', error);
        return { error: 'Failed to delete course.' };
    }
}
