const { parsePdfBuffer, parseBase64Pdf } = require('./pdfParser.cjs');
const { analyzeResumeWithAI } = require('./groq.cjs');
const { 
  saveResumeAnalysis, 
  getRecentResumes, 
  getJobDrives, 
  createJobDrive, 
  createApplication, 
  getApplications, 
  getCandidates, 
  getKpiMetrics, 
  clearAllData,
  pool, 
  initDatabase 
} = require('./db.cjs');

let isDbInitialized = false;
async function ensureDb() {
  if (!isDbInitialized) {
    try {
      await initDatabase();
      isDbInitialized = true;
    } catch (err) {
      console.error('[API] DB init warning:', err.message);
    }
  }
}

async function handleApiRequest(req, res) {
  await ensureDb();
  const url = new URL(req.url, `http://${req.headers.host || 'localhost:3000'}`);
  const pathname = url.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return true;
  }

  // 1. Comprehensive Database Health & Stats Endpoint
  if (pathname === '/api/db-status' && req.method === 'GET') {
    try {
      const counts = await pool.query(`
        SELECT 
          (SELECT COUNT(*)::int FROM public.resumes) as resumes,
          (SELECT COUNT(*)::int FROM public.job_drives) as drives,
          (SELECT COUNT(*)::int FROM public.applications) as applications,
          (SELECT COUNT(*)::int FROM public.students) as students,
          (SELECT COUNT(*)::int FROM public.candidates) as candidates,
          NOW() as timestamp;
      `);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        status: 'healthy',
        database: 'PostgreSQL (Supabase)',
        poolerRegion: 'ap-northeast-1',
        connected: true,
        timestamp: counts.rows[0].timestamp,
        tables: {
          resumes: counts.rows[0].resumes,
          job_drives: counts.rows[0].drives,
          applications: counts.rows[0].applications,
          students: counts.rows[0].students,
          candidates: counts.rows[0].candidates
        }
      }));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ status: 'error', message: err.message }));
    }
    return true;
  }

  // Clear All Mock / Stored Data Endpoint (POST)
  if (pathname === '/api/clear-all-data' && req.method === 'POST') {
    try {
      const result = await clearAllData();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, message: result.message }));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // 2. Campus Job Drives Endpoint (GET & POST)
  if (pathname === '/api/job-drives') {
    if (req.method === 'GET') {
      try {
        const drives = await getJobDrives();
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, drives }));
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return true;
    }

    if (req.method === 'POST') {
      try {
        const body = await parseJsonBody(req);
        const newDrive = await createJobDrive(body);
        res.statusCode = 201;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: true, drive: newDrive }));
      } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
      return true;
    }
  }

  // 3. Shortlisted Candidates Endpoint (GET)
  if (pathname === '/api/candidates' && req.method === 'GET') {
    try {
      const driveId = url.searchParams.get('driveId');
      const candidates = await getCandidates(driveId);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, candidates }));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // 4. KPI Placement Metrics Endpoint (GET)
  if (pathname === '/api/kpi-metrics' && req.method === 'GET') {
    try {
      const metrics = await getKpiMetrics();
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, metrics }));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // 5. 1-Click Job Application Endpoint (POST & GET)
  if (pathname === '/api/apply-job' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const app = await createApplication({
        studentRollNumber: body.studentRollNumber || 'STU-2026',
        studentName: body.studentName || 'Student Candidate',
        company: body.company || 'Amazon',
        role: body.role || 'Software Development Engineer',
        ctc: body.ctc || '32 LPA'
      });
      res.statusCode = 201;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, application: app }));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  if (pathname === '/api/applications' && req.method === 'GET') {
    try {
      const rollNumber = url.searchParams.get('rollNumber');
      const apps = await getApplications(rollNumber);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, applications: apps }));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // 6. Fetch Recent Resumes from PostgreSQL (GET)
  if (pathname === '/api/resumes' && req.method === 'GET') {
    try {
      const resumes = await getRecentResumes(20);
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: true, resumes }));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // 7. Parse PDF File Endpoint (POST)
  if (pathname === '/api/parse-resume' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const { base64, fileName = 'uploaded_resume.pdf' } = body;

      if (!base64) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: 'No PDF base64 data provided' }));
        return true;
      }

      console.log(`[API] Parsing uploaded PDF: ${fileName}...`);
      const parseResult = await parseBase64Pdf(base64);

      if (!parseResult.success) {
        res.statusCode = 422;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ success: false, error: parseResult.error }));
        return true;
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        fileName,
        numPages: parseResult.numPages,
        charCount: parseResult.text.length,
        extractedText: parseResult.text
      }));
    } catch (err) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  // 8. Send Extracted Resume to Groq API (Llama 3.1) and Store in PostgreSQL (POST)
  if (pathname === '/api/analyze-resume' && req.method === 'POST') {
    try {
      const body = await parseJsonBody(req);
      const {
        resumeText = '',
        fileName = 'uploaded_resume.pdf',
        dreamJob = 'Backend Engineer / Distributed Systems',
        targetCtc = '25 - 35 LPA',
        rollNumber = 'STU-2026',
        studentName = 'Student Candidate',
        cgpa = 8.5
      } = body;

      // Strict Server-Side Resume Verification
      const lower = (resumeText || '').toLowerCase();
      const lowerName = (fileName || '').toLowerCase();
      const words = lower.split(/\s+/).filter(w => w.length > 1);
      const isTooShort = words.length < 25;

      const nonResumeNameKeywords = ['theory', 'notes', 'syllabus', 'textbook', 'chapter', 'unit', 'exam', 'question', 'assignment', 'lab manual', 'cheatsheet', 'tutorial'];
      const isNonResumeName = nonResumeNameKeywords.some(kw => lowerName.includes(kw));

      const theoryMarkers = ['chapter', 'unit 1', 'module 1', 'normalization', 'acid properties', 'definition:', 'er diagram', 'relational algebra', 'table of contents'];
      const matchedTheory = theoryMarkers.filter(k => lower.includes(k)).length;

      const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
      const hasPhone = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\b[6-9]\d{9}\b/.test(resumeText);
      const hasContact = hasEmail || hasPhone || lower.includes('linkedin.com') || lower.includes('github.com');

      const nonResumeTerms = ['invoice', 'tax invoice', 'bill of supply', 'receipt voucher', 'payment receipt', 'electricity bill', 'water bill', 'rent agreement'];
      const hasNonResumeMarker = nonResumeTerms.some(term => lower.includes(term));
      const resumeKeywords = ['education', 'skills', 'experience', 'projects', 'b.tech', 'degree', 'cgpa', 'university', 'curriculum', 'internship', 'languages', 'developer'];
      const matchedCount = resumeKeywords.filter(k => lower.includes(k)).length;

      if (isTooShort || isNonResumeName || (matchedTheory >= 2 && !hasContact) || (hasNonResumeMarker && matchedCount < 3) || !hasContact) {
        res.statusCode = 422;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          isNotResume: true,
          error: `The uploaded document "${fileName}" is not a resume or is an invalid document. Please upload a genuine student resume with personal contact details, education, and technical skills.`
        }));
        return true;
      }

      console.log(`[API] Analyzing resume for ${rollNumber} (File: ${fileName}, Dream Job: ${dreamJob})...`);

      // Call Groq AI
      const aiResponse = await analyzeResumeWithAI({
        resumeText,
        fileName,
        dreamJob,
        targetCtc,
        rollNumber,
        cgpa
      });

      // If AI classification found the document to NOT be a resume:
      if (aiResponse.analysis && aiResponse.analysis.isResume === false) {
        console.warn(`[API] Groq AI rejected "${fileName}" as invalid non-resume document:`, aiResponse.analysis.error);
        res.statusCode = 422;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({
          success: false,
          isNotResume: true,
          error: aiResponse.analysis.error || 'The uploaded document is not a resume or is an invalid document.',
          documentType: aiResponse.analysis.documentType || 'Non-resume file'
        }));
        return true;
      }

      // Save to Supabase PostgreSQL
      const savedRecord = await saveResumeAnalysis({
        rollNumber,
        studentName: aiResponse.analysis.candidateName || studentName || 'Student Candidate',
        cgpa: aiResponse.analysis.detectedCgpa || cgpa,
        fileName,
        extractedText: resumeText.substring(0, 5000),
        dreamJob,
        targetCtc,
        atsScore: aiResponse.analysis.atsScore || 94,
        modelUsed: aiResponse.modelUsed,
        analysisResult: aiResponse.analysis
      });

      console.log(`[API] Analysis stored in PostgreSQL with record ID: ${savedRecord.id}`);

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        success: true,
        dbRecordId: savedRecord.id,
        modelUsed: aiResponse.modelUsed,
        analysis: aiResponse.analysis,
        savedRecord
      }));
    } catch (err) {
      console.error('[API] Analysis error:', err.message);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return true;
  }

  return false;
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 15 * 1024 * 1024) {
        req.destroy();
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(new Error('Invalid JSON body'));
      }
    });
    req.on('error', reject);
  });
}

module.exports = {
  handleApiRequest
};
