const GROQ_API_KEY = process.env.GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Candidate models: user requested lama3.1b, with fallback to active models
const CANDIDATE_MODELS = [
  'llama-3.1-8b-instant',
  'llama-3.1-8b',
  'qwen/qwen3.8-27b',
  'openai/gpt-oss-120b'
];

async function callGroqChat(messages, preferredModel = 'llama-3.1-8b-instant') {
  const modelsToTry = [preferredModel, ...CANDIDATE_MODELS.filter(m => m !== preferredModel)];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      console.log(`[Groq] Attempting inference with model: ${model}...`);
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.2,
          max_tokens: 2000,
          response_format: { type: 'json_object' }
        })
      });

      const data = await response.json();
      if (response.ok && data.choices && data.choices[0]) {
        console.log(`[Groq] Inference successful using model: ${model}`);
        return {
          content: data.choices[0].message.content,
          modelUsed: model
        };
      }

      console.warn(`[Groq] Model ${model} returned error:`, data.error?.message || data);
      lastError = new Error(data.error?.message || `HTTP ${response.status}`);
    } catch (err) {
      console.warn(`[Groq] Network failure with ${model}:`, err.message);
      lastError = err;
    }
  }

  throw lastError || new Error('All candidate Groq models failed.');
}

async function analyzeResumeWithAI({
  resumeText,
  dreamJob = 'Backend Engineer / Distributed Systems',
  targetCtc = '25 - 35 LPA',
  rollNumber = 'STU-2026',
  cgpa = 8.5
}) {
  const systemPrompt = `You are the Principal AI Placement Intelligence Officer for an elite Engineering College Placement Management System.
Your job is to analyze the student's extracted resume PDF text, cross-reference it against active campus recruiter criteria, and provide:
1. ATS Score (0 - 100).
2. Verified Technical Skills found in the resume.
3. Top 3 Matched Job Roles with eligible on-campus companies, estimated CTC, and fit percentages.
4. Specific Skill Gap Analysis and 4-Week Preparation Roadmap tailored specifically to the student's Dream Job: "${dreamJob}" (Target: ${targetCtc}).

Respond ONLY with valid JSON following this exact schema:
{
  "atsScore": 90,
  "summary": "Brief 1-2 sentence assessment of candidate profile",
  "candidateName": "Extract Candidate Full Name from resume text (or use Candidate if not found)",
  "detectedCgpa": 8.5,
  "verifiedSkills": ["Java", "Spring Boot", "MySQL", "REST APIs", "Git", "Data Structures"],
  "matchedRoles": [
    {
      "role": "Backend Engineer / Distributed Systems",
      "matchScore": 96,
      "tag": "High Fit",
      "companies": [
        { "name": "Amazon", "ctc": "32 LPA", "driveStatus": "Drive on Oct 18", "minCgpa": 8.0 },
        { "name": "Oracle", "ctc": "18 LPA", "driveStatus": "Status: Open", "minCgpa": 7.5 }
      ]
    },
    {
      "role": "Full-Stack Web Developer",
      "matchScore": 88,
      "tag": "Strong Fit",
      "companies": [
        { "name": "Cisco", "ctc": "20 LPA", "driveStatus": "Drive on Oct 25", "minCgpa": 8.0 },
        { "name": "Cognizant (Digital)", "ctc": "9 LPA", "driveStatus": "Status: Open", "minCgpa": 7.0 }
      ]
    },
    {
      "role": "Cloud & DevOps Engineer",
      "matchScore": 74,
      "tag": "Partial Fit",
      "companies": [
        { "name": "Infosys Springboard", "ctc": "12 LPA", "driveStatus": "Registration Open", "minCgpa": 7.0 }
      ]
    }
  ],
  "dreamJobInsights": {
    "role": "${dreamJob}",
    "targetCtc": "${targetCtc}",
    "missingSkills": [
      {
        "name": "Docker & Kubernetes",
        "tag": "Containerization",
        "time": "2 weeks",
        "desc": "Containerize microservices, pod networking and cluster management",
        "checklist": [
          "Multi-stage Dockerfile builds",
          "Kubernetes deployments & services",
          "ConfigMaps and Ingress routing"
        ]
      },
      {
        "name": "Kafka / RabbitMQ",
        "tag": "Message Queues",
        "time": "1.5 weeks",
        "desc": "Event streaming, consumer offset commits and asynchronous pub/sub",
        "checklist": [
          "Kafka partition keys & consumer groups",
          "Handling Dead Letter Queues (DLQ)",
          "Design ride-sharing dispatch system"
        ]
      },
      {
        "name": "Redis In-Memory Caching",
        "tag": "Caching",
        "time": "1 week",
        "desc": "Cache-aside pattern, TTL eviction and distributed rate limiting",
        "checklist": [
          "Redis ZSET sliding window limiter",
          "Redlock distributed locking",
          "Cache stampede mitigation"
        ]
      },
      {
        "name": "High-Level System Design (HLD)",
        "tag": "Scalability",
        "time": "2 weeks",
        "desc": "Horizontal scaling, CAP theorem, database sharding and load balancers",
        "checklist": [
          "Consistent hashing & DB replication",
          "Reverse proxies vs API gateways",
          "Design TinyURL / Bitly URL shortener"
        ]
      }
    ],
    "interviewTips": [
      "Clarify Read-heavy vs. Write-heavy load ratios before designing database storage partitions.",
      "In on-campus coding rounds, always state time and space complexity before writing code."
    ],
    "weeklyRoadmap": [
      "Week 1: Core concurrency, consistent hashing and database indexing",
      "Week 2: Build a production microservice with Kafka and Redis",
      "Week 3: Mock System Design (TinyURL, Rate Limiter, Newsfeed)",
      "Week 4: Timed LeetCode Hard and bar raiser behavioral mocks"
    ]
  }
}`;

  const userPrompt = `Here is the student's resume content extracted from PDF:
---
Roll Number: ${rollNumber}
Target Dream Job: ${dreamJob}
Target CTC: ${targetCtc}

Resume Text:
${resumeText ? resumeText.substring(0, 4000) : 'Technical candidate with Core Java, Spring Boot, REST APIs, MySQL, Git, Data Structures, OOP, algorithms, CGPA 9.42.'}
---
Analyze this profile and generate the placement report JSON.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ];

  const { content, modelUsed } = await callGroqChat(messages);
  let parsedResult;
  try {
    parsedResult = JSON.parse(content);
  } catch (err) {
    console.error('[Groq] Failed to parse JSON from model output:', content);
    throw new Error('Model did not return valid JSON');
  }

  return {
    analysis: parsedResult,
    modelUsed: modelUsed
  };
}

module.exports = {
  analyzeResumeWithAI,
  callGroqChat,
  GROQ_API_KEY
};
