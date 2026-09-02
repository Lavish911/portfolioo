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
  sub: 'AI & ML engineer building intelligent software across machine learning, real-time systems and full-stack development.',
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
    tag: 'CLINICAL AI • DECISION SUPPORT',
    title: 'SRRIS',
    sub: 'Stroke Risk & Recovery Intelligence System — 2025',
    desc: 'SRRIS turns fragmented stroke-unit data — imaging, labs, handwritten discharge notes — into a single risk picture clinicians can act on within seconds of admission.',
    points: [
      'XGBoost, Random Survival Forests and VGG19 CNN for real-time stroke risk stratification and 90-day recovery forecasting.',
      'NLP + OCR pipeline extracts structured signals from handwritten discharge summaries and lab reports.',
      'DoWhy Causal AI Sandbox lets physicians explore intervention outcomes before acting.',
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
    tag: 'MULTIMODAL AI • RECOMMENDATIONS',
    title: 'Aura AI',
    sub: 'Multimodal Recommendation Engine — 2025',
    desc: 'Aura AI reads how you feel and how you think — emotion from the camera, personality from your writing — and recommends content that fits the moment rather than the average.',
    points: [
      'DeepFace reads emotion through computer vision; BERT-based NLP reads personality from text.',
      'Weighted scoring fuses both signals into a single human-centred ranking.',
      'Full pipeline from preprocessing to inference in a Streamlit experience.',
    ],
    tech: ['Python', 'Streamlit', 'DeepFace', 'BERT', 'Scikit-learn'],
    accent: '#a78bfa',
    accent2: '#f472b6',
    icon: 'Sparkles',
    orbit: ['emotion', 'personality', 'fusion'],
    source: 'https://github.com/Lavish911/aura_ai',
    live: null,
  },
  {
    id: 'copilot',
    tag: 'REAL-TIME AI • FULL-STACK',
    title: 'Interview Copilot AI',
    sub: 'Real-time technical interview assistant — 2025',
    desc: 'A live assistant that listens to a technical interview, understands the question in context, and surfaces a structured answer before the silence gets awkward.',
    points: [
      'React, Node.js, Socket.io and Gemini in a responsive assistant for live interviews — responses under two seconds.',
      'WebSockets keep the experience in sync; Gemini orchestration stays context-aware.',
      'Docker + CI/CD for repeatable, zero-downtime delivery.',
    ],
    tech: ['React', 'Node.js', 'Socket.io', 'Gemini API', 'Docker'],
    accent: '#f472b6',
    accent2: '#22d3ee',
    icon: 'Terminal',
    orbit: ['<2s latency', 'websockets', 'CI/CD'],
    source: 'https://github.com/Lavish911/free-cluely',
    live: 'https://interview-copilot-aii.vercel.app',
  },
  {
    id: 'trader',
    tag: 'DATA SCIENCE • APPLIED ML',
    title: 'Trader Behavior Insights',
    sub: 'Bitcoin Sentiment × Trader Performance — 2025',
    desc: 'An interactive analytics dashboard connecting Bitcoin market sentiment with trader performance, risk, and behavior.',
    points: [
      'Merges Bitcoin Fear & Greed Index with Hyperliquid trading records to uncover how market regimes shape outcomes.',
      'Data cleaning, rolling correlations, P&L distributions, win rates, Sharpe ratios, drawdowns and exportable analysis.',
      'Built with Python, Pandas, NumPy, Plotly and SciPy in a Streamlit dashboard.',
    ],
    tech: ['Python', 'Pandas', 'Plotly', 'Streamlit', 'SciPy'],
    accent: '#fbbf24',
    accent2: '#f59e0b',
    icon: 'BarChart3',
    orbit: ['Fear & Greed', 'P&L analytics', 'Sharpe & risk'],
    source: 'https://github.com/Lavish911/trader-behavior-insights-lavish',
    live: null,
  },
  {
    id: 'votechain',
    tag: 'WEB3 • FULL-STACK',
    title: 'Decentralized Voting',
    sub: 'Transparent E-Voting System — 2025',
    desc: 'A transparent e-voting system that pairs a web interface with Ethereum smart contracts and real-time result tracking.',
    points: [
      'Full-stack election experience with authentication, vote handling and live result tracking.',
      'JavaScript, HTML/CSS and Solidity on Ethereum for secure, transparent voting.',
      'Real-time results and verifiable, tamper-evident ballots.',
    ],
    tech: ['Solidity', 'Ethereum', 'JavaScript', 'Web3'],
    accent: '#38bdf8',
    accent2: '#34d399',
    icon: 'Vote',
    orbit: ['transparent', 'on-chain', 'real-time'],
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
