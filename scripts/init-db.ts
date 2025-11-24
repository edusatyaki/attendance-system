import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function initDb() {
    const client = await pool.connect();
    try {
        console.log('Initializing database...');

        // Users table
        await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT CHECK(role IN ('admin', 'student')) NOT NULL,
        student_id TEXT
      )
    `);

        // Students table
        await client.query(`
      CREATE TABLE IF NOT EXISTS students (
        id TEXT PRIMARY KEY, -- Enrollment No.
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        batch TEXT NOT NULL,
        course_list TEXT NOT NULL -- JSON string
      )
    `);

        // Add foreign key for users.student_id after students table exists
        // Note: In Postgres, adding FK requires ALTER TABLE if we want to be safe with ordering or circular deps, 
        // but here users depends on students, so we can add it now or via ALTER.
        // Let's just do it via ALTER to be safe if table already exists without constraint.
        // Actually, simpler to just create tables in order. 
        // But let's add the constraint if it doesn't exist? 
        // For simplicity in this script, I'll assume fresh start or idempotent.

        // Queries table
        await client.query(`
      CREATE TABLE IF NOT EXISTS queries (
        id SERIAL PRIMARY KEY,
        student_id TEXT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
        batch TEXT NOT NULL,
        section TEXT,
        lecture_type TEXT,
        lecture_name TEXT,
        query_date TEXT,
        query_time TEXT,
        reason TEXT,
        other_reason TEXT,
        status TEXT CHECK(status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Batches table
        await client.query(`
      CREATE TABLE IF NOT EXISTS batches (
        id SERIAL PRIMARY KEY,
        name TEXT UNIQUE NOT NULL
      )
    `);

        // Courses (Classes) table
        await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL
      )
    `);

        // Batch-Course Mapping
        await client.query(`
      CREATE TABLE IF NOT EXISTS batch_courses (
        batch_id INTEGER NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
        course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        PRIMARY KEY (batch_id, course_id)
      )
    `);

        // Seed initial data if empty
        const batchCountRes = await client.query('SELECT COUNT(*) as count FROM batches');
        const batchCount = parseInt(batchCountRes.rows[0].count);

        if (batchCount === 0) {
            console.log('Seeding initial data...');
            await client.query('INSERT INTO batches (name) VALUES ($1)', ['CS-2024']);

            const courses = ['Data Structures', 'Algorithms', 'Web Dev', 'Physics', 'Math', 'Electronics'];
            for (const c of courses) {
                await client.query('INSERT INTO courses (name) VALUES ($1)', [c]);
            }

            // Map CS-2024 to first 3 courses
            const csBatchRes = await client.query('SELECT id FROM batches WHERE name = $1', ['CS-2024']);
            const csBatchId = csBatchRes.rows[0].id;

            const courseIdsRes = await client.query('SELECT id FROM courses WHERE name IN ($1, $2, $3)', ['Data Structures', 'Algorithms', 'Web Dev']);

            for (const row of courseIdsRes.rows) {
                await client.query('INSERT INTO batch_courses (batch_id, course_id) VALUES ($1, $2)', [csBatchId, row.id]);
            }
        }

        // Seed default admins
        const admin1Res = await client.query('SELECT * FROM users WHERE email = $1', ['admin@newtonschool.co']);
        if (admin1Res.rowCount === 0) {
            await client.query('INSERT INTO users (email, password, role) VALUES ($1, $2, $3)', ['admin@newtonschool.co', 'admin123', 'admin']);
        }

        const admin2Res = await client.query('SELECT * FROM users WHERE email = $1', ['admin@nstschool.co']);
        if (admin2Res.rowCount === 0) {
            await client.query('INSERT INTO users (email, password, role) VALUES ($1, $2, $3)', ['admin@nstschool.co', 'admin123', 'admin']);
        }

        // Seed default student
        const studentRes = await client.query('SELECT * FROM students WHERE id = $1', ['ST001']);
        if (studentRes.rowCount === 0) {
            const courses = JSON.stringify(['Data Structures', 'Algorithms', 'Web Dev']);
            await client.query('INSERT INTO students (id, name, email, batch, course_list) VALUES ($1, $2, $3, $4, $5)', ['ST001', 'Demo Student', 'student@test.com', 'CS-2024', courses]);
            await client.query('INSERT INTO users (email, password, role, student_id) VALUES ($1, $2, $3, $4)', ['student@test.com', 'abcd@1234', 'student', 'ST001']);
        }

        // Force update all existing students to default password
        await client.query("UPDATE users SET password = 'abcd@1234' WHERE role = 'student'");

        console.log('Database initialized successfully.');
    } catch (err) {
        console.error('Error initializing database:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

initDb();
