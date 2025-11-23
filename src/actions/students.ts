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
        const batchData = db.prepare('SELECT id FROM batches WHERE name = ?').get(batch) as { id: number };
        let courseList = '[]';

        if (batchData) {
            const courses = db.prepare(`
                SELECT c.name FROM courses c
                JOIN batch_courses bc ON c.id = bc.course_id
                WHERE bc.batch_id = ?
            `).all(batchData.id) as { name: string }[];
            courseList = JSON.stringify(courses.map(c => c.name));
        }

        // Insert into students table
        db.prepare('INSERT INTO students (id, name, email, batch, course_list) VALUES (?, ?, ?, ?, ?)').run(enrollment, name, email, batch, courseList);

        // Create user account for student (default password = abcd@1234)
        const password = 'abcd@1234';
        db.prepare('INSERT INTO users (email, password, role, student_id) VALUES (?, ?, ?, ?)').run(email, password, 'student', enrollment);

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
        db.prepare('DELETE FROM students WHERE id = ?').run(enrollment);
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

        const insertStudent = db.prepare('INSERT OR IGNORE INTO students (id, name, email, batch, course_list) VALUES (?, ?, ?, ?, ?)');
        const insertUser = db.prepare('INSERT OR IGNORE INTO users (email, password, role, student_id) VALUES (?, ?, ?, ?)');

        const transaction = db.transaction((students) => {
            for (const student of students) {
                // Expecting columns: Enrollment, Name, Email, Batch
                const enrollment = student['Enrollment'] || student['enrollment'];
                const name = student['Name'] || student['name'];
                const email = student['Email'] || student['email'];
                const batch = student['Batch'] || student['batch'];

                if (enrollment && name && email && batch) {
                    // Get mapped courses for the batch
                    const batchData = db.prepare('SELECT id FROM batches WHERE name = ?').get(batch) as { id: number };
                    let courseList = '[]';

                    if (batchData) {
                        const courses = db.prepare(`
                            SELECT c.name FROM courses c
                            JOIN batch_courses bc ON c.id = bc.course_id
                            WHERE bc.batch_id = ?
                        `).all(batchData.id) as { name: string }[];
                        courseList = JSON.stringify(courses.map(c => c.name));
                    }

                    insertStudent.run(enrollment, name, email, batch, courseList);
                    const password = 'abcd@1234';
                    insertUser.run(email, password, 'student', enrollment);
                }
            }
        });

        transaction(data);
        revalidatePath('/admin/students');
        return { success: `Processed ${data.length} records.` };
    } catch (error) {
        console.error('Upload error:', error);
        return { error: 'Failed to process file.' };
    }
}

export async function updateStudentPassword(enrollment: string, newPassword: string) {
    try {
        db.prepare('UPDATE users SET password = ? WHERE student_id = ?').run(newPassword, enrollment);
        revalidatePath('/admin/students');
        return { success: true };
    } catch (error) {
        console.error('Update password error:', error);
        return { error: 'Failed to update password.' };
    }
}
