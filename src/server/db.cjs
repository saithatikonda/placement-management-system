const { Pool } = require('pg');

// Supabase PostgreSQL Pooler Configuration
// Primary IPv4 Pooler in ap-northeast-1 (Port 5432 session pooler or 6543 transaction pooler)
const connectionString = process.env.DATABASE_URL || 
  'postgresql://postgres.slxlvrcdpkdddeoqypyy:thatikonda%40123@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('[DB] Connected to Supabase PostgreSQL successfully!');
    
    // 1. Resumes & AI Analysis Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.resumes (
        id SERIAL PRIMARY KEY,
        roll_number VARCHAR(50) DEFAULT 'STU-2026',
        student_name VARCHAR(255) DEFAULT 'Candidate',
        cgpa NUMERIC(4, 2) DEFAULT 8.0,
        file_name VARCHAR(255) NOT NULL,
        file_size_bytes INT,
        extracted_text TEXT,
        dream_job VARCHAR(255),
        target_ctc VARCHAR(100),
        ats_score INT DEFAULT 94,
        model_used VARCHAR(100),
        analysis_result JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_resumes_roll_number ON public.resumes(roll_number);
      CREATE INDEX IF NOT EXISTS idx_resumes_created_at ON public.resumes(created_at DESC);
    `);

    // 2. Student Master Profiles Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.students (
        id SERIAL PRIMARY KEY,
        roll_number VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        branch VARCHAR(50) DEFAULT 'CSE',
        section VARCHAR(10) DEFAULT 'A',
        cgpa NUMERIC(4, 2) DEFAULT 9.42,
        backlogs INT DEFAULT 0,
        dream_status VARCHAR(100) DEFAULT 'Eligible for Super-Dream',
        current_offers INT DEFAULT 1,
        max_offers INT DEFAULT 2,
        resume_status VARCHAR(100) DEFAULT 'Verified PDF',
        skills JSONB DEFAULT '["Java", "Spring Boot", "MySQL", "REST APIs", "Git", "DSA"]'::jsonb,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 3. Campus Job Drives Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.job_drives (
        id VARCHAR(50) PRIMARY KEY,
        company VARCHAR(255) NOT NULL,
        code VARCHAR(20) NOT NULL,
        role VARCHAR(255) NOT NULL,
        ctc VARCHAR(50) NOT NULL,
        ctc_numeric NUMERIC(6, 2) DEFAULT 0,
        min_cgpa NUMERIC(4, 2) DEFAULT 7.5,
        eligible_branches JSONB DEFAULT '["CSE", "IT", "ECE"]'::jsonb,
        drive_date VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'Open',
        location VARCHAR(100) DEFAULT 'On-Campus / Hybrid',
        jd_summary TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 4. Student Applications Table (1-Click Applies)
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.applications (
        id SERIAL PRIMARY KEY,
        student_roll_number VARCHAR(50) NOT NULL,
        student_name VARCHAR(255) DEFAULT 'Candidate',
        company VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        ctc VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Applied (1-Click)',
        applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_applications_roll ON public.applications(student_roll_number);
    `);

    // 5. Shortlisted Candidates per Drive Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.candidates (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        roll_number VARCHAR(50) NOT NULL,
        branch VARCHAR(50) NOT NULL,
        section VARCHAR(10) DEFAULT 'A',
        cgpa NUMERIC(4, 2) NOT NULL,
        backlogs INT DEFAULT 0,
        drive_stage VARCHAR(100) DEFAULT 'Tech Round 1',
        resume_status VARCHAR(100) DEFAULT 'Verified PDF',
        drive_id VARCHAR(50) DEFAULT 'drive-amz-01',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // 6. KPI Placement Metrics Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.kpi_metrics (
        id SERIAL PRIMARY KEY,
        total_eligible INT DEFAULT 850,
        enrolled_students INT DEFAULT 1024,
        placed_students INT DEFAULT 612,
        placement_rate NUMERIC(5, 2) DEFAULT 72.0,
        companies_visited INT DEFAULT 48,
        highest_ctc NUMERIC(6, 2) DEFAULT 44.0,
        average_ctc NUMERIC(6, 2) DEFAULT 9.2,
        median_ctc NUMERIC(6, 2) DEFAULT 8.4,
        super_dream_count INT DEFAULT 42,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Seed essential campus recruitment drives if table is empty
    const driveCountRes = await client.query('SELECT COUNT(*)::int as count FROM public.job_drives;');
    if (driveCountRes.rows[0].count === 0) {
      await client.query(`
        INSERT INTO public.job_drives (id, company, code, role, ctc, ctc_numeric, min_cgpa, eligible_branches, drive_date, status, location, jd_summary) VALUES
        ('drive-amz-01', 'Amazon AWS', 'AMZ', 'SDE-1 (Distributed Systems)', '32.0 LPA', 32.0, 8.0, '["CSE", "IT"]'::jsonb, 'Oct 18, 2026', 'Active Registration', 'Bengaluru / Hyderabad', 'High-throughput cloud distributed storage and event architectures in Java/Go.'),
        ('drive-ora-01', 'Oracle Cloud', 'ORA', 'Member of Technical Staff', '18.0 LPA', 18.0, 7.5, '["CSE", "IT", "ECE"]'::jsonb, 'Oct 22, 2026', 'Active Registration', 'Bengaluru', 'OCI core virtual networking, telemetry pipelines and multi-tenant cloud infra.'),
        ('drive-str-01', 'Stripe India', 'STR', 'Backend Infrastructure Engineer', '34.5 LPA', 34.5, 8.5, '["CSE", "IT"]'::jsonb, 'Nov 02, 2026', 'Active Registration', 'Bengaluru / Remote', 'Global payment transaction settlement engines, ledger reliability, and Kafka pipelines.'),
        ('drive-goo-01', 'Google India', 'GOO', 'Associate AI Research Engineer', '42.0 LPA', 42.0, 8.5, '["CSE", "IT"]'::jsonb, 'Oct 25, 2026', 'Active Registration', 'Bengaluru / Hyderabad', 'Transformer model optimization, multimodal RAG systems, and TPU acceleration.'),
        ('drive-msft-01', 'Microsoft IDC', 'MSFT', 'Applied AI / LLM Scientist', '38.0 LPA', 38.0, 8.0, '["CSE", "IT", "ECE"]'::jsonb, 'Oct 29, 2026', 'Active Registration', 'Hyderabad / Noida', 'Generative AI copilot integrations, model fine-tuning and Azure cognitive services.'),
        ('drive-cisc-01', 'Cisco Systems', 'CIS', 'Full-Stack Software Engineer', '19.5 LPA', 19.5, 7.0, '["CSE", "IT", "ECE"]'::jsonb, 'Nov 04, 2026', 'Active Registration', 'Bengaluru', 'Cloud enterprise monitoring portals, React 19, TypeScript and resilient microservices.');
      `);
      console.log('[DB] Seeded default campus recruitment drives.');
    }

    // 7. Registered Authentication Users Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.auth_users (
        id SERIAL PRIMARY KEY,
        identifier VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'student',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
      CREATE INDEX IF NOT EXISTS idx_auth_users_identifier ON public.auth_users(identifier);
      CREATE INDEX IF NOT EXISTS idx_auth_users_email ON public.auth_users(email);
    `);

    // Seed default demo users if auth_users is empty
    const userCountRes = await client.query('SELECT COUNT(*)::int as count FROM public.auth_users;');
    if (userCountRes.rows[0].count === 0) {
      await client.query(`
        INSERT INTO public.auth_users (identifier, email, name, phone, password, role) VALUES
        ('22bcse104', 'sai@univ.edu.in', 'Sai Vardhan', '+91 98765 43210', 'DemoPass2026!', 'student'),
        ('tpo-admin', 'tpo@univ.edu.in', 'Placement Officer Dr. Sharma', '+91 98765 00000', 'AdminPass2026!', 'tpo'),
        ('company-hr', 'recruiter@techcorp.com', 'Campus Recruiter', '+91 98765 11111', 'CompanyPass2026!', 'company')
        ON CONFLICT (identifier) DO NOTHING;
      `);
      console.log('[DB] Seeded default demo auth users.');
    }

    console.log('[DB] Supabase tables verified.');
    return true;
  } catch (error) {
    console.error('[DB] Error initializing database:', error.message);
    throw error;
  } finally {
    client.release();
  }
}

// ==========================================
// CRUD / DATA ACCESS METHODS
// ==========================================

async function saveResumeAnalysis({
  rollNumber = 'STU-2026',
  studentName = 'Candidate',
  cgpa = 8.0,
  fileName,
  fileSizeBytes = 0,
  extractedText = '',
  dreamJob = 'Backend Engineer / Distributed Systems',
  targetCtc = '25 - 35 LPA',
  atsScore = 94,
  modelUsed = 'llama-3.1-8b',
  analysisResult = {}
}) {
  const query = `
    INSERT INTO public.resumes (
      roll_number, student_name, cgpa, file_name, file_size_bytes, extracted_text, dream_job, target_ctc, ats_score, model_used, analysis_result
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id, roll_number, student_name, file_name, ats_score, model_used, created_at;
  `;
  const values = [
    rollNumber, studentName, cgpa, fileName, fileSizeBytes, extractedText, dreamJob, targetCtc, atsScore, modelUsed, JSON.stringify(analysisResult)
  ];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function getRecentResumes(limit = 20) {
  const res = await pool.query(
    'SELECT id, roll_number, student_name, cgpa, file_name, dream_job, target_ctc, ats_score, model_used, created_at FROM public.resumes ORDER BY created_at DESC LIMIT $1;',
    [limit]
  );
  return res.rows;
}

async function getJobDrives() {
  const res = await pool.query('SELECT * FROM public.job_drives ORDER BY ctc_numeric DESC;');
  return res.rows;
}

async function createJobDrive(drive) {
  const query = `
    INSERT INTO public.job_drives (id, company, code, role, ctc, ctc_numeric, min_cgpa, eligible_branches, drive_date, status, location, jd_summary)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING *;
  `;
  const values = [
    drive.id || 'drive-' + Date.now(),
    drive.company,
    drive.code || drive.company.substring(0, 3).toUpperCase(),
    drive.role,
    drive.ctc,
    drive.ctc_numeric || parseFloat(drive.ctc) || 0,
    drive.min_cgpa || 7.0,
    JSON.stringify(drive.eligible_branches || ['CSE', 'IT']),
    drive.drive_date || 'TBD',
    drive.status || 'Open',
    drive.location || 'On-Campus',
    drive.jd_summary || ''
  ];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function createApplication({
  studentRollNumber = 'STU-2026',
  studentName = 'Candidate',
  company,
  role,
  ctc
}) {
  const query = `
    INSERT INTO public.applications (student_roll_number, student_name, company, role, ctc, status)
    VALUES ($1, $2, $3, $4, $5, 'Applied (1-Click)')
    RETURNING id, student_roll_number, company, role, ctc, status, applied_at;
  `;
  const values = [studentRollNumber, studentName, company, role, ctc];
  const res = await pool.query(query, values);
  return res.rows[0];
}

async function getApplications(studentRollNumber) {
  if (studentRollNumber) {
    const res = await pool.query('SELECT * FROM public.applications WHERE student_roll_number = $1 ORDER BY applied_at DESC;', [studentRollNumber]);
    return res.rows;
  }
  const res = await pool.query('SELECT * FROM public.applications ORDER BY applied_at DESC LIMIT 50;');
  return res.rows;
}

async function getCandidates(driveId) {
  if (driveId) {
    const res = await pool.query('SELECT * FROM public.candidates WHERE drive_id = $1 ORDER BY cgpa DESC;', [driveId]);
    return res.rows;
  }
  const res = await pool.query('SELECT * FROM public.candidates ORDER BY cgpa DESC LIMIT 50;');
  return res.rows;
}

async function getKpiMetrics() {
  try {
    const query = `
      SELECT 
        (SELECT COUNT(*)::int FROM public.students) as total_eligible,
        (SELECT COUNT(*)::int FROM public.students) as enrolled_students,
        (SELECT COUNT(DISTINCT student_roll_number)::int FROM public.applications WHERE status ILIKE '%offer%') as placed_students,
        (SELECT COUNT(*)::int FROM public.job_drives) as companies_visited,
        (SELECT COUNT(*)::int FROM public.job_drives WHERE status NOT ILIKE '%completed%') as in_progress_drives,
        (SELECT COALESCE(MAX(ctc_numeric), 0)::float FROM public.job_drives) as highest_ctc,
        (SELECT COALESCE(ROUND(AVG(ctc_numeric)::numeric, 1), 0)::float FROM public.job_drives) as average_ctc,
        (SELECT COUNT(*)::int FROM public.job_drives WHERE ctc_numeric >= 25.0) as super_dream_count;
    `;
    const res = await pool.query(query);
    const row = res.rows[0] || {};
    const total = row.total_eligible || 0;
    const placed = row.placed_students || 0;
    const rate = total > 0 ? parseFloat(((placed / total) * 100).toFixed(1)) : 0;
    return {
      totalEligible: total,
      enrolledStudents: total,
      placedStudents: placed,
      placementRate: rate,
      uniquePlaced: placed,
      companiesVisited: row.companies_visited || 0,
      inProgressDrives: row.in_progress_drives || 0,
      highestCtc: row.highest_ctc || 0,
      averageCtc: row.average_ctc || 0,
      medianCtc: row.average_ctc || 0,
      superDreamCount: row.super_dream_count || 0,
      yoyGrowth: '0%',
      cohortReadinessPercent: 0
    };
  } catch (err) {
    return {
      totalEligible: 0,
      enrolledStudents: 0,
      placedStudents: 0,
      placementRate: 0,
      companiesVisited: 0,
      inProgressDrives: 0,
      highestCtc: 0,
      averageCtc: 0,
      medianCtc: 0,
      superDreamCount: 0
    };
  }
}

async function clearAllData() {
  const client = await pool.connect();
  try {
    await client.query(`
      TRUNCATE TABLE 
        public.resumes, 
        public.applications, 
        public.candidates, 
        public.students, 
        public.job_drives, 
        public.kpi_metrics, 
        public.auth_users 
      RESTART IDENTITY CASCADE;
    `);

    // Reseed Fresh Campus Recruitment Drives
    await client.query(`
      INSERT INTO public.job_drives (id, company, code, role, ctc, ctc_numeric, min_cgpa, eligible_branches, drive_date, status, location, jd_summary) VALUES
      ('drive-amz-01', 'Amazon AWS', 'AMZ', 'SDE-1 (Distributed Systems)', '32.0 LPA', 32.0, 8.0, '["CSE", "IT"]'::jsonb, 'Oct 18, 2026', 'Active Registration', 'Bengaluru / Hyderabad', 'High-throughput cloud distributed storage and event architectures in Java/Go.'),
      ('drive-ora-01', 'Oracle Cloud', 'ORA', 'Member of Technical Staff', '18.0 LPA', 18.0, 7.5, '["CSE", "IT", "ECE"]'::jsonb, 'Oct 22, 2026', 'Active Registration', 'Bengaluru', 'OCI core virtual networking, telemetry pipelines and multi-tenant cloud infra.'),
      ('drive-str-01', 'Stripe India', 'STR', 'Backend Infrastructure Engineer', '34.5 LPA', 34.5, 8.5, '["CSE", "IT"]'::jsonb, 'Nov 02, 2026', 'Active Registration', 'Bengaluru / Remote', 'Global payment transaction settlement engines, ledger reliability, and Kafka pipelines.'),
      ('drive-goo-01', 'Google India', 'GOO', 'Associate AI Research Engineer', '42.0 LPA', 42.0, 8.5, '["CSE", "IT"]'::jsonb, 'Oct 25, 2026', 'Active Registration', 'Bengaluru / Hyderabad', 'Transformer model optimization, multimodal RAG systems, and TPU acceleration.'),
      ('drive-msft-01', 'Microsoft IDC', 'MSFT', 'Applied AI / LLM Scientist', '38.0 LPA', 38.0, 8.0, '["CSE", "IT", "ECE"]'::jsonb, 'Oct 29, 2026', 'Active Registration', 'Hyderabad / Noida', 'Generative AI copilot integrations, model fine-tuning and Azure cognitive services.'),
      ('drive-cisc-01', 'Cisco Systems', 'CIS', 'Full-Stack Software Engineer', '19.5 LPA', 19.5, 7.0, '["CSE", "IT", "ECE"]'::jsonb, 'Nov 04, 2026', 'Active Registration', 'Bengaluru', 'Cloud enterprise monitoring portals, React 19, TypeScript and resilient microservices.');
    `);

    // Reseed Fresh KPI Metrics
    await client.query(`
      INSERT INTO public.kpi_metrics (id, total_eligible, enrolled_students, placed_students, placement_rate, companies_visited, highest_ctc, average_ctc, median_ctc, super_dream_count)
      VALUES (1, 850, 1024, 612, 72.0, 48, 44.0, 9.2, 8.4, 42);
    `);

    // Reseed Fresh Default Auth Users
    await client.query(`
      INSERT INTO public.auth_users (identifier, email, name, phone, password, role) VALUES
      ('22bcse104', 'sai@univ.edu.in', 'Sai Vardhan', '+91 98765 43210', 'DemoPass2026!', 'student'),
      ('tpo-admin', 'tpo@univ.edu.in', 'Placement Officer Dr. Sharma', '+91 98765 00000', 'AdminPass2026!', 'tpo'),
      ('company-hr', 'recruiter@techcorp.com', 'Campus Recruiter', '+91 98765 11111', 'CompanyPass2026!', 'company');
    `);

    return { success: true, message: 'All database records wiped cleanly and reset to fresh seed state.' };
  } finally {
    client.release();
  }
}

async function registerUser({ identifier, email, name, phone = '', password, role = 'student' }) {
  const normId = (identifier || '').trim().toLowerCase();
  const normEmail = (email || '').trim().toLowerCase();
  const cleanPhone = (phone || '').trim();

  // 1. Check if user already exists by identifier or email
  const existingRes = await pool.query(`
    SELECT id FROM public.auth_users 
    WHERE LOWER(identifier) = $1 OR LOWER(email) = $2
    LIMIT 1;
  `, [normId, normEmail]);

  if (existingRes.rows.length > 0) {
    const existingId = existingRes.rows[0].id;
    const updateRes = await pool.query(`
      UPDATE public.auth_users SET
        identifier = $1,
        email = $2,
        name = $3,
        phone = $4,
        password = $5,
        role = $6
      WHERE id = $7
      RETURNING id, identifier, email, name, phone, role, created_at;
    `, [normId, normEmail, name, cleanPhone, password, role, existingId]);
    return updateRes.rows[0];
  }

  // 2. Insert fresh user
  const insertRes = await pool.query(`
    INSERT INTO public.auth_users (identifier, email, name, phone, password, role)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, identifier, email, name, phone, role, created_at;
  `, [normId, normEmail, name, cleanPhone, password, role]);
  return insertRes.rows[0];
}

async function getRegisteredUsersFromDb() {
  try {
    const res = await pool.query('SELECT id, identifier, email, name, phone, password, role, created_at FROM public.auth_users ORDER BY id ASC;');
    return res.rows;
  } catch (err) {
    console.warn('[DB] Failed to fetch auth users from table:', err.message);
    return [];
  }
}

async function findUserByCredentials(queryStr) {
  if (!queryStr) return null;
  const norm = (queryStr || '').trim().toLowerCase();
  const cleanNorm = norm.replace(/[^a-z0-9]/g, '');
  const phoneDigits = norm.replace(/[^0-9]/g, '');

  try {
    const res = await pool.query(`
      SELECT id, identifier, email, name, phone, password, role, created_at 
      FROM public.auth_users 
      WHERE LOWER(identifier) = $1 
         OR LOWER(email) = $1 
         OR LOWER(name) = $1
         OR ($2 <> '' AND regexp_replace(LOWER(identifier), '[^a-z0-9]', '', 'g') = $2)
         OR ($3 <> '' AND length($3) >= 7 AND regexp_replace(phone, '[^0-9]', '', 'g') LIKE '%' || $3 || '%')
      LIMIT 1;
    `, [norm, cleanNorm, phoneDigits]);
    return res.rows[0] || null;
  } catch (err) {
    console.warn('[DB] findUserByCredentials error:', err.message);
    return null;
  }
}

async function syncUsersBatch(usersList) {
  if (!Array.isArray(usersList) || usersList.length === 0) {
    return await getRegisteredUsersFromDb();
  }

  for (const u of usersList) {
    if (!u || !u.identifier || !u.password) continue;
    try {
      await registerUser({
        identifier: u.identifier,
        email: u.email || `${u.identifier}@univ.edu.in`,
        name: u.name || 'Candidate',
        phone: u.phone || '',
        password: u.password,
        role: u.role || 'student'
      });
    } catch (err) {
      console.warn('[DB] syncUsersBatch user insert error:', err.message);
    }
  }

  return await getRegisteredUsersFromDb();
}

module.exports = {
  pool,
  initDatabase,
  saveResumeAnalysis,
  getRecentResumes,
  getJobDrives,
  createJobDrive,
  createApplication,
  getApplications,
  getCandidates,
  getKpiMetrics,
  clearAllData,
  registerUser,
  getRegisteredUsersFromDb,
  findUserByCredentials,
  syncUsersBatch
};
