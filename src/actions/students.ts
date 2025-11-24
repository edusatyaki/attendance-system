'use server';

import db from '@/lib/db';
import { revalidatePath } from 'next/cache';
import * as XLSX from 'xlsx';

export async function addStudent(prevState: any, formData: FormData) {
    const enrollment = formData.get('enrollment') as string;
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const batch = formData.get('batch') as string;

    try {
        // Get mapped courses for the batch
        const batchRes = await db.query('SELECT id FROM batches WHERE name = $1', [batch]);
        const batchData = batchRes.rows[0];
        let courseList = '[]';

        if (batchData) {
            const coursesRes = await db.query(`
                SELECT c.name FROM courses c
                JOIN batch_courses bc ON c.id = bc.course_id
                WHERE bc.batch_id = $1
            `, [batchData.id]);
            const courses = coursesRes.rows;
            courseList = JSON.stringify(courses.map((c: any) => c.name));
        }

        // Insert into students table
        await db.query('INSERT INTO students (id, name, email, batch, course_list) VALUES ($1, $2, $3, $4, $5)', [enrollment, name, email, batch, courseList]);

        // Create user account for student (default password = abcd@1234)
        const password = 'abcd@1234';
        await db.query('INSERT INTO users (email, password, role, student_id) VALUES ($1, $2, $3, $4)', [email, password, 'student', enrollment]);

        revalidatePath('/admin/students');
        return { success: 'Student added successfully!' };
    } catch (error) {
        console.error('Add student error:', error);
        return { error: 'Failed to add student. Enrollment or Email might already exist.' };
    }
}

export async function deleteStudent(enrollment: string) {
    try {
        // Deleting from students table will cascade delete from users and queries due to FK constraints
        await db.query('DELETE FROM students WHERE id = $1', [enrollment]);
        revalidatePath('/admin/students');
        return { success: true };
    } catch (error) {
        console.error('Delete student error:', error);
        return { error: 'Failed to delete student.' };
    }
}

export async function uploadStudents(prevState: any, formData: FormData) {
    const file = formData.get('file') as File;

    if (!file) {
        return { error: 'No file uploaded.' };
    }

    try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet) as any[];

        const client = await db.connect();
        try {
            await client.query('BEGIN');

            for (const student of data) {
                // Expecting columns: Enrollment, Name, Email, Batch
                const enrollment = student['Enrollment'] || student['enrollment'];
                const name = student['Name'] || student['name'];
                const email = student['Email'] || student['email'];
                const batch = student['Batch'] || student['batch'];

                if (enrollment && name && email && batch) {
                    // Get mapped courses for the batch
                    const batchRes = await client.query('SELECT id FROM batches WHERE name = $1', [batch]);
                    const batchData = batchRes.rows[0];
                    let courseList = '[]';

                    if (batchData) {
                        const coursesRes = await client.query(`
                            SELECT c.name FROM courses c
                            JOIN batch_courses bc ON c.id = bc.course_id
                            WHERE bc.batch_id = $1
                        `, [batchData.id]);
                        const courses = coursesRes.rows;
                        courseList = JSON.stringify(courses.map((c: any) => c.name));
                    }

                    await client.query('INSERT INTO students (id, name, email, batch, course_list) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING', [enrollment, name, email, batch, courseList]);
                    const password = 'abcd@1234';
                    await client.query('INSERT INTO users (email, password, role, student_id) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING', [email, password, 'student', enrollment]);
                }
            }

            await client.query('COMMIT');
        } catch (e) {
            await client.query('ROLLBACK');
            throw e;
        } finally {
            client.release();
        }
        revalidatePath('/admin/students');
        return { success: `Processed ${data.length} records.` };
    } catch (error) {
        console.error('Upload error:', error);
        return { error: 'Failed to process file.' };
    }
}

export async function updateStudentPassword(enrollment: string, newPassword: string) {
    try {
        await db.query('UPDATE users SET password = $1 WHERE student_id = $2', [newPassword, enrollment]);
        revalidatePath('/admin/students');
        return { success: true };
    } catch (error) {
        console.error('Update password error:', error);
        return { error: 'Failed to update password.' };
    }
}
