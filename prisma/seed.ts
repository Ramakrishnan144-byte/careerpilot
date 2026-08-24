import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting CareerPilot Database Seeding...');

  // 1. Clean existing records in order
  await prisma.auditLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.deadlineAlert.deleteMany();
  await prisma.teamMatchMember.deleteMany();
  await prisma.teamMatchListing.deleteMany();
  await prisma.careerScoreHistory.deleteMany();
  await prisma.interviewQuestion.deleteMany();
  await prisma.interviewSession.deleteMany();
  await prisma.roadmapMilestone.deleteMany();
  await prisma.careerRoadmap.deleteMany();
  await prisma.internship.deleteMany();
  await prisma.certification.deleteMany();
  await prisma.studentProject.deleteMany();
  await prisma.applicationStatusHistory.deleteMany();
  await prisma.application.deleteMany();
  await prisma.eligibilityRule.deleteMany();
  await prisma.opportunitySkill.deleteMany();
  await prisma.opportunity.deleteMany();
  await prisma.recruiterProfile.deleteMany();
  await prisma.company.deleteMany();
  await prisma.studentSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.studentProfile.deleteMany();
  await prisma.department.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Seed Departments
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
    const created = await prisma.department.create({ data: dept });
    depts[dept.code] = created;
  }

  // 3. Seed Skills
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
    const created = await prisma.skill.create({ data: s });
    skillsMap[s.name] = created;
  }

  // 4. Seed Companies (10+ Companies)
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
    const created = await prisma.company.create({ data: comp });
    companies[comp.slug] = created;
  }

  // 5. Seed Opportunities (20+ Opportunities)
  console.log('💼 Seeding 20+ Opportunities...');
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
      applicationDeadline: makeDate(14),
      assessmentDate: makeDate(18),
      interviewStartDate: makeDate(25),
      selectionProcess: '1. Online Assessment (DSA & CS Fundamentals) -> 2. Technical Round 1 -> 3. Technical Round 2 -> 4. Googliness & Leadership',
      skills: [
        { name: 'Data Structures & Algorithms', isRequired: true, importance: 'HIGH' },
        { name: 'C++', isRequired: false, importance: 'HIGH' },
        { name: 'Java', isRequired: false, importance: 'HIGH' },
        { name: 'System Design', isRequired: true, importance: 'HIGH' },
        { name: 'Operating Systems', isRequired: true, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'google',
      title: 'AI & Machine Learning Research Intern',
      jobRole: 'Machine Learning Engineer',
      jobType: 'INTERNSHIP',
      workMode: 'ON_SITE',
      location: 'Bangalore, India',
      description: 'Work with Google Research teams advancing foundational models, multilingual NLP, and computer vision algorithms.',
      responsibilities: 'Train and fine-tune large models, analyze benchmark datasets, publish technical findings, and implement prototype architectures.',
      salaryPackage: '₹1,20,000 / month Stipend + PPO Opportunity',
      minCgpa: 8.5,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2026,2027',
      allowedDepartments: 'CSE,AI_DS,IT',
      applicationDeadline: makeDate(7),
      assessmentDate: makeDate(10),
      interviewStartDate: makeDate(16),
      selectionProcess: '1. Research Profile Review -> 2. ML Coding Assessment -> 3. ML Architecture Interview -> 4. PI Round',
      skills: [
        { name: 'Python', isRequired: true, importance: 'HIGH' },
        { name: 'PyTorch', isRequired: true, importance: 'HIGH' },
        { name: 'Deep Learning', isRequired: true, importance: 'HIGH' },
        { name: 'Machine Learning', isRequired: true, importance: 'HIGH' },
        { name: 'NLP (Natural Language Processing)', isRequired: false, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'microsoft',
      title: 'Software Engineer — Azure Cloud Platform',
      jobRole: 'Software Engineer',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Hyderabad / Bangalore',
      description: 'Design and deploy hyper-scale distributed cloud infrastructure services powering enterprise Azure workloads.',
      responsibilities: 'Implement resilient cloud services, automate telemetry and monitoring, optimize database throughput, and contribute to open-source tooling.',
      salaryPackage: '28 - 36 LPA',
      minCgpa: 7.5,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE,EE',
      applicationDeadline: makeDate(9),
      assessmentDate: makeDate(13),
      interviewStartDate: makeDate(20),
      selectionProcess: '1. Online Coding Round -> 2. DSA Technical 1 -> 3. Cloud Systems Round -> 4. AA (As Appropriate) Round',
      skills: [
        { name: 'Data Structures & Algorithms', isRequired: true, importance: 'HIGH' },
        { name: 'C# / .NET', isRequired: false, importance: 'MEDIUM' },
        { name: 'C++', isRequired: false, importance: 'HIGH' },
        { name: 'Distributed Systems', isRequired: false, importance: 'HIGH' },
        { name: 'Docker', isRequired: false, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'microsoft',
      title: 'Product Management Trainee',
      jobRole: 'Product Manager',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Noida / Bangalore',
      description: 'Bridge customer empathy and technical excellence to ship next-generation collaborative experiences for Microsoft 365.',
      responsibilities: 'Author PRDs, conduct user telemetry analysis, collaborate with engineering leads, and define product roadmaps.',
      salaryPackage: '24 - 30 LPA',
      minCgpa: 7.5,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'ALL',
      applicationDeadline: makeDate(12),
      assessmentDate: makeDate(16),
      interviewStartDate: makeDate(22),
      selectionProcess: '1. Product Case Study Submission -> 2. Technical PM Round -> 3. Leadership & Vision Round',
      skills: [
        { name: 'Problem Solving', isRequired: true, importance: 'HIGH' },
        { name: 'Technical Communication', isRequired: true, importance: 'HIGH' },
        { name: 'Agile / Scrum', isRequired: false, importance: 'MEDIUM' },
        { name: 'SQL', isRequired: false, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'amazon',
      title: 'Software Development Engineer I (AWS)',
      jobRole: 'Software Engineer',
      jobType: 'FULL_TIME',
      workMode: 'ON_SITE',
      location: 'Bangalore / Hyderabad',
      description: 'Build mission-critical AWS infrastructure services handling trillions of API calls daily with high availability.',
      responsibilities: 'Deliver robust Java/C++ backend services, implement CI/CD deployment pipelines, and participate in 24/7 on-call rotations.',
      salaryPackage: '30 - 38 LPA',
      minCgpa: 7.5,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE',
      applicationDeadline: makeDate(11),
      assessmentDate: makeDate(15),
      interviewStartDate: makeDate(22),
      selectionProcess: '1. Online Assessment (Coding + Work Styles) -> 2. Technical Round 1 -> 3. Technical Round 2 -> 4. Bar Raiser Round',
      skills: [
        { name: 'Java', isRequired: true, importance: 'HIGH' },
        { name: 'Data Structures & Algorithms', isRequired: true, importance: 'HIGH' },
        { name: 'Object-Oriented Programming (OOP)', isRequired: true, importance: 'HIGH' },
        { name: 'System Design', isRequired: false, importance: 'HIGH' },
      ],
    },
    {
      companySlug: 'amazon',
      title: 'Cloud Support Associate Intern',
      jobRole: 'DevOps / Cloud Engineer',
      jobType: 'INTERNSHIP',
      workMode: 'HYBRID',
      location: 'Chennai / Bangalore',
      description: 'Work with enterprise customers troubleshooting complex cloud networking, storage, and containerized deployments on AWS.',
      responsibilities: 'Diagnose cloud architecture issues, write automation scripts, replicate technical defects, and advise on best practices.',
      salaryPackage: '₹55,000 / month Stipend',
      minCgpa: 6.8,
      maxBacklogsAllowed: 1,
      allowedGraduationYears: '2026',
      allowedDepartments: 'CSE,IT,ECE,EE',
      applicationDeadline: makeDate(5),
      assessmentDate: makeDate(8),
      interviewStartDate: makeDate(12),
      selectionProcess: '1. Networking & Linux Assessment -> 2. Technical Support Round -> 3. Amazon Leadership Principles',
      skills: [
        { name: 'Linux/Unix', isRequired: true, importance: 'HIGH' },
        { name: 'Computer Networks', isRequired: true, importance: 'HIGH' },
        { name: 'AWS (Amazon Web Services)', isRequired: false, importance: 'HIGH' },
        { name: 'Python', isRequired: false, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'tcs',
      title: 'TCS Digital — Full Stack Engineer',
      jobRole: 'Full Stack Developer',
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
      companySlug: 'tcs',
      title: 'TCS Innovator — AI & Cloud Solutions',
      jobRole: 'AI/ML Engineer',
      jobType: 'FULL_TIME',
      workMode: 'ON_SITE',
      location: 'Mumbai / Pune / Bangalore',
      description: 'Work in TCS R&I Labs building enterprise AI solutions, computer vision automation, and generative AI prototypes.',
      responsibilities: 'Implement deep learning pipelines, optimize inference on edge devices, and deliver client proof-of-concepts.',
      salaryPackage: '11.5 - 14.0 LPA',
      minCgpa: 8.0,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE',
      applicationDeadline: makeDate(16),
      assessmentDate: makeDate(21),
      interviewStartDate: makeDate(28),
      selectionProcess: '1. Advanced Hackathon Coding Assessment -> 2. Architecture & Algorithms Round -> 3. MR/HR Round',
      skills: [
        { name: 'Python', isRequired: true, importance: 'HIGH' },
        { name: 'Machine Learning', isRequired: true, importance: 'HIGH' },
        { name: 'Deep Learning', isRequired: false, importance: 'HIGH' },
        { name: 'Docker', isRequired: false, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'infosys',
      title: 'Specialist Programmer (SP)',
      jobRole: 'Software Engineer',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Bangalore / Mysore / Pune',
      description: 'High-impact engineering elite cadre solving algorithmic problems, distributed scalability, and next-gen digital systems.',
      responsibilities: 'Write high-performance backend microservices, lead open-source tech adoption, and build scalable distributed systems.',
      salaryPackage: '9.5 - 12.0 LPA',
      minCgpa: 6.5,
      maxBacklogsAllowed: 1,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'ALL',
      applicationDeadline: makeDate(18),
      assessmentDate: makeDate(22),
      interviewStartDate: makeDate(27),
      selectionProcess: '1. InfyTQ HackWithInfy Round 1 -> 2. Advanced Coding Round -> 3. Technical & Behavioral Interview',
      skills: [
        { name: 'Data Structures & Algorithms', isRequired: true, importance: 'HIGH' },
        { name: 'Java', isRequired: false, importance: 'HIGH' },
        { name: 'Python', isRequired: false, importance: 'HIGH' },
        { name: 'DBMS', isRequired: true, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'infosys',
      title: 'Digital Specialist Engineer (DSE)',
      jobRole: 'Full Stack Developer',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Hyderabad / Chennai / Pune',
      description: 'Build modern responsive enterprise cloud applications leveraging modern frontend frameworks and microservice APIs.',
      responsibilities: 'Develop web interfaces, write automated tests, and collaborate with enterprise client stakeholders.',
      salaryPackage: '6.5 - 8.0 LPA',
      minCgpa: 6.5,
      maxBacklogsAllowed: 1,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE,EE',
      applicationDeadline: makeDate(22),
      assessmentDate: makeDate(26),
      interviewStartDate: makeDate(31),
      selectionProcess: '1. InfyTQ DSE Assessment -> 2. Technical Interview -> 3. HR Round',
      skills: [
        { name: 'JavaScript', isRequired: true, importance: 'HIGH' },
        { name: 'SQL', isRequired: true, importance: 'HIGH' },
        { name: 'HTML5/CSS3', isRequired: true, importance: 'MEDIUM' },
        { name: 'React', isRequired: false, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'deloitte',
      title: 'Technology Analyst — Cyber Risk & Cloud',
      jobRole: 'Cybersecurity Analyst',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Hyderabad / Bangalore',
      description: 'Help global enterprise clients protect critical digital assets, assess vulnerabilities, and maintain cloud security posture.',
      responsibilities: 'Conduct penetration testing, analyze cloud security architectures, monitor SIEM telemetry, and prepare compliance reports.',
      salaryPackage: '10.0 - 13.5 LPA',
      minCgpa: 7.0,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE,EE',
      applicationDeadline: makeDate(15),
      assessmentDate: makeDate(19),
      interviewStartDate: makeDate(26),
      selectionProcess: '1. Aptitude & Cyber Fundamentals Test -> 2. Technical Case Study -> 3. Partner / HR Interview',
      skills: [
        { name: 'Computer Networks', isRequired: true, importance: 'HIGH' },
        { name: 'Operating Systems', isRequired: true, importance: 'HIGH' },
        { name: 'Linux/Unix', isRequired: true, importance: 'MEDIUM' },
        { name: 'Problem Solving', isRequired: true, importance: 'HIGH' },
      ],
    },
    {
      companySlug: 'deloitte',
      title: 'Consultant — Data & Analytics Trainee',
      jobRole: 'Data Analyst',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Mumbai / Gurgaon',
      description: 'Transform complex business datasets into predictive models and executive BI dashboards to drive strategic decision making.',
      responsibilities: 'Write advanced SQL queries, build automated ETL data pipelines, and design interactive Tableau/PowerBI visual dashboards.',
      salaryPackage: '9.0 - 12.0 LPA',
      minCgpa: 7.2,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS,MBA',
      applicationDeadline: makeDate(13),
      assessmentDate: makeDate(17),
      interviewStartDate: makeDate(24),
      selectionProcess: '1. Analytical & SQL Assessment -> 2. Case Presentation -> 3. Director Round',
      skills: [
        { name: 'SQL', isRequired: true, importance: 'HIGH' },
        { name: 'Python', isRequired: true, importance: 'HIGH' },
        { name: 'Pandas & NumPy', isRequired: true, importance: 'HIGH' },
        { name: 'Technical Communication', isRequired: true, importance: 'HIGH' },
      ],
    },
    {
      companySlug: 'uber',
      title: 'Software Engineer II (Backend / Distributed Systems)',
      jobRole: 'Backend Engineer',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Bangalore / Hyderabad',
      description: 'Engineer high-throughput geospatial dispatch systems handling hundreds of thousands of concurrent trip requests with sub-100ms p99 latency.',
      responsibilities: 'Build low-latency microservices in Go/Java, design Kafka stream consumers, and optimize distributed database sharding.',
      salaryPackage: '38 - 48 LPA',
      minCgpa: 8.0,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS',
      applicationDeadline: makeDate(8),
      assessmentDate: makeDate(12),
      interviewStartDate: makeDate(18),
      selectionProcess: '1. Uber Coding Challenge -> 2. Algorithms & Systems 1 -> 3. Algorithms & Systems 2 -> 4. Architecture & Culture Fit',
      skills: [
        { name: 'Go (Golang)', isRequired: false, importance: 'HIGH' },
        { name: 'Java', isRequired: false, importance: 'HIGH' },
        { name: 'Data Structures & Algorithms', isRequired: true, importance: 'HIGH' },
        { name: 'System Design', isRequired: true, importance: 'HIGH' },
        { name: 'Redis', isRequired: false, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'uber',
      title: 'Frontend Engineer — Rider Experience',
      jobRole: 'Frontend Developer',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Bangalore, India',
      description: 'Develop silky-smooth web and mobile-web experiences for millions of riders across global markets.',
      responsibilities: 'Architect modular React/TypeScript component systems, optimize Core Web Vitals, and implement real-time map rendering.',
      salaryPackage: '34 - 42 LPA',
      minCgpa: 7.8,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE',
      applicationDeadline: makeDate(10),
      assessmentDate: makeDate(14),
      interviewStartDate: makeDate(20),
      selectionProcess: '1. Frontend Coding Test -> 2. React Architecture & DOM Deep Dive -> 3. UI System Design -> 4. Team Fit',
      skills: [
        { name: 'React', isRequired: true, importance: 'HIGH' },
        { name: 'TypeScript', isRequired: true, importance: 'HIGH' },
        { name: 'JavaScript', isRequired: true, importance: 'HIGH' },
        { name: 'HTML5/CSS3', isRequired: true, importance: 'MEDIUM' },
        { name: 'Tailwind CSS', isRequired: false, importance: 'MEDIUM' },
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
      companySlug: 'stripe',
      title: 'Infrastructure & SRE Intern',
      jobRole: 'Site Reliability Engineer',
      jobType: 'INTERNSHIP',
      workMode: 'REMOTE',
      location: 'Remote, India',
      description: 'Work on foundational Kubernetes clusters, automated chaos engineering testing, and zero-trust service meshes.',
      responsibilities: 'Automate cluster provisioning with Terraform, debug network packet drops, and build latency dashboards.',
      salaryPackage: '₹1,10,000 / month Stipend',
      minCgpa: 8.0,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE',
      applicationDeadline: makeDate(4),
      assessmentDate: makeDate(7),
      interviewStartDate: makeDate(11),
      selectionProcess: '1. Linux & Scripting Assessment -> 2. Systems Diagnostics Round -> 3. Infrastructure Coding',
      skills: [
        { name: 'Linux/Unix', isRequired: true, importance: 'HIGH' },
        { name: 'Docker', isRequired: true, importance: 'HIGH' },
        { name: 'Kubernetes', isRequired: false, importance: 'HIGH' },
        { name: 'Go (Golang)', isRequired: false, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'atlassian',
      title: 'Graduate Software Engineer — Full Stack',
      jobRole: 'Full Stack Developer',
      jobType: 'FULL_TIME',
      workMode: 'REMOTE',
      location: 'Remote Anywhere in India',
      description: 'Help build Jira and Confluence cloud features loved by tens of millions of knowledge workers across the globe.',
      responsibilities: 'Develop TypeScript/React web features, build GraphQL/REST backend services, and champion automated testing.',
      salaryPackage: '26 - 34 LPA',
      minCgpa: 7.5,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS,ECE',
      applicationDeadline: makeDate(15),
      assessmentDate: makeDate(19),
      interviewStartDate: makeDate(25),
      selectionProcess: '1. Coding Test -> 2. Data Structures Round -> 3. System Design & Code Craft -> 4. Values Interview',
      skills: [
        { name: 'React', isRequired: true, importance: 'HIGH' },
        { name: 'TypeScript', isRequired: true, importance: 'HIGH' },
        { name: 'Node.js', isRequired: true, importance: 'HIGH' },
        { name: 'PostgreSQL', isRequired: false, importance: 'MEDIUM' },
      ],
    },
    {
      companySlug: 'atlassian',
      title: 'Site Reliability Engineering Intern',
      jobRole: 'Site Reliability Engineer',
      jobType: 'INTERNSHIP',
      workMode: 'REMOTE',
      location: 'Remote Work Anywhere',
      description: 'Ensure 99.99% uptime for Atlassian cloud products through automation, chaos engineering, and incident response tooling.',
      responsibilities: 'Build automated canary rollback pipelines, optimize AWS multi-region failover, and reduce MTTR.',
      salaryPackage: '₹90,000 / month Stipend',
      minCgpa: 7.2,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2026',
      allowedDepartments: 'CSE,IT,ECE',
      applicationDeadline: makeDate(8),
      assessmentDate: makeDate(12),
      interviewStartDate: makeDate(17),
      selectionProcess: '1. Online Assessment -> 2. Systems Round -> 3. Values Round',
      skills: [
        { name: 'Linux/Unix', isRequired: true, importance: 'HIGH' },
        { name: 'AWS (Amazon Web Services)', isRequired: true, importance: 'HIGH' },
        { name: 'Python', isRequired: false, importance: 'MEDIUM' },
        { name: 'Docker', isRequired: false, importance: 'MEDIUM' },
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
    {
      companySlug: 'razorpay',
      title: 'Data Engineer I — Real-Time Risk Platform',
      jobRole: 'Data Engineer',
      jobType: 'FULL_TIME',
      workMode: 'HYBRID',
      location: 'Bangalore, India',
      description: 'Construct real-time streaming data pipelines processing millions of financial events per minute to prevent fraudulent transactions.',
      responsibilities: 'Build Spark/Flink streaming pipelines, manage data lakes in AWS S3, and optimize analytical SQL queries.',
      salaryPackage: '22 - 28 LPA',
      minCgpa: 7.5,
      maxBacklogsAllowed: 0,
      allowedGraduationYears: '2025,2026',
      allowedDepartments: 'CSE,IT,AI_DS',
      applicationDeadline: makeDate(13),
      assessmentDate: makeDate(17),
      interviewStartDate: makeDate(23),
      selectionProcess: '1. Data Engineering Assessment -> 2. SQL & Data Modeling Round -> 3. System Design Round -> 4. Leadership',
      skills: [
        { name: 'Python', isRequired: true, importance: 'HIGH' },
        { name: 'SQL', isRequired: true, importance: 'HIGH' },
        { name: 'PostgreSQL', isRequired: true, importance: 'HIGH' },
        { name: 'Data Structures & Algorithms', isRequired: true, importance: 'MEDIUM' },
      ],
    },
  ];

  const createdOpportunities: any[] = [];
  for (const opp of opportunitiesData) {
    const comp = companies[opp.companySlug];
    const created = await prisma.opportunity.create({
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

    for (const sk of opp.skills) {
      const skillRec = skillsMap[sk.name];
      if (skillRec) {
        await prisma.opportunitySkill.create({
          data: {
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

  // 6. Seed Users & Demo Profiles
  console.log('👤 Seeding Demo Users & Profiles...');

  // Student 1 (Main Demo - Alex Rivera)
  const alexUser = await prisma.user.create({
    data: {
      name: 'Alex Rivera',
      email: 'alex.student@careerpilot.edu',
      passwordHash,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=256&auto=format&fit=crop&q=80',
      isVerified: true,
    },
  });

  const alexProfile = await prisma.studentProfile.create({
    data: {
      userId: alexUser.id,
      phone: '+91 98765 43210',
      college: 'National Institute of Technology',
      departmentId: depts.CSE.id,
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
      resumeText: `ALEX RIVERA
Email: alex.student@careerpilot.edu | GitHub: github.com/alexrivera-demo | LinkedIn: linkedin.com/in/alex-rivera-demo
EDUCATION: B.Tech Computer Science & Engineering (2022-2026), CGPA: 8.85 / 10.0
TECHNICAL SKILLS:
- Languages: TypeScript, JavaScript, Python, C++, Java, SQL
- Frontend: React, Next.js, Tailwind CSS, Redux Toolkit, HTML5/CSS3
- Backend & Cloud: Node.js, Express.js, PostgreSQL, MongoDB, Redis, Docker, RESTful APIs, Git, Linux
- Core Concepts: Data Structures & Algorithms, System Design, Object-Oriented Programming, DBMS, Computer Networks
PROJECTS:
1. Real-Time Collaborative Canvas (Next.js, WebSockets, Redis, PostgreSQL, Canvas API)
   - Architected multi-user visual canvas synchronizing vector strokes with sub-50ms latency using CRDTs.
   - Handled 500+ concurrent websocket sessions with Redis Pub/Sub backplane.
2. AI-Powered Resume Matching Engine (React, TypeScript, FastAPI, PostgreSQL)
   - Built ATS semantic analysis tool scoring resumes against job descriptions with 90%+ keyword precision.
INTERNSHIPS:
Frontend Engineering Intern at CloudScale Labs (May 2025 - Jul 2025)
- Optimized critical dashboard bundle size by 35% and enhanced Core Web Vitals (LCP < 1.2s).
CERTIFICATIONS: AWS Certified Cloud Practitioner, Meta Front-End Developer Specialization`,
    },
  });

  // Assign Alex's skills
  const alexSkills = [
    { name: 'React', proficiency: 'ADVANCED' },
    { name: 'TypeScript', proficiency: 'ADVANCED' },
    { name: 'Next.js', proficiency: 'ADVANCED' },
    { name: 'Node.js', proficiency: 'ADVANCED' },
    { name: 'PostgreSQL', proficiency: 'INTERMEDIATE' },
    { name: 'Docker', proficiency: 'INTERMEDIATE' },
    { name: 'Data Structures & Algorithms', proficiency: 'ADVANCED' },
    { name: 'System Design', proficiency: 'INTERMEDIATE' },
    { name: 'Git & GitHub', proficiency: 'EXPERT' },
    { name: 'Tailwind CSS', proficiency: 'EXPERT' },
    { name: 'SQL', proficiency: 'ADVANCED' },
    { name: 'Python', proficiency: 'INTERMEDIATE' },
  ];

  for (const ask of alexSkills) {
    const s = skillsMap[ask.name];
    if (s) {
      await prisma.studentSkill.create({
        data: {
          studentProfileId: alexProfile.id,
          skillId: s.id,
          proficiency: ask.proficiency,
          yearsOfExperience: 2.0,
          isVerified: true,
        },
      });
    }
  }

  // Alex's projects
  await prisma.studentProject.createMany({
    data: [
      {
        studentProfileId: alexProfile.id,
        title: 'Distributed Real-Time Collaborative Canvas',
        description: 'Multi-user visual canvas supporting vector stroke rendering, room authorization, and CRDT synchronization.',
        techStack: 'Next.js, TypeScript, WebSockets, Redis, PostgreSQL, Canvas API',
        githubUrl: 'https://github.com/alexrivera-demo/collaborative-canvas',
        liveUrl: 'https://canvas.demo.dev',
        difficulty: 'ADVANCED',
        isVerified: true,
      },
      {
        studentProfileId: alexProfile.id,
        title: 'AI Resume & ATS Intelligence Platform',
        description: 'Automated resume parser comparing candidate profiles against job postings with semantic ATS keyword analysis.',
        techStack: 'React, TypeScript, FastAPI, PostgreSQL, Tailwind CSS',
        githubUrl: 'https://github.com/alexrivera-demo/ai-resume-ats',
        liveUrl: 'https://ats.demo.dev',
        difficulty: 'INTERMEDIATE',
        isVerified: true,
      },
    ],
  });

  // Alex's certifications
  await prisma.certification.createMany({
    data: [
      {
        studentProfileId: alexProfile.id,
        name: 'AWS Certified Cloud Practitioner',
        issuer: 'Amazon Web Services',
        credentialUrl: 'https://aws.amazon.com/verification/demo-12345',
        issueDate: new Date('2025-03-15'),
        expiryDate: new Date('2028-03-15'),
      },
      {
        studentProfileId: alexProfile.id,
        name: 'Meta Front-End Developer Professional Certificate',
        issuer: 'Meta / Coursera',
        credentialUrl: 'https://coursera.org/verify/demo-meta-frontend',
        issueDate: new Date('2024-11-20'),
      },
    ],
  });

  // Alex's internships
  await prisma.internship.create({
    data: {
      studentProfileId: alexProfile.id,
      companyName: 'CloudScale Labs',
      role: 'Frontend Engineering Intern',
      duration: 'May 2025 - Jul 2025 (3 mos)',
      description: 'Optimized dashboard bundle by 35%, developed responsive UI components in React/TypeScript, and integrated GraphQL endpoints.',
    },
  });

  // Alex's Career Roadmap
  const alexRoadmap = await prisma.careerRoadmap.create({
    data: {
      studentProfileId: alexProfile.id,
      targetRole: 'Software Development Engineer',
      targetCompany: 'Google / Microsoft / Uber',
      totalMilestones: 9,
      completedMilestones: 4,
    },
  });

  const milestoneConfigs = [
    { phase: 'CURRENT_PROFILE', title: 'Baseline Profile Audit', description: 'Maintain CGPA > 8.5 and audit core skill proficiencies.', status: 'COMPLETED', order: 1 },
    { phase: 'SKILL_GAPS', title: 'Identify Target SDE Skills', description: 'Map required System Design & Cloud concepts for Tier-1 Tech drives.', status: 'COMPLETED', order: 2 },
    { phase: 'LEARNING', title: 'DSA & Advanced Concurrency', description: 'Solve 350+ LeetCode problems across Graphs, DP, Trees, and System Architecture.', status: 'COMPLETED', order: 3 },
    { phase: 'PROJECTS', title: 'High-Impact Portfolio Systems', description: 'Publish Collaborative Canvas and AI ATS engine with live demo links.', status: 'COMPLETED', order: 4 },
    { phase: 'CERTIFICATIONS', title: 'AWS Cloud Certification', description: 'Attain AWS Cloud Practitioner credential.', status: 'IN_PROGRESS', order: 5 },
    { phase: 'INTERNSHIP', title: 'Industry Internship Experience', description: 'Complete 3-month summer frontend/backend internship.', status: 'IN_PROGRESS', order: 6 },
    { phase: 'RESUME_OPTIMIZATION', title: 'ATS Resume Optimization', description: 'Score > 85% ATS match against Tier-1 SDE job descriptions.', status: 'IN_PROGRESS', order: 7 },
    { phase: 'INTERVIEW_PREP', title: 'AI Mock Interviews & System Design', description: 'Complete 5 AI mock technical rounds with score > 80%.', status: 'NOT_STARTED', order: 8 },
    { phase: 'PLACEMENT', title: 'Campus Placement & Offer', description: 'Ace Google / Uber campus technical rounds and secure Dream Offer.', status: 'NOT_STARTED', order: 9 },
  ];

  for (const m of milestoneConfigs) {
    await prisma.roadmapMilestone.create({
      data: {
        roadmapId: alexRoadmap.id,
        ...m,
      },
    });
  }

  // Alex's pre-populated Applications
  const googleOpp = createdOpportunities.find((o) => o.title.includes('Software Development Engineer (SDE I)'));
  const uberOpp = createdOpportunities.find((o) => o.title.includes('Frontend Engineer — Rider Experience'));
  const razorpayOpp = createdOpportunities.find((o) => o.title.includes('Full Stack Engineer I'));
  const stripeOpp = createdOpportunities.find((o) => o.title.includes('Payments Engine'));

  if (googleOpp) {
    const app1 = await prisma.application.create({
      data: {
        studentProfileId: alexProfile.id,
        opportunityId: googleOpp.id,
        status: 'INTERVIEW',
        priorityScore: 92.0,
        skillMatchPercentage: 90.0,
        eligibilityStatus: 'ELIGIBLE',
        notes: 'Online assessment cleared with 100% test cases. Technical Round 1 scheduled.',
        assessmentDate: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),
        interviewDate: makeDate(3),
        appliedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.applicationStatusHistory.createMany({
      data: [
        { applicationId: app1.id, fromStatus: null, toStatus: 'APPLIED', comment: 'Application submitted via CareerPilot', createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) },
        { applicationId: app1.id, fromStatus: 'APPLIED', toStatus: 'ASSESSMENT', comment: 'Shortlisted for Online Assessment', createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000) },
        { applicationId: app1.id, fromStatus: 'ASSESSMENT', toStatus: 'INTERVIEW', comment: 'Cleared OA with top score. Technical Round 1 scheduled.', createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
      ],
    });
  }

  if (uberOpp) {
    const app2 = await prisma.application.create({
      data: {
        studentProfileId: alexProfile.id,
        opportunityId: uberOpp.id,
        status: 'ASSESSMENT',
        priorityScore: 89.0,
        skillMatchPercentage: 95.0,
        eligibilityStatus: 'ELIGIBLE',
        notes: 'Awaiting online frontend coding assessment link.',
        appliedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
    });

    await prisma.applicationStatusHistory.create({
      data: {
        applicationId: app2.id,
        toStatus: 'APPLIED',
        comment: 'Applied for Frontend Engineer role',
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
      },
    });
  }

  if (razorpayOpp) {
    await prisma.application.create({
      data: {
        studentProfileId: alexProfile.id,
        opportunityId: razorpayOpp.id,
        status: 'SHORTLISTED',
        priorityScore: 94.0,
        skillMatchPercentage: 100.0,
        eligibilityStatus: 'ELIGIBLE',
        notes: 'Profile shortlisted by hiring manager.',
        appliedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
      },
    });
  }

  // Alex's Mock Interview history
  const interview1 = await prisma.interviewSession.create({
    data: {
      studentProfileId: alexProfile.id,
      companyName: 'Google',
      jobRole: 'Software Development Engineer',
      category: 'TECHNICAL',
      difficulty: 'HARD',
      overallScore: 86.0,
      summaryFeedback: 'Excellent grasp of distributed caching and database indexing. Answers were well-structured and concise.',
      status: 'COMPLETED',
    },
  });

  await prisma.interviewQuestion.createMany({
    data: [
      {
        sessionId: interview1.id,
        question: 'Explain how you would design a scalable URL shortener service handling 10,000 requests per second.',
        category: 'TECHNICAL',
        studentAnswer: 'I would use a distributed key-value store like Redis for caching top-requested URLs, backed by PostgreSQL or Cassandra with Base62 encoding for URL tokens. Load balancing across stateless web workers with rate limiting via token bucket algorithm.',
        relevanceScore: 90,
        clarityScore: 88,
        technicalScore: 92,
        communicationScore: 85,
        totalScore: 88,
        feedback: 'Superb architectural breakdown. Mentioned Base62 tokenization, caching tier, and distributed load balancing correctly.',
        suggestions: 'Consider elaborating on collision resolution strategies for pre-generated token batches.',
      },
      {
        sessionId: interview1.id,
        question: 'What is the difference between concurrency and parallelism?',
        category: 'TECHNICAL',
        studentAnswer: 'Concurrency is about dealing with lots of things at once (structure of independent threads interleaving on a single or multiple cores), while parallelism is doing lots of things at once (executing simultaneously on multiple physical CPU cores).',
        relevanceScore: 95,
        clarityScore: 90,
        technicalScore: 88,
        communicationScore: 89,
        totalScore: 90,
        feedback: 'Accurate and crisp explanation using Rob Pike’s canonical definition.',
        suggestions: 'Can provide a practical code example comparing async I/O with multiprocessing.',
      },
    ],
  });

  // Alex's Notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: alexUser.id,
        title: '🎯 Google Technical Round 1 Scheduled',
        message: 'Your Google SDE I Technical Interview is confirmed for 3 days from now. Review your mock interview notes!',
        category: 'INTERVIEW',
        level: 'URGENT',
        actionUrl: '/student/applications',
        isRead: false,
      },
      {
        userId: alexUser.id,
        title: '📅 Uber Frontend Assessment Due in 4 Days',
        message: 'The deadline for Uber Rider Experience Online Assessment is approaching. Click to view drive details.',
        category: 'DEADLINE',
        level: 'REMINDER',
        actionUrl: '/student/opportunities',
        isRead: false,
      },
      {
        userId: alexUser.id,
        title: '✨ 94% Match Found: Razorpay Full Stack Role',
        message: 'Your skill profile in React, TypeScript, and Node.js perfectly aligns with the new Razorpay Merchant Platform posting.',
        category: 'OPPORTUNITY',
        level: 'INFO',
        actionUrl: '/student/opportunities',
        isRead: true,
      },
    ],
  });

  // Student 2 (Sarah Chen - AI / Data Science)
  const sarahUser = await prisma.user.create({
    data: {
      name: 'Sarah Chen',
      email: 'sarah.data@careerpilot.edu',
      passwordHash,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=256&auto=format&fit=crop&q=80',
      isVerified: true,
    },
  });

  const sarahProfile = await prisma.studentProfile.create({
    data: {
      userId: sarahUser.id,
      phone: '+91 98765 11223',
      departmentId: depts.AI_DS.id,
      departmentName: 'Artificial Intelligence & Data Science',
      degree: 'B.Tech',
      graduationYear: 2026,
      currentYear: 4,
      cgpa: 8.92,
      backlogs: 0,
      bio: 'Machine Learning & NLP researcher focused on LLMs, generative AI, and high-performance PyTorch pipelines.',
      githubUrl: 'https://github.com/sarahchen-ai',
      linkedInUrl: 'https://linkedin.com/in/sarahchen-ai',
      locationPreference: 'Bangalore, Remote',
      targetJobRole: 'Machine Learning Engineer',
      profileCompletion: 90,
      careerReadinessScore: 82.0,
      publicProfileSlug: 'sarah-chen',
      profileVisibility: 'PUBLIC',
    },
  });

  const sarahSkills = ['Python', 'PyTorch', 'Machine Learning', 'Deep Learning', 'SQL', 'Pandas & NumPy', 'FastAPI'];
  for (const sk of sarahSkills) {
    const s = skillsMap[sk];
    if (s) {
      await prisma.studentSkill.create({
        data: {
          studentProfileId: sarahProfile.id,
          skillId: s.id,
          proficiency: 'ADVANCED',
          yearsOfExperience: 2.0,
          isVerified: true,
        },
      });
    }
  }

  // Student 3 (Priya Sharma - ECE / IoT)
  const priyaUser = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya.ece@careerpilot.edu',
      passwordHash,
      role: 'STUDENT',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=256&auto=format&fit=crop&q=80',
      isVerified: true,
    },
  });

  const priyaProfile = await prisma.studentProfile.create({
    data: {
      userId: priyaUser.id,
      phone: '+91 98765 99887',
      departmentId: depts.ECE.id,
      departmentName: 'Electronics & Communication Engineering',
      degree: 'B.Tech',
      graduationYear: 2026,
      currentYear: 4,
      cgpa: 8.40,
      backlogs: 0,
      bio: 'Hardware & IoT developer building smart edge sensor networks and embedded microcontroller solutions.',
      githubUrl: 'https://github.com/priyasharma-iot',
      locationPreference: 'Bangalore, Hyderabad',
      targetJobRole: 'Embedded Systems / IoT Engineer',
      profileCompletion: 85,
      careerReadinessScore: 76.0,
      publicProfileSlug: 'priya-sharma',
      profileVisibility: 'PUBLIC',
    },
  });

  const priyaSkills = ['Embedded Systems', 'Arduino / Raspberry Pi', 'IoT Architecture', 'C++', 'Python'];
  for (const sk of priyaSkills) {
    const s = skillsMap[sk];
    if (s) {
      await prisma.studentSkill.create({
        data: {
          studentProfileId: priyaProfile.id,
          skillId: s.id,
          proficiency: 'ADVANCED',
          yearsOfExperience: 1.5,
          isVerified: true,
        },
      });
    }
  }

  // Seed Team Match Listings
  const teamListing1 = await prisma.teamMatchListing.create({
    data: {
      creatorId: alexProfile.id,
      title: 'Smart IoT Agri-Tech Soil & Climate Intelligence Platform',
      description: 'Building a full-stack platform that collects real-time moisture/temperature data from Arduino/ESP32 edge nodes, stores it in PostgreSQL, and serves predictive crop yield insights.',
      neededRoles: 'Embedded IoT Specialist, ML Data Analyst, Cloud DevOps',
      techStack: 'Next.js, FastAPI, PostgreSQL, MQTT, Arduino, PyTorch',
      status: 'OPEN',
    },
  });

  await prisma.teamMatchMember.create({
    data: {
      listingId: teamListing1.id,
      studentProfileId: alexProfile.id,
      role: 'Full Stack & System Architect',
      status: 'CONFIRMED',
    },
  });

  // Seed Recruiters
  const googleRecruiterUser = await prisma.user.create({
    data: {
      name: 'David Miller',
      email: 'talent@google.demo',
      passwordHash,
      role: 'RECRUITER',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=256&auto=format&fit=crop&q=80',
      isVerified: true,
    },
  });

  await prisma.recruiterProfile.create({
    data: {
      userId: googleRecruiterUser.id,
      companyId: companies.google.id,
      designation: 'University Talent Acquisition Lead (APAC)',
    },
  });

  const tcsRecruiterUser = await prisma.user.create({
    data: {
      name: 'Jennifer Wu',
      email: 'hiring@tcs.demo',
      passwordHash,
      role: 'RECRUITER',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=256&auto=format&fit=crop&q=80',
      isVerified: true,
    },
  });

  await prisma.recruiterProfile.create({
    data: {
      userId: tcsRecruiterUser.id,
      companyId: companies.tcs.id,
      designation: 'Campus Hiring Operations Lead',
    },
  });

  // Seed Admin / Placement Officer
  const adminUser = await prisma.user.create({
    data: {
      name: 'Dr. Robert Vance',
      email: 'placement.dean@careerpilot.edu',
      passwordHash,
      role: 'PLACEMENT_OFFICER',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=256&auto=format&fit=crop&q=80',
      isVerified: true,
    },
  });

  await prisma.notification.create({
    data: {
      userId: adminUser.id,
      title: '📊 2025-26 Placement Season Kickoff',
      message: 'Placement drive registrations open. 10+ Tier-1 companies active on campus.',
      category: 'PLACEMENT_ALERT',
      level: 'INFO',
      isRead: false,
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

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
