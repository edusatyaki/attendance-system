'use server';

import db from '@/lib/db';
import { getSession } from '@/actions/auth';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function submitQuery(prevState: any, formData: FormData) {
    const session = await getSession();
    if (!session) return { error: 'Not authenticated' };

    const batch = formData.get('batch') as string;
    const section = formData.get('section') as string;
    const lectureType = formData.get('lectureType') as string;
    const lectureName = formData.get('lectureName') as string;
    const date = formData.get('date') as string;
    const time = formData.get('time') as string;
    const reason = formData.get('reason') as string;
    const otherReason = formData.get('otherReason') as string;

    if (!batch || !lectureName || !reason || !date) {
        return { error: 'Please fill in all required fields.' };
    }

    try {
        db.prepare(`
      INSERT INTO queries (student_id, batch, section, lecture_type, lecture_name, query_date, query_time, reason, other_reason)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(session.student_id, batch, section, lectureType, lectureName, date, time, reason, otherReason);

        revalidatePath('/student/my-queries');
        revalidatePath('/student/dashboard');
        revalidatePath('/admin/queries');
        revalidatePath('/admin/dashboard');

        return { success: 'Query submitted successfully!' };
    } catch (error) {
        console.error('Submit query error:', error);
        return { error: 'Failed to submit query.' };
    }
}
