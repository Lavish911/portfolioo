export const GITHUB = 'https://github.com/Lavish911'
export const LINKEDIN = 'https://linkedin.com/in/lavish-rahangdale'

export const PROFILE = {
  firstName: 'LAVISH',
  lastName: 'RAHANGDALE',
  name: 'Lavish Rahangdale',
  email: 'lavishr213@gmail.com',
  phoneDisplay: '+91 77688 29106',
  phoneHref: 'tel:+917768829106',
  location: 'Nagpur, Maharashtra, IN',
  github: GITHUB,
  linkedin: LINKEDIN,
  roles: ['AI & Web Developer', 'Full-Stack Engineer', 'ML Systems Builder', 'Problem Solver'],
  sub: 'B.Tech AI & ML engineer who ships intelligent software to production — clinical-grade ML ensembles, real-time AI assistants and full-stack platforms serving thousands of users.',
  availability: 'Open to full-stack & ML roles — 2026 grad',
}

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Work' },
  { id: 'experience', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
]

export const STATS = [
  { end: 10, format: (v) => `${Math.round(v)}K+`, label: 'Users served' },
  { end: 99.9, format: (v) => `${v.toFixed(1)}%`, label: 'Uptime maintained' },
  { end: 1000, format: (v) => `${(v / 1000).toFixed(1).replace(/\.0$/, '')}K+`, label: 'Daily requests handled' },
  { end: 30, format: (v) => `${Math.round(v)}%`, label: 'Frontend perf gain' },
]

export const FACTS = [
  ['Location', 'Nagpur, India'],
  ['Degree', 'B.Tech — AI & ML'],
  ['Graduation', 'May 2026'],
  ['Focus', 'Full-Stack × Machine Learning'],
  ['Status', 'Open to opportunities'],
]

export const TERMINAL = [
  { k: 'cmd', s: 'whoami' },
  { k: 'out', s: 'lavish — ai/web developer · problem solver' },
  { k: 'cmd', s: 'cat mission.txt' },
  { k: 'out', s: 'Ship intelligent systems that survive production.' },
  { k: 'cmd', s: 'ls ./arsenal' },
  { k: 'out', s: 'python  js  react  node  fastapi  docker  aws' },
  { k: 'cmd', s: 'uptime --passion' },
  { k: 'out', s: '4+ years of building, zero signs of stopping' },
  { k: 'cmd', s: './status --now' },
  { k: 'out', s: "OPEN_TO_WORK — let's talk." },
]

export const SKILL_GROUPS = [
  {
    icon: 'Code2', title: 'Languages', level: 94, color: '#22d3ee',
    tags: ['Python', 'JavaScript (ES6+)', 'SQL', 'HTML/CSS'],
  },
  {
    icon: 'Globe', title: 'Web Development', level: 91, color: '#a78bfa',
    tags: ['React.js', 'Node.js', 'Express.js', 'REST APIs', 'Socket.io', 'FastAPI'],
  },
  {
    icon: 'Brain', title: 'AI / ML', level: 88, color: '#f472b6',
    tags: ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'XGBoost', 'Keras', 'Scikit-learn'],
  },
  {
    icon: 'Database', title: 'Databases', level: 86, color: '#34d399',
    tags: ['MongoDB', 'SQLite'],
  },
  {
    icon: 'Server', title: 'DevOps & Cloud', level: 84, color: '#38bdf8',
    tags: ['Docker', 'AWS EC2', 'CI/CD', 'Linux', 'Git'],
  },
  {
    icon: 'Cpu', title: 'Core CS', level: 87, color: '#fbbf24',
    tags: ['DSA', 'OOP', 'DBMS', 'Agile/Scrum'],
  },
  {
    icon: 'BarChart3', title: 'Analytics', level: 83, color: '#fb7185',
    tags: ['Pandas', 'NumPy', 'Matplotlib', 'Excel'],
  },
]

export const MARQUEE = [
  'Python', 'JavaScript', 'React.js', 'Node.js', 'FastAPI', 'Docker',
  'AWS EC2', 'MongoDB', 'XGBoost', 'Socket.io', 'Keras', 'CI/CD', 'Linux', 'Git',
]

export const PROJECTS = [
  {
    id: 'srris',
    tag: '// clinical intelligence',
    title: 'SRRIS',
    sub: 'Stroke Risk & Recovery Intelligence System',
    desc: 'A clinical decision-support platform that turns messy medical data into real-time stroke risk stratification and recovery forecasts for physicians.',
    points: [
      'Multi-model ensemble — XGBoost, Random Survival Forests & VGG19 CNN — scoring risk in real time and forecasting 90-day recovery.',
      'NLP + OCR pipeline digests handwritten discharge summaries and lab reports into structured prediction features.',
      'DoWhy Causal AI Sandbox lets physicians simulate What-If interventions before they happen.',
    ],
    tech: ['FastAPI', 'XGBoost', 'VGG19 CNN', 'Next.js', 'Docker'],
    accent: '#22d3ee',
    accent2: '#60a5fa',
    icon: 'HeartPulse',
    orbit: ['ensemble', 'OCR+NLP', 'causal AI'],
    source: 'https://github.com/Lavish911/SRRIS-Stroke-Risk-Recovery-Information-System-',
    live: null,
  },
  {
    id: 'aura',
    tag: '// multimodal ML',
    title: 'Aura AI',
    sub: 'Emotion-aware Recommendation Engine',
    desc: 'A recommendation engine that reads the room — literally — fusing facial emotion recognition with personality modeling from language.',
    points: [
      'DeepFace computer-vision pipeline reads user emotions; BERT transformers infer personality traits from text.',
      'Weighted fusion scoring blends vision + language signals into one emotionally-aware ranking system.',
      'Full ML pipeline from preprocessing to inference, deployed on a scalable Linux environment via Streamlit.',
    ],
    tech: ['Python', 'Streamlit', 'DeepFace', 'BERT', 'Scikit-learn'],
    accent: '#f472b6',
    accent2: '#a78bfa',
    icon: 'Sparkles',
    orbit: ['emotion', 'personality', 'fusion'],
    source: 'https://github.com/Lavish911/aura_ai',
    live: null,
  },
  {
    id: 'copilot',
    tag: '// real-time AI',
    title: 'Interview Copilot AI',
    sub: 'Low-latency Live Interview Assistant',
    desc: 'A WebSocket-native AI companion that delivers real-time technical support during live interviews and coding sessions.',
    points: [
      'Socket.io streaming keeps Gemini-powered responses under 2 seconds for live sessions.',
      'Context-aware server-side orchestration of the Google Gemini API.',
      'Dockerized and shipped through CI/CD pipelines for automated testing and zero-downtime delivery.',
    ],
    tech: ['React', 'Node.js', 'Socket.io', 'Gemini API', 'Docker'],
    accent: '#34d399',
    accent2: '#22d3ee',
    icon: 'Terminal',
    orbit: ['<2s latency', 'websockets', 'CI/CD'],
    source: 'https://github.com/Lavish911/free-cluely',
    live: 'request',
  },
  {
    id: 'votechain',
    tag: '// web3 × full-stack',
    title: 'VoteChain',
    sub: 'Decentralized E-Voting System',
    desc: 'A full-stack decentralized voting platform where every ballot is tamper-evident and every voter can verify the count.',
    points: [
      'End-to-end voting flow — register, cast, verify — backed by an immutable distributed ledger.',
      'Role-based access and authentication keep elections honest and voters private.',
      'Built as a complete full-stack product: smart contracts, API layer and a responsive client.',
    ],
    tech: ['Blockchain', 'Full-Stack', 'Auth', 'Web App'],
    accent: '#fbbf24',
    accent2: '#34d399',
    icon: 'Vote',
    orbit: ['transparent', 'tamper-proof', 'verifiable'],
    source: 'https://github.com/Lavish911/Voting-Full_stack',
    live: null,
  },
]

export const TIMELINE = [
  {
    period: 'Jul 2025 — Jan 2026',
    role: 'Full Stack Developer Intern',
    org: 'Ativeer Solutions',
    loc: 'Kanpur, IN',
    points: [
      'Built & maintained a scalable e-commerce backend on Node.js + MongoDB — handling 1,000+ daily requests with optimized queries.',
      'Architected React.js apps on microservices supporting 10,000+ active users at 99.9% uptime.',
      'Shipped data-driven UI/UX improvements that lifted session duration by 15%.',
    ],
    tags: ['Node.js', 'MongoDB', 'React.js', 'Microservices'],
  },
  {
    period: 'Apr 2025 — May 2025',
    role: 'Web Development Intern',
    org: 'Byte Uprise',
    loc: 'Nagpur, IN',
    points: [
      'Cut front-end load times by 30% via code splitting, lazy loading and caching strategies.',
      'Implemented JWT-based auth and Jest unit testing inside an Agile/Scrum workflow.',
      'Delivered full-stack React + Node features; structured testing workflows reduced bug reports.',
    ],
    tags: ['React.js', 'Node.js', 'JWT', 'Jest'],
  },
]

export const EDUCATION = {
  school: 'G. H. Raisoni College of Engineering & Management',
  degree: 'B.Tech — Artificial Intelligence & Machine Learning',
  period: 'Aug 2022 — May 2026',
  loc: 'Nagpur, MH',
}

export const SECTIONS = {
  about: { index: '01', eyebrow: '// human_interface', title: 'Code, models & relentless curiosity.' },
  skills: { index: '02', eyebrow: '// arsenal_loaded', title: 'The weapons-grade toolkit.' },
  projects: { index: '03', eyebrow: '// deployed_systems', title: 'Selected work, battle-tested.' },
  experience: { index: '04', eyebrow: '// flight_recorder', title: 'The journey so far.' },
}
