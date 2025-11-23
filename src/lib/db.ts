import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'attendance.db');
const db = new Database(dbPath);

// Initialize Database
export function initDb() {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'student')) NOT NULL,
      student_id TEXT,
      FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `);

  // Students table
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id TEXT PRIMARY KEY, -- Enrollment No.
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      batch TEXT NOT NULL,
      course_list TEXT NOT NULL -- JSON string
    )
  `);

  // Queries table
  db.exec(`
    CREATE TABLE IF NOT EXISTS queries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL,
      batch TEXT NOT NULL,
      section TEXT,
      lecture_type TEXT,
      lecture_name TEXT,
      query_date TEXT,
      query_time TEXT,
      reason TEXT,
      other_reason TEXT,
      status TEXT CHECK(status IN ('Pending', 'Approved', 'Rejected')) DEFAULT 'Pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `);

  // Migration for existing DBs
  try {
    db.prepare("ALTER TABLE queries ADD COLUMN query_date TEXT").run();
  } catch (e) {
    // Column likely exists
  }

  // Batches table
  db.exec(`
    CREATE TABLE IF NOT EXISTS batches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL
    )
  `);

  // Courses (Classes) table
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  // Batch-Course Mapping
  db.exec(`
    CREATE TABLE IF NOT EXISTS batch_courses (
      batch_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      PRIMARY KEY (batch_id, course_id),
      FOREIGN KEY(batch_id) REFERENCES batches(id) ON DELETE CASCADE,
      FOREIGN KEY(course_id) REFERENCES courses(id) ON DELETE CASCADE
    )
  `);

  // Seed initial data if empty
  const batchCount = db.prepare('SELECT COUNT(*) as count FROM batches').get() as { count: number };
  if (batchCount.count === 0) {
    db.prepare('INSERT INTO batches (name) VALUES (?)').run('CS-2024');

    const courses = ['Data Structures', 'Algorithms', 'Web Dev', 'Physics', 'Math', 'Electronics'];
    const insertCourse = db.prepare('INSERT INTO courses (name) VALUES (?)');

    courses.forEach(c => insertCourse.run(c));

    // Map CS-2024 to first 3 courses
    const csBatch = db.prepare('SELECT id FROM batches WHERE name = ?').get('CS-2024') as { id: number };
    const courseIds = db.prepare('SELECT id FROM courses WHERE name IN (?, ?, ?)').all('Data Structures', 'Algorithms', 'Web Dev') as { id: number }[];

    const insertMap = db.prepare('INSERT INTO batch_courses (batch_id, course_id) VALUES (?, ?)');
    courseIds.forEach(c => insertMap.run(csBatch.id, c.id));
  }

  // Seed default admins
  const admin1 = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@newtonschool.co');
  if (!admin1) {
    db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run('admin@newtonschool.co', 'admin123', 'admin');
  }

  const admin2 = db.prepare('SELECT * FROM users WHERE email = ?').get('admin@nstschool.co');
  if (!admin2) {
    db.prepare('INSERT INTO users (email, password, role) VALUES (?, ?, ?)').run('admin@nstschool.co', 'admin123', 'admin');
  }

  // Seed default student
  const student = db.prepare('SELECT * FROM students WHERE id = ?').get('ST001');
  if (!student) {
    const courses = JSON.stringify(['Data Structures', 'Algorithms', 'Web Dev']);
    db.prepare('INSERT INTO students (id, name, email, batch, course_list) VALUES (?, ?, ?, ?, ?)').run('ST001', 'Demo Student', 'student@test.com', 'CS-2024', courses);
    db.prepare('INSERT INTO users (email, password, role, student_id) VALUES (?, ?, ?, ?)').run('student@test.com', 'abcd@1234', 'student', 'ST001');
  }

  // Force update all existing students to default password (as per user request)
  // In a real app, this would be a migration script, not here.
  db.prepare("UPDATE users SET password = 'abcd@1234' WHERE role = 'student'").run();
}

// Helper to get DB instance (singleton-ish)
// In Next.js dev mode, this might run multiple times, but better-sqlite3 handles it well enough for this scale.
initDb();

export default db;
