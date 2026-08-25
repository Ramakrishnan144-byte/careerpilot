import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function seedDatabase(client?: PrismaClient) {
  const db = client || prisma;
  console.log('🚀 Starting CareerPilot Database Seeding...');

  const passwordHash = await bcrypt.hash('password123', 10);

  // 1. Seed Departments (Idempotent upsert)
  console.log('📦 Seeding Departments...');
  const departmentsData = [
    { code: 'CSE', name: 'Computer Science & Engineering', description: 'Computing, Software Systems, AI & Algorithms' },
    { code: 'IT', name: 'Information Technology', description: 'Information Infrastructure, Cloud, Web Technologies' },
    { code: 'AI_DS', name: 'Artificial Intelligence & Data Science', description: 'Machine Learning, Deep Learning, Big Data' },
    { code: 'ECE', name: 'Electronics & Communication Engineering', description: 'Signal Processing, VLSI, Embedded Systems, IoT' },
    { code: 'EE', name: 'Electrical Engineering', description: 'Power Systems, Control Engineering, Renewable Energy' },
    { code: 'ME', name: 'Mechanical Engineering', description: 'Robotics, Thermal, Fluid Mechanics, CAD/CAM' },
    { code: 'CIVIL', name: 'Civil Engineering', description: 'Structural Engineering, Urban Planning' },
    { code: 'MBA', name: 'School of Management Studies', description: 'Business Analytics, Product Management, Marketing' },
  ];

  const depts: Record<string, any> = {};
  for (const dept of departmentsData) {
    const created = await db.department.upsert({
      where: { code: dept.code },
      update: { name: dept.name, description: dept.description },
      create: dept,
    });
    depts[dept.code] = created;
  }

  // 2. Seed Skills (Idempotent upsert)
  console.log('📦 Seeding Skills...');
  const skillsData = [
    // Frontend
    { name: 'React', category: 'Frontend' },
    { name: 'Next.js', category: 'Frontend' },
    { name: 'TypeScript', category: 'Frontend' },
    { name: 'JavaScript', category: 'Frontend' },
    { name: 'Tailwind CSS', category: 'Frontend' },
    { name: 'HTML5/CSS3', category: 'Frontend' },
    { name: 'Vue.js', category: 'Frontend' },
    { name: 'Angular', category: 'Frontend' },
    // Backend
    { name: 'Node.js', category: 'Backend' },
    { name: 'Express.js', category: 'Backend' },
    { name: 'Python', category: 'Backend' },
    { name: 'FastAPI', category: 'Backend' },
    { name: 'Java', category: 'Backend' },
    { name: 'Spring Boot', category: 'Backend' },
    { name: 'C++', category: 'Backend' },
    { name: 'Go (Golang)', category: 'Backend' },
    { name: 'C# / .NET', category: 'Backend' },
    // Database
    { name: 'PostgreSQL', category: 'Database' },
    { name: 'MongoDB', category: 'Database' },
    { name: 'Redis', category: 'Database' },
    { name: 'MySQL', category: 'Database' },
    { name: 'SQL', category: 'Database' },
    // Cloud & DevOps
    { name: 'Docker', category: 'Cloud/DevOps' },
    { name: 'Kubernetes', category: 'Cloud/DevOps' },
    { name: 'AWS (Amazon Web Services)', category: 'Cloud/DevOps' },
    { name: 'GCP (Google Cloud Platform)', category: 'Cloud/DevOps' },
    { name: 'CI/CD Pipelines', category: 'Cloud/DevOps' },
    { name: 'Linux/Unix', category: 'Cloud/DevOps' },
    // AI / ML
    { name: 'Machine Learning', category: 'AI/ML' },
    { name: 'Deep Learning', category: 'AI/ML' },
    { name: 'PyTorch', category: 'AI/ML' },
    { name: 'TensorFlow', category: 'AI/ML' },
    { name: 'NLP (Natural Language Processing)', category: 'AI/ML' },
    { name: 'Computer Vision', category: 'AI/ML' },
    { name: 'Pandas & NumPy', category: 'AI/ML' },
    // Core CS & Systems
    { name: 'Data Structures & Algorithms', category: 'Core CS' },
    { name: 'System Design', category: 'Core CS' },
    { name: 'Object-Oriented Programming (OOP)', category: 'Core CS' },
    { name: 'Computer Networks', category: 'Core CS' },
    { name: 'Operating Systems', category: 'Core CS' },
    { name: 'DBMS', category: 'Core CS' },
    // Hardware & IoT
    { name: 'Embedded Systems', category: 'Hardware/IoT' },
    { name: 'Arduino / Raspberry Pi', category: 'Hardware/IoT' },
    { name: 'IoT Architecture', category: 'Hardware/IoT' },
    // Soft Skills
    { name: 'Problem Solving', category: 'Soft Skills' },
    { name: 'Technical Communication', category: 'Soft Skills' },
    { name: 'Agile / Scrum', category: 'Soft Skills' },
    { name: 'Git & GitHub', category: 'Developer Tools' },
  ];

  const skillsMap: Record<string, any> = {};
  for (const s of skillsData) {
    const created = await db.skill.upsert({
      where: { name: s.name },
      update: { category: s.category },
      create: s,
    });
    skillsMap[s.name] = created;
  }

  // 3. Seed Companies (10+ Companies)
  console.log('🏢 Seeding Companies...');
  const companiesData = [
    {
      name: 'Google',
      slug: 'google',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=128&auto=format&fit=crop&q=80',
      website: 'https://careers.google.com',
      location: 'Bangalore / Hyderabad, India',
      industry: 'Internet, Cloud, AI',
      tier: 'SUPER_DREAM',
      description: 'Global technology leader organizing world information with search, cloud computing, and frontier AI.',
    },
    {
      name: 'Microsoft',
      slug: 'microsoft',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80',
      website: 'https://careers.microsoft.com',
      location: 'Hyderabad / Bangalore / Noida, India',
      industry: 'Enterprise Software & Cloud',
      tier: 'SUPER_DREAM',
      description: 'Empowering every person and organization on the planet to achieve more through Azure, Office, and AI.',
    },
    {
      name: 'Amazon',
      slug: 'amazon',
      logo: 'https://images.unsplash.com/photo-1523474253246-72dc9ade3ee0?w=128&auto=format&fit=crop&q=80',
      website: 'https://amazon.jobs',
      location: 'Bangalore / Hyderabad / Chennai',
      industry: 'E-commerce & Cloud Services',
      tier: 'SUPER_DREAM',
      description: "Earth's most customer-centric company pioneering global e-commerce, AWS cloud, and logistics.",
    },
    {
      name: 'Tata Consultancy Services (TCS)',
      slug: 'tcs',
      logo: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=128&auto=format&fit=crop&q=80',
      website: 'https://www.tcs.com/careers',
      location: 'Pan India (Mumbai, Pune, Bangalore, Chennai, Kolkata)',
      industry: 'IT Services & Consulting',
      tier: 'TIER_1',
      description: 'Leading global IT services, consulting and business solutions organization.',
    },
    {
      name: 'Infosys',
      slug: 'infosys',
      logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=128&auto=format&fit=crop&q=80',
      website: 'https://www.infosys.com/careers',
      location: 'Bangalore / Mysore / Pune / Hyderabad',
      industry: 'Digital Services & Consulting',
      tier: 'TIER_1',
      description: 'Global leader in next-generation digital services and consulting navigating enterprise digital transformations.',
    },
    {
      name: 'Deloitte',
      slug: 'deloitte',
      logo: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=128&auto=format&fit=crop&q=80',
      website: 'https://www2.deloitte.com/careers',
      location: 'Hyderabad / Bangalore / Mumbai / Gurgaon',
      industry: 'Management Consulting & Technology Advisory',
      tier: 'DREAM',
      description: 'Multinational professional services network providing audit, consulting, financial advisory, and risk analytics.',
    },
    {
      name: 'Uber',
      slug: 'uber',
      logo: 'https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=128&auto=format&fit=crop&q=80',
      website: 'https://uber.com/careers',
      location: 'Bangalore / Hyderabad',
      industry: 'Mobility & Distributed Tech',
      tier: 'SUPER_DREAM',
      description: 'Reimagining the way the world moves for the better with high-scale real-time matching algorithms.',
    },
    {
      name: 'Stripe',
      slug: 'stripe',
      logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=128&auto=format&fit=crop&q=80',
      website: 'https://stripe.com/jobs',
      location: 'Bangalore / Remote',
      industry: 'Financial Infrastructure',
      tier: 'SUPER_DREAM',
      description: 'Financial infrastructure for the internet millions of companies use to accept payments and grow revenue.',
    },
    {
      name: 'Atlassian',
      slug: 'atlassian',
      logo: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=128&auto=format&fit=crop&q=80',
      website: 'https://atlassian.com/careers',
      location: 'Bangalore / Remote Work Anywhere',
      industry: 'Collaboration Software',
      tier: 'DREAM',
      description: 'Creators of Jira, Confluence, and Trello powering software team velocity globally.',
    },
    {
      name: 'Razorpay',
      slug: 'razorpay',
      logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=128&auto=format&fit=crop&q=80',
      website: 'https://razorpay.com/jobs',
      location: 'Bangalore, India',
      industry: 'FinTech & Neo-Banking',
      tier: 'DREAM',
      description: "India's leading full-stack financial solutions company revolutionizing digital payments.",
    },
  ];

  const companies: Record<string, any> = {};
  for (const comp of companiesData) {
    const created = await db.company.upsert({
      where: { slug: comp.slug },
      update: comp,
      create: comp,
    });
    companies[comp.slug] = created;
  }

  // 4. Seed Opportunities
  console.log('💼 Seeding Opportunities...');
  const now = new Date();
  const makeDate = (daysFromNow: number) => new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);

  const opportunitiesData = [
    {
      companySlug: 'google',
      title: 'Software Development Engineer (SDE I)',
      jobRole: 'Software Engineer',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Bangalore / Hyderabad',
      description: 'Join our core engineering teams building scalable cloud infrastructure, distributed search pipelines, and developer tooling.',
      responsibilities: 'Write maintainable production code, design scalable microservices, participate in architectural design reviews, and optimize system performance.',
      salaryPackage: '32 - 40 LPA (Base + Stocks + Bonus)',
      minCgpa: 8.0,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE',
      applicationDeadline: makeDate(12),
      assessmentDate: makeDate(16),
      interviewStartDate: makeDate(22),
      selectionProcess: '1. Online Coding Assessment (2 LeetCode Medium/Hard) -> 2. Technical Round 1 (Data Structures) -> 3. Technical Round 2 (System Design & Concurrency) -> 4. Googleyness & Leadership Round',
      skills: [
        { name: 'Data Structures & Algorithms', isRequired: true, importance: 'HIGH' },
        { name: 'C++', isRequired: false, importance: 'HIGH' },
        { name: 'Java', isRequired: false, importance: 'HIGH' },
        { name: 'Python', isRequired: false, importance: 'HIGH' },
        { name: 'System Design', isRequired: true, importance: 'HIGH' },
        { name: 'Operating Systems', isRequired: true, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'google',
      title: 'Software Engineering Summer Intern (2026 Batch)',
      jobRole: 'Software Engineer Intern',
      jobType: 'INTERNSHIP',
      workMode: 'HYBRID',
      location: 'Bangalore, India',
      description: '10 to 12 weeks summer internship working on high-impact projects alongside staff research scientists and principal engineers.',
      responsibilities: 'Build prototypes, analyze dataset bottlenecks, write automated testing pipelines, and present final project to directors.',
      salaryPackage: '₹1,25,000 / month Stipend + Housing',
      minCgpa: 7.8,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE',
      applicationDeadline: makeDate(5),
      assessmentDate: makeDate(9),
      interviewStartDate: makeDate(14),
      selectionProcess: '1. Online Assessment -> 2. Two 45-minute Problem Solving & Coding Interviews',
      skills: [
        { name: 'Data Structures & Algorithms', isRequired: true, importance: 'HIGH' },
        { name: 'Problem Solving', isRequired: true, importance: 'HIGH' },
        { name: 'Python', isRequired: false, importance: 'MEDIUM' },
        { name: 'C++', isRequired: false, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'microsoft',
      title: 'Software Engineer — Azure Cloud & AI Platform',
      jobRole: 'Software Engineer',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Hyderabad / Bangalore',
      description: 'Architect next-generation distributed cloud services powering enterprise LLMs, Kubernetes orchestration, and global Azure regions.',
      responsibilities: 'Implement resilient cloud microservices, optimize low-latency RPC protocols, and ensure 99.999% SLA availability.',
      salaryPackage: '28 - 36 LPA',
      minCgpa: 7.5,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE,EE',
      applicationDeadline: makeDate(14),
      assessmentDate: makeDate(18),
      interviewStartDate: makeDate(25),
      selectionProcess: '1. Microsoft Codility Assessment -> 2. Technical Round 1 (Algorithms) -> 3. Technical Round 2 (Design) -> 4. AA (As Appropriate) Director Round',
      skills: [
        { name: 'Data Structures & Algorithms', isRequired: true, importance: 'HIGH' },
        { name: 'C# / .NET', isRequired: false, importance: 'HIGH' },
        { name: 'C++', isRequired: false, importance: 'HIGH' },
        { name: 'Java', isRequired: false, importance: 'HIGH' },
        { name: 'Distributed Systems', isRequired: true, importance: 'HIGH' },
        { name: 'Cloud/DevOps', isRequired: false, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'amazon',
      title: 'Software Development Engineer I (SDE I)',
      jobRole: 'Software Engineer',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Bangalore / Hyderabad / Chennai',
      description: 'Develop high-throughput e-commerce microservices, fulfillment center robotics algorithms, and Prime delivery infrastructure.',
      responsibilities: 'Build scalable REST APIs, model relational/NoSQL schemas, and champion Amazon Leadership Principles in agile sprints.',
      salaryPackage: '30 - 38 LPA (Base + Sign-on + RSUs)',
      minCgpa: 7.0,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE,EE,ME',
      applicationDeadline: makeDate(9),
      assessmentDate: makeDate(13),
      interviewStartDate: makeDate(20),
      selectionProcess: '1. Amazon Online Assessment (OA1 + OA2 Work Simulation) -> 2. Three Back-to-back Technical + Leadership Principle Interviews',
      skills: [
        { name: 'Java', isRequired: false, importance: 'HIGH' },
        { name: 'Data Structures & Algorithms', isRequired: true, importance: 'HIGH' },
        { name: 'System Design', isRequired: true, importance: 'HIGH' },
        { name: 'SQL', isRequired: true, importance: 'MEDIUM' },
        { name: 'AWS (Amazon Web Services)', isRequired: false, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'tcs',
      title: 'TCS Digital — Software Engineer',
      jobRole: 'Software Engineer',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Pan India',
      description: 'Develop enterprise digital applications for global Fortune 500 banking, retail, and healthcare clients.',
      responsibilities: 'Build responsive web apps using React and Spring Boot/Node, write unit tests, and integrate RESTful APIs.',
      salaryPackage: '7.5 - 9.0 LPA',
      minCgpa: 7.0,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE,EE,ME,CIVIL',
      applicationDeadline: makeDate(20),
      assessmentDate: makeDate(24),
      interviewStartDate: makeDate(30),
      selectionProcess: '1. National Qualifier Test (NQT Digital) -> 2. Technical Interview -> 3. HR & Managerial Interview',
      skills: [
        { name: 'Java', isRequired: false, importance: 'HIGH' },
        { name: 'Python', isRequired: false, importance: 'HIGH' },
        { name: 'SQL', isRequired: true, importance: 'HIGH' },
        { name: 'Data Structures & Algorithms', isRequired: true, importance: 'HIGH' },
        { name: 'React', isRequired: false, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'stripe',
      title: 'Software Engineer — Payments Engine',
      jobRole: 'Software Engineer',
      jobType: 'FULL_TIME',
      workMode: 'REMOTE',
      location: 'Remote / Bangalore',
      description: 'Architect world-class payment APIs with 99.999% availability, zero downtime deployments, and cryptographic fraud detection.',
      responsibilities: 'Implement idempotent payment processing workflows, write high-coverage test suites, and write clear public developer documentation.',
      salaryPackage: '40 - 52 LPA',
      minCgpa: 8.2,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS',
      applicationDeadline: makeDate(6),
      assessmentDate: makeDate(9),
      interviewStartDate: makeDate(15),
      selectionProcess: '1. Stripe Take-home / Live Coding -> 2. Debugging & Code Inspection -> 3. System Architecture -> 4. Integration Round',
      skills: [
        { name: 'Data Structures & Algorithms', isRequired: true, importance: 'HIGH' },
        { name: 'Node.js', isRequired: false, importance: 'HIGH' },
        { name: 'Python', isRequired: false, importance: 'HIGH' },
        { name: 'PostgreSQL', isRequired: true, importance: 'HIGH' },
        { name: 'System Design', isRequired: true, importance: 'HIGH' },
      ],
    },
    {
      companySlug: 'razorpay',
      title: 'Full Stack Engineer I — Merchant Platform',
      jobRole: 'Full Stack Developer',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Bangalore, India',
      description: 'Build intuitive onboarding, analytics, and settlement dashboards for over 8 million Indian businesses and startups.',
      responsibilities: 'Deliver performant React/Next.js interfaces, implement secure fintech API gateways, and write robust database migrations.',
      salaryPackage: '20 - 26 LPA',
      minCgpa: 7.2,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE',
      applicationDeadline: makeDate(10),
      assessmentDate: makeDate(14),
      interviewStartDate: makeDate(21),
      selectionProcess: '1. Razorpay HackerEarth Assessment -> 2. Machine Coding Round -> 3. Problem Solving & System Design -> 4. Culture Fit',
      skills: [
        { name: 'React', isRequired: true, importance: 'HIGH' },
        { name: 'Next.js', isRequired: false, importance: 'MEDIUM' },
        { name: 'Node.js', isRequired: true, importance: 'HIGH' },
        { name: 'PostgreSQL', isRequired: true, importance: 'HIGH' },
        { name: 'Redis', isRequired: false, importance: 'MEDIUM' },
      ],
    },
  ];

  const createdOpportunities: any[] = [];
  for (const opp of opportunitiesData) {
    const comp = companies[opp.companySlug];
    if (!comp) continue;

    // Check existing by companyId and title
    let created = await db.opportunity.findFirst({
      where: { companyId: comp.id, title: opp.title },
    });

    if (!created) {
      created = await db.opportunity.create({
        data: {
          companyId: comp.id,
          title: opp.title,
          jobRole: opp.jobRole,
          jobType: opp.jobType,
          workMode: opp.workMode,
          location: opp.location,
          description: opp.description,
          responsibilities: opp.responsibilities,
          salaryPackage: opp.salaryPackage,
          minCgpa: opp.minCgpa,
          maxBacklogsAllowed: opp.maxBacklogsAllowed,
          allowedGraduationYears: opp.allowedGraduationYears,
          allowedDepartments: opp.allowedDepartments,
          applicationDeadline: opp.applicationDeadline,
          assessmentDate: opp.assessmentDate,
          interviewStartDate: opp.interviewStartDate,
          selectionProcess: opp.selectionProcess,
          isDemoData: true,
          status: 'ACTIVE',
        },
      });
    }

    for (const sk of opp.skills) {
      const skillRec = skillsMap[sk.name];
      if (skillRec) {
        await db.opportunitySkill.upsert({
          where: {
            opportunityId_skillId: {
              opportunityId: created.id,
              skillId: skillRec.id,
            },
          },
          update: { isRequired: sk.isRequired, importance: sk.importance },
          create: {
            opportunityId: created.id,
            skillId: skillRec.id,
            isRequired: sk.isRequired,
            importance: sk.importance,
          },
        });
      }
    }

    createdOpportunities.push(created);
  }

  // 5. Seed Users & Demo Profiles (Idempotent upsert)
  console.log('👤 Seeding Demo Users & Profiles...');

  // User 1: Student Alex Rivera (SDE Track)
  const alexUser = await db.user.upsert({
    where: { email: 'alex.student@careerpilot.edu' },
    update: { passwordHash, role: 'STUDENT', name: 'Alex Rivera' },
    create: {
      name: 'Alex Rivera',
      email: 'alex.student@careerpilot.edu',
      passwordHash,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
      isVerified: true,
    },
  });

  const alexProfile = await db.studentProfile.upsert({
    where: { userId: alexUser.id },
    update: {
      cgpa: 8.85,
      graduationYear: 2026,
      departmentId: depts.CSE?.id,
      departmentName: 'Computer Science & Engineering',
    },
    create: {
      userId: alexUser.id,
      phone: '+91 98765 43210',
      college: 'National Institute of Technology',
      departmentId: depts.CSE?.id,
      departmentName: 'Computer Science & Engineering',
      degree: 'B.Tech',
      graduationYear: 2026,
      currentYear: 4,
      currentSemester: 7,
      cgpa: 8.85,
      backlogs: 0,
      historyOfBacklogs: 0,
      bio: 'Full Stack & Distributed Systems enthusiast passionate about React, TypeScript, Node.js, and cloud architectures. Active open-source contributor and hackathon winner.',
      linkedInUrl: 'https://linkedin.com/in/alex-rivera-demo',
      githubUrl: 'https://github.com/alexrivera-demo',
      portfolioUrl: 'https://alexrivera.dev',
      locationPreference: 'Bangalore, Hyderabad, Remote',
      workModePreference: 'HYBRID',
      targetJobRole: 'Software Development Engineer',
      preferredIndustries: 'SaaS, FinTech, Distributed Systems, Cloud',
      expectedSalaryMin: 18.0,
      expectedSalaryMax: 35.0,
      profileCompletion: 92,
      careerReadinessScore: 84.0,
      publicProfileSlug: 'alex-rivera',
      profileVisibility: 'PUBLIC',
      resumeFileName: 'Alex_Rivera_SDE_Resume.pdf',
      resumeText: `ALEX RIVERA\nEmail: alex.student@careerpilot.edu | GitHub: github.com/alexrivera-demo\nEDUCATION: B.Tech Computer Science & Engineering (2022-2026), CGPA: 8.85 / 10.0\nTECHNICAL SKILLS: TypeScript, React, Next.js, Node.js, PostgreSQL, Docker, DSA, System Design`,
    },
  });

  // Assign Alex Skills
  const alexSkills = ['React', 'TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Docker', 'Data Structures & Algorithms', 'System Design', 'Git & GitHub', 'Tailwind CSS', 'SQL', 'Python'];
  for (const skName of alexSkills) {
    const s = skillsMap[skName];
    if (s) {
      await db.studentSkill.upsert({
        where: { studentProfileId_skillId: { studentProfileId: alexProfile.id, skillId: s.id } },
        update: { proficiency: 'ADVANCED' },
        create: {
          studentProfileId: alexProfile.id,
          skillId: s.id,
          proficiency: 'ADVANCED',
          yearsOfExperience: 2.0,
          isVerified: true,
        },
      });
    }
  }

  // User 2: Student Sarah Chen (AI / Data Science Track)
  const sarahUser = await db.user.upsert({
    where: { email: 'sarah.data@careerpilot.edu' },
    update: { passwordHash, role: 'STUDENT', name: 'Sarah Chen' },
    create: {
      name: 'Sarah Chen',
      email: 'sarah.data@careerpilot.edu',
      passwordHash,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
      isVerified: true,
    },
  });

  const sarahProfile = await db.studentProfile.upsert({
    where: { userId: sarahUser.id },
    update: { cgpa: 9.10, graduationYear: 2026, departmentId: depts.AI_DS?.id },
    create: {
      userId: sarahUser.id,
      phone: '+91 98765 11223',
      college: 'National Institute of Technology',
      departmentId: depts.AI_DS?.id,
      departmentName: 'Artificial Intelligence & Data Science',
      degree: 'B.Tech',
      graduationYear: 2026,
      currentYear: 4,
      currentSemester: 7,
      cgpa: 9.10,
      backlogs: 0,
      historyOfBacklogs: 0,
      bio: 'Machine Learning & Big Data researcher. Built transformer-based document summarizers and real-time fraud detection pipelines.',
      linkedInUrl: 'https://linkedin.com/in/sarah-chen-demo',
      githubUrl: 'https://github.com/sarahchen-demo',
      portfolioUrl: 'https://sarahchen.ai',
      locationPreference: 'Bangalore, Mumbai, Remote',
      workModePreference: 'HYBRID',
      targetJobRole: 'Data Scientist / Machine Learning Engineer',
      profileCompletion: 88,
      careerReadinessScore: 82.0,
      publicProfileSlug: 'sarah-chen',
      profileVisibility: 'PUBLIC',
    },
  });

  // User 3: Student Priya Sharma (ECE Track)
  const priyaUser = await db.user.upsert({
    where: { email: 'priya.ece@careerpilot.edu' },
    update: { passwordHash, role: 'STUDENT', name: 'Priya Sharma' },
    create: {
      name: 'Priya Sharma',
      email: 'priya.ece@careerpilot.edu',
      passwordHash,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&auto=format&fit=crop&q=80',
      isVerified: true,
    },
  });

  await db.studentProfile.upsert({
    where: { userId: priyaUser.id },
    update: { cgpa: 8.40, graduationYear: 2026, departmentId: depts.ECE?.id },
    create: {
      userId: priyaUser.id,
      phone: '+91 98765 33445',
      college: 'National Institute of Technology',
      departmentId: depts.ECE?.id,
      departmentName: 'Electronics & Communication Engineering',
      degree: 'B.Tech',
      graduationYear: 2026,
      currentYear: 4,
      currentSemester: 7,
      cgpa: 8.40,
      backlogs: 0,
      targetJobRole: 'Embedded Systems / IoT Engineer',
      publicProfileSlug: 'priya-sharma',
      profileVisibility: 'PUBLIC',
    },
  });

  // User 4: Google Recruiter (David Miller)
  const googleUser = await db.user.upsert({
    where: { email: 'talent@google.demo' },
    update: { passwordHash, role: 'RECRUITER', name: 'David Miller (Google)' },
    create: {
      name: 'David Miller (Google)',
      email: 'talent@google.demo',
      passwordHash,
      role: 'RECRUITER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
      isVerified: true,
    },
  });

  if (companies.google) {
    await db.recruiterProfile.upsert({
      where: { userId: googleUser.id },
      update: { companyId: companies.google.id },
      create: {
        userId: googleUser.id,
        companyId: companies.google.id,
        designation: 'Staff University Talent Partner',
      },
    });
  }

  // User 5: TCS Recruiter (Rajesh Gupta)
  const tcsUser = await db.user.upsert({
    where: { email: 'hiring@tcs.demo' },
    update: { passwordHash, role: 'RECRUITER', name: 'Rajesh Gupta (TCS)' },
    create: {
      name: 'Rajesh Gupta (TCS)',
      email: 'hiring@tcs.demo',
      passwordHash,
      role: 'RECRUITER',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=256&auto=format&fit=crop&q=80',
      isVerified: true,
    },
  });

  if (companies.tcs) {
    await db.recruiterProfile.upsert({
      where: { userId: tcsUser.id },
      update: { companyId: companies.tcs.id },
      create: {
        userId: tcsUser.id,
        companyId: companies.tcs.id,
        designation: 'Campus Recruitment Lead',
      },
    });
  }

  // User 6: Placement Officer (Dr. Robert Vance)
  await db.user.upsert({
    where: { email: 'placement.dean@careerpilot.edu' },
    update: { passwordHash, role: 'ADMIN', name: 'Dr. Robert Vance' },
    create: {
      name: 'Dr. Robert Vance',
      email: 'placement.dean@careerpilot.edu',
      passwordHash,
      role: 'ADMIN',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&auto=format&fit=crop&q=80',
      isVerified: true,
    },
  });

  console.log('✅ CareerPilot database successfully seeded!');
  console.log('----------------------------------------------------');
  console.log('🔑 Demo User Accounts:');
  console.log('Student (Main):     alex.student@careerpilot.edu    / password123');
  console.log('Student (Data/AI):  sarah.data@careerpilot.edu      / password123');
  console.log('Student (ECE/IoT):  priya.ece@careerpilot.edu       / password123');
  console.log('Recruiter (Google): talent@google.demo              / password123');
  console.log('Recruiter (TCS):    hiring@tcs.demo                 / password123');
  console.log('Placement Officer:  placement.dean@careerpilot.edu  / password123');
  console.log('----------------------------------------------------');
}

async function main() {
  try {
    await seedDatabase();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}
