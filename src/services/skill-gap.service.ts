export interface SkillGapItem {
  skillName: string;
  category: string;
  importance: 'HIGH' | 'MEDIUM' | 'LOW';
  isMandatory: boolean;
  learningPriority: number; // 1 (highest) to 5
  recommendedCourses: Array<{ title: string; provider: string; url?: string; type: 'FREE' | 'PAID' }>;
  recommendedProjects: string[];
  estimatedLearningEffort: string; // e.g. "1 - 2 weeks", "3 - 4 weeks"
}

export interface SkillGapAnalysisResult {
  studentSkillCount: number;
  requiredSkillCount: number;
  matchedCount: number;
  missingCount: number;
  readinessPercentage: number;
  matchedSkills: string[];
  gaps: SkillGapItem[];
  summaryNote: string;
}

export class SkillGapService {
  private static readonly RESOURCE_DATABASE: Record<
    string,
    {
      category: string;
      courses: Array<{ title: string; provider: string; type: 'FREE' | 'PAID' }>;
      projects: string[];
      effort: string;
    }
  > = {
    react: {
      category: 'Frontend',
      courses: [
        { title: 'Official React 18+ Documentation & Tutorials', provider: 'React.dev', type: 'FREE' },
        { title: 'Full Stack Open — Modern Web Development', provider: 'University of Helsinki', type: 'FREE' },
        { title: 'The Complete React Developer Course', provider: 'Udemy / Coursera', type: 'PAID' },
      ],
      projects: ['Interactive Task & Kanban Dashboard', 'E-commerce Storefront with Cart State Management'],
      effort: '2 - 3 weeks',
    },
    typescript: {
      category: 'Frontend / Backend',
      courses: [
        { title: 'TypeScript for JavaScript Programmers', provider: 'TypeScript Official', type: 'FREE' },
        { title: 'Execute Program: Advanced TypeScript', provider: 'ExecuteProgram', type: 'PAID' },
      ],
      projects: ['Type-safe REST API Client', 'Generic Utility Library with Strict Type Checking'],
      effort: '1 - 2 weeks',
    },
    'node.js': {
      category: 'Backend',
      courses: [
        { title: 'Node.js Architecture & Event Loop Deep Dive', provider: 'Node.js Org', type: 'FREE' },
        { title: 'Backend Master Class', provider: 'YouTube / freeCodeCamp', type: 'FREE' },
      ],
      projects: ['Real-time Chat Server with WebSockets', 'File Upload & Compression Microservice'],
      effort: '2 - 3 weeks',
    },
    docker: {
      category: 'Cloud/DevOps',
      courses: [
        { title: 'Docker for Beginners Tutorial', provider: 'Docker Docs / YouTube', type: 'FREE' },
        { title: 'Docker Mastery: with Kubernetes + Swarm', provider: 'Udemy', type: 'PAID' },
      ],
      projects: ['Multi-container Web Application (Nginx + App + Postgres + Redis)', 'CI Docker Build Pipeline'],
      effort: '1 - 2 weeks',
    },
    sql: {
      category: 'Database',
      courses: [
        { title: 'SQLBolt — Interactive Lessons', provider: 'SQLBolt', type: 'FREE' },
        { title: 'PostgreSQL Tutorial & Indexing Mastery', provider: 'PostgreSQL Tutorial', type: 'FREE' },
      ],
      projects: ['Complex Analytical Query & Reporting View', 'Database Normalization & Index Benchmark'],
      effort: '1 - 2 weeks',
    },
    'system design': {
      category: 'Core CS',
      courses: [
        { title: 'System Design Primer', provider: 'GitHub Open Source (Donne Martin)', type: 'FREE' },
        { title: 'Grokking the System Design Interview', provider: 'DesignGurus', type: 'PAID' },
      ],
      projects: ['Architect High-Traffic URL Shortener', 'Distributed Cache Architecture Spec'],
      effort: '3 - 4 weeks',
    },
    python: {
      category: 'AI/ML & Backend',
      courses: [
        { title: 'Python for Everybody Specialization', provider: 'Coursera / freeCodeCamp', type: 'FREE' },
        { title: 'FastAPI Tutorial for Production APIs', provider: 'FastAPI Docs', type: 'FREE' },
      ],
      projects: ['RESTful API with Async Database Connection', 'Automated Web Scraper & Data Pipeline'],
      effort: '2 weeks',
    },
    'machine learning': {
      category: 'AI/ML',
      courses: [
        { title: 'Machine Learning Specialization', provider: 'DeepLearning.AI / Andrew Ng', type: 'FREE' },
        { title: 'Fast.ai Practical Deep Learning for Coders', provider: 'Fast.ai', type: 'FREE' },
      ],
      projects: ['Customer Churn Prediction Model with Scikit-learn', 'Image Classification Transfer Learning App'],
      effort: '4 - 6 weeks',
    },
    kubernetes: {
      category: 'Cloud/DevOps',
      courses: [
        { title: 'Kubernetes Basics Interactive Tutorial', provider: 'Kubernetes.io', type: 'FREE' },
        { title: 'Certified Kubernetes Administrator (CKA)', provider: 'Linux Foundation', type: 'PAID' },
      ],
      projects: ['Deploy Scalable Cluster with Horizontal Pod Autoscaler (HPA)', 'Ingress Controller Setup'],
      effort: '3 - 4 weeks',
    },
    'aws / cloud': {
      category: 'Cloud/DevOps',
      courses: [
        { title: 'AWS Cloud Practitioner Essentials', provider: 'AWS Skill Builder', type: 'FREE' },
        { title: 'AWS Solutions Architect Associate Course', provider: 'Coursera / Stephane Maarek', type: 'PAID' },
      ],
      projects: ['Serverless REST API with AWS Lambda & DynamoDB', 'Secure S3 Asset Pipeline with CloudFront'],
      effort: '3 - 4 weeks',
    },
  };

  public static analyze(
    studentSkills: string[],
    opportunitySkills: Array<{ name: string; isRequired?: boolean; importance?: string } | string>
  ): SkillGapAnalysisResult {
    const studentSkillSet = new Set(studentSkills.map((s) => s.toLowerCase().trim()));
    const matchedSkills: string[] = [];
    const gaps: SkillGapItem[] = [];

    const normalizedOppSkills = opportunitySkills.map((s) => {
      if (typeof s === 'string') return { name: s, isRequired: true, importance: 'HIGH' };
      return { name: s.name, isRequired: s.isRequired ?? true, importance: s.importance || 'HIGH' };
    });

    for (const sk of normalizedOppSkills) {
      const cleanName = sk.name.trim();
      const lowerName = cleanName.toLowerCase();

      if (studentSkillSet.has(lowerName)) {
        matchedSkills.push(cleanName);
      } else {
        const dbEntry = this.RESOURCE_DATABASE[lowerName] || {
          category: 'Technical Skill',
          courses: [
            { title: `${cleanName} Fundamentals & Crash Course`, provider: 'freeCodeCamp / YouTube', type: 'FREE' as const },
            { title: `Mastering ${cleanName} for Production`, provider: 'Coursera / Udemy', type: 'PAID' as const },
          ],
          projects: [`Build a complete portfolio project implementing ${cleanName}`],
          effort: '2 - 3 weeks',
        };

        const importance = (sk.importance as any) || (sk.isRequired ? 'HIGH' : 'MEDIUM');
        const learningPriority = sk.isRequired ? 1 : importance === 'HIGH' ? 2 : 3;

        gaps.push({
          skillName: cleanName,
          category: dbEntry.category,
          importance,
          isMandatory: sk.isRequired,
          learningPriority,
          recommendedCourses: dbEntry.courses,
          recommendedProjects: dbEntry.projects,
          estimatedLearningEffort: dbEntry.effort,
        });
      }
    }

    // Sort gaps by priority
    gaps.sort((a, b) => a.learningPriority - b.learningPriority);

    const totalRequired = normalizedOppSkills.length;
    const readinessPercentage = totalRequired > 0 ? Math.round((matchedSkills.length / totalRequired) * 100) : 100;

    let summaryNote = '';
    if (gaps.length === 0) {
      summaryNote = 'Outstanding! You possess 100% of the listed technical skills for this role.';
    } else if (gaps.length <= 2) {
      summaryNote = `You possess ${matchedSkills.length} out of ${totalRequired} required competencies. Closing ${gaps.length} targeted gap(s) will position you as a prime candidate.`;
    } else {
      summaryNote = `Identified ${gaps.length} skill gaps. We recommend following the structured learning milestones below to ramp up efficiently.`;
    }

    return {
      studentSkillCount: studentSkills.length,
      requiredSkillCount: totalRequired,
      matchedCount: matchedSkills.length,
      missingCount: gaps.length,
      readinessPercentage,
      matchedSkills,
      gaps,
      summaryNote,
    };
  }
}
