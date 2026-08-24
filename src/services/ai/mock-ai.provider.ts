import {
  AIProvider,
  ResumeMatchResult,
  InterviewQuestionItem,
  InterviewEvaluationResult,
  RecommendedProjectItem,
  OpportunityExplanationResult,
} from './ai.interface';

export class DeterministicMockAIProvider implements AIProvider {
  name = 'DeterministicSmartAI (Built-in Demo Fallback)';

  async matchResumeToJob(
    resumeText: string,
    jobDescription: string,
    requiredSkills: string[]
  ): Promise<ResumeMatchResult> {
    const resumeLower = resumeText.toLowerCase();
    const matchedSkills: string[] = [];
    const missingSkills: string[] = [];

    for (const skill of requiredSkills) {
      if (resumeLower.includes(skill.toLowerCase())) {
        matchedSkills.push(skill);
      } else {
        missingSkills.push(skill);
      }
    }

    const matchRatio = requiredSkills.length > 0 ? matchedSkills.length / requiredSkills.length : 0.8;
    const baseScore = Math.round(matchRatio * 75 + 15);
    const finalScore = Math.min(98, Math.max(35, baseScore));

    const keywordsPool = [
      'System Design',
      'CI/CD Pipeline',
      'Microservices',
      'Unit Testing',
      'RESTful APIs',
      'Agile/Scrum',
      'Docker Containerization',
      'Cloud Deployment (AWS/GCP)',
      'Git Version Control',
      'Performance Optimization',
      'Database Normalization',
    ];

    const suggestedKeywords = keywordsPool
      .filter((k) => !resumeLower.includes(k.toLowerCase()))
      .slice(0, 5);

    const strengths: string[] = [
      `Solid foundation demonstrated in: ${matchedSkills.slice(0, 3).join(', ') || 'Core technical concepts'}`,
      'Clean resume structure and identifiable technical skill segments',
      'Strong alignment with fundamental problem-solving principles',
    ];

    const areasForImprovement: string[] = [];
    if (missingSkills.length > 0) {
      areasForImprovement.push(`Incorporate hands-on evidence or projects demonstrating: ${missingSkills.slice(0, 3).join(', ')}`);
    }
    areasForImprovement.push('Quantify accomplishments with metrics (e.g., "improved query performance by 35%")');
    areasForImprovement.push('Ensure standard ATS-friendly heading formats (Education, Experience, Projects, Skills)');

    return {
      matchPercentage: finalScore,
      matchedSkills,
      missingSkills,
      suggestedKeywords,
      strengths,
      areasForImprovement,
      summary: `Your resume demonstrates an estimated ${finalScore}% ATS compatibility with this role. You strongly exhibit core competencies in ${matchedSkills.length} key areas. Focus on bridging the remaining skill indicators to maximize selection probability.`,
    };
  }

  async generateInterviewQuestions(
    jobRole: string,
    category: string,
    difficulty: string,
    company?: string
  ): Promise<InterviewQuestionItem[]> {
    const role = jobRole || 'Software Development Engineer';
    const comp = company || 'Tech Industry';

    const questionBank: Record<string, string[]> = {
      TECHNICAL: [
        `Explain how you would design a scalable URL shortener service handling 10,000 requests per second. What database and caching strategies would you choose?`,
        `What is the difference between concurrency and parallelism? How do you handle race conditions in multi-threaded or asynchronous environments?`,
        `Walk us through how indexing works in relational databases (B-Trees vs Hash indexes). When can an index degrade write performance?`,
        `Describe the internal lifecycle of an HTTP request from when a user types a URL to when the DOM renders on the client.`,
        `How do you optimize memory consumption and prevent memory leaks in modern frontend single-page applications?`,
      ],
      BEHAVIORAL: [
        `Tell me about a time when you faced a critical bug or blocker right before a project deadline. How did you diagnose and resolve it?`,
        `Describe a scenario where you had a technical disagreement with a team member. How did you reach an objective consensus?`,
        `Give an example of a project where requirements were ambiguous. How did you define milestones and deliver value?`,
        `Tell me about a time you failed or made a mistake in code. What was the impact and what did you learn?`,
      ],
      HR: [
        `Why are you specifically interested in working at ${comp} for the ${role} position?`,
        `Where do you see yourself technically and professionally in the next 3 years?`,
        `How do you balance high-velocity development deadlines with code quality and thorough test coverage?`,
        `What type of team culture or mentorship environment brings out your highest performance?`,
      ],
      SITUATIONAL: [
        `Imagine our production server CPU spikes to 99% during peak business hours. What is your step-by-step triage protocol?`,
        `A stakeholder asks for a major feature change 2 days before a scheduled release. How do you evaluate and communicate the tradeoffs?`,
        `You notice a security vulnerability in a third-party open-source dependency used across multiple services. How do you manage the patch rollout?`,
      ],
    };

    const targetCategory = (category === 'MIXED' ? 'TECHNICAL' : category) || 'TECHNICAL';
    const rawList = questionBank[targetCategory] || questionBank.TECHNICAL;

    return rawList.map((q, idx) => ({
      id: `q-${Date.now()}-${idx + 1}`,
      question: q,
      category: targetCategory as any,
      difficulty: (difficulty as any) || 'MEDIUM',
      expectedKeyPoints: [
        'Structured problem decomposition',
        'Clear justification of technical tradeoffs',
        'Concrete examples or STAR framework methodology',
        'Concise and professional communication',
      ],
    }));
  }

  async evaluateInterviewAnswer(
    question: string,
    category: string,
    studentAnswer: string,
    jobRole: string
  ): Promise<InterviewEvaluationResult> {
    const wordCount = studentAnswer.trim().split(/\s+/).length;

    let relevance = 75;
    let clarity = 80;
    let technical = 70;
    let communication = 78;

    if (wordCount < 15) {
      relevance = 40;
      clarity = 50;
      technical = 45;
      communication = 48;
    } else if (wordCount > 60) {
      relevance = Math.min(95, relevance + 15);
      clarity = Math.min(94, clarity + 10);
      technical = Math.min(92, technical + 15);
      communication = Math.min(96, communication + 12);
    }

    const total = Math.round((relevance + clarity + technical + communication) / 4);

    const strengths = [
      'Direct engagement with the core problem statement',
      'Articulated logical reasoning and workflow sequence',
      'Appropriate professional tone suited for engineering interviews',
    ];

    const suggestions = [
      'Use the STAR method (Situation, Task, Action, Result) to give richer context',
      'Mention specific metrics, architectural components, or benchmarking results',
      'Conclude with what you learned or how you verified the outcome',
    ];

    return {
      relevanceScore: relevance,
      clarityScore: clarity,
      technicalScore: technical,
      communicationScore: communication,
      totalScore: total,
      feedback: `Strong response! You effectively addressed the premise of the question with clear technical intent. Your answer demonstrates good comprehension of ${jobRole} standards.`,
      strengths,
      suggestions,
    };
  }

  async recommendProjects(skills: string[], targetRole?: string): Promise<RecommendedProjectItem[]> {
    const skillsList = skills.length > 0 ? skills : ['React', 'Node.js', 'PostgreSQL', 'TypeScript'];
    
    return [
      {
        title: 'Distributed Real-Time Collaborative Canvas',
        difficulty: 'ADVANCED',
        skillsUsed: skillsList.slice(0, 4),
        description: 'Build a multi-user visual whiteboard utilizing WebSockets, Operational Transformation (OT) or CRDTs for conflict-free state synchronization, with persistent state stored in PostgreSQL.',
        expectedOutcome: 'High-throughput, real-time interactive SaaS application featuring optimistic UI updates, room authentication, and exportable vector assets.',
        suggestedTechStack: 'Next.js, WebSockets / Socket.io, Node.js, Redis, PostgreSQL, Canvas API',
        resumeValue: 'High impact for Full Stack and Systems Engineering roles — demonstrates understanding of distributed state and low-latency networking.',
        learningOutcomes: [
          'Master distributed synchronization patterns (CRDTs / OT)',
          'Implement Redis Pub/Sub for cross-server message broadcasting',
          'Optimize canvas rendering performance with 60 FPS target',
        ],
      },
      {
        title: 'AI-Powered Intelligent Document Search & RAG Engine',
        difficulty: 'INTERMEDIATE',
        skillsUsed: ['Python', 'FastAPI', 'Vector DB', 'TypeScript', 'React'],
        description: 'Create an end-to-end document search engine that ingests PDFs, chunks text, generates vector embeddings, and allows natural language semantic queries with grounded citations.',
        expectedOutcome: 'Working retrieval-augmented generation web service with query caching, document categorization, and source attribution.',
        suggestedTechStack: 'FastAPI, LangChain / LlamaIndex, ChromaDB / Pinecone, React, Tailwind CSS',
        resumeValue: 'Premier standout project for AI/ML and modern backend roles.',
        learningOutcomes: [
          'Understand semantic vector embeddings and similarity metrics (Cosine similarity)',
          'Implement chunking strategies and metadata filtering',
          'Design clean API contracts and streaming responses',
        ],
      },
      {
        title: 'Automated Microservice Observability & Metrics Dashboard',
        difficulty: 'INTERMEDIATE',
        skillsUsed: ['Docker', 'Go / Node.js', 'Prometheus', 'Grafana', 'REST API'],
        description: 'Develop a lightweight monitoring sidecar that collects p99 latency, request rates, CPU/memory stats from microservices and visualizes them on real-time dashboards with anomaly alerting.',
        expectedOutcome: 'Containerized observability pipeline with threshold alert triggers via Webhooks.',
        suggestedTechStack: 'Docker, Prometheus, Grafana, Node.js/Go, Tailwind CSS',
        resumeValue: 'Demonstrates deep Cloud, DevOps, and Infrastructure proficiency.',
        learningOutcomes: [
          'Understand Golden Signals of monitoring (Latency, Traffic, Errors, Saturation)',
          'Construct Docker compose topologies with isolated networks',
          'Implement time-series data aggregation',
        ],
      },
      {
        title: 'High-Performance E-Commerce Flash Sale Engine',
        difficulty: 'BEGINNER',
        skillsUsed: ['SQL', 'Node.js', 'Express', 'Redis', 'React'],
        description: 'Build an inventory checkout engine equipped with Redis distributed locking and atomic decrements to prevent overselling during high-concurrency flash sales.',
        expectedOutcome: 'Stress-tested backend API passing concurrency tests with 1,000 simulated simultaneous purchase requests.',
        suggestedTechStack: 'Node.js, Express, Redis, PostgreSQL, React',
        resumeValue: 'Great proof of fundamental database transactions and concurrency control.',
        learningOutcomes: [
          'Understand ACID transactions and isolation levels',
          'Implement idempotency keys for payment processing',
          'Benchmark APIs using k6 or Autocannon',
        ],
      },
    ];
  }

  async explainOpportunityMatch(
    studentData: any,
    opportunityData: any
  ): Promise<OpportunityExplanationResult> {
    const studentSkills = (studentData.skills || []).map((s: any) =>
      typeof s === 'string' ? s : s.skill?.name || s.name
    );
    const requiredSkills = (opportunityData.skills || []).map((s: any) =>
      typeof s === 'string' ? s : s.skill?.name || s.name
    );

    const strongMatches = studentSkills.filter((s: string) =>
      requiredSkills.some((r: string) => r.toLowerCase() === s.toLowerCase())
    );
    const missingSkills = requiredSkills.filter(
      (r: string) => !studentSkills.some((s: string) => s.toLowerCase() === r.toLowerCase())
    );

    const eligibilityNotes: string[] = [];
    if (studentData.cgpa >= (opportunityData.minCgpa || 7.0)) {
      eligibilityNotes.push(`CGPA (${studentData.cgpa}) meets or exceeds the ${opportunityData.minCgpa || 7.0} cutoff.`);
    } else {
      eligibilityNotes.push(`CGPA (${studentData.cgpa}) is below the required ${opportunityData.minCgpa || 7.0} threshold.`);
    }

    if ((studentData.backlogs || 0) <= (opportunityData.maxBacklogsAllowed ?? 0)) {
      eligibilityNotes.push(`Backlog status satisfies policy (Max allowed: ${opportunityData.maxBacklogsAllowed ?? 0}).`);
    }

    const recommendedActions: string[] = [];
    if (missingSkills.length > 0) {
      recommendedActions.push(`Complete a crash project covering ${missingSkills.join(', ')} before the interview.`);
    }
    recommendedActions.push('Practice mock technical questions tailored for this company format.');
    recommendedActions.push('Tailor your resume headline to highlight relevant projects.');

    return {
      summary: `You have strong candidate alignment (${strongMatches.length} overlapping core skills) with ${opportunityData.company?.name || 'the hiring company'}.`,
      strongMatches: strongMatches.length > 0 ? strongMatches : ['General Academic Criteria'],
      missingSkills,
      eligibilityNotes,
      recommendedActions,
    };
  }
}
