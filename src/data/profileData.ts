export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  bio: string;
  location: string;
  blog: string;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  fork: boolean;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  pushed_at: string;
  homepage: string | null;
  topics?: string[];
  category?: 'AI & ML' | 'Full-Stack' | 'Mobile' | 'Backend';
}

export interface FeaturedProject {
  id: string;
  num: string;
  title: string;
  subtitle: string;
  category: 'AI & LLM Systems' | 'Conversational AI' | 'Full-Stack Platform' | 'Mobile App';
  description: string;
  highlights: string[];
  tech: string[];
  repoUrl: string;
  liveUrl?: string;
  award?: string;
  languageBreakdown: { lang: string; pct: number; color: string }[];
}

export interface HuggingFaceModel {
  id: string;
  name: string;
  baseModel: string;
  method: string;
  format: string;
  description: string;
  tags: string[];
  downloads: number;
  updatedAt: string;
  url: string;
  codeSnippet: string;
}

export interface TechSkill {
  name: string;
  category: 'AI & LLMs' | 'Backend & APIs' | 'Frontend & Mobile' | 'Data & DevOps';
  role: string;
  iconSlug?: string;
  iconUrl?: string;
  level: 'Core' | 'Production' | 'Research';
}

export interface CredentialItem {
  id: string;
  title: string;
  role: string;
  organization: string;
  period: string;
  badge: string;
  description: string;
}

export const INITIAL_USER: GitHubUser = {
  login: 'Seavik2142',
  name: 'Mao Seavik',
  avatar_url: '/profile.jpg',
  html_url: 'https://github.com/Seavik2142',
  bio: 'Software developer based in Cambodia focused on fine-tuning open-source language models (Qwen2.5, PEFT/LoRA, GGUF), building conversational AI systems with Google Gemini, and architecting reliable backend services in Python and TypeScript.',
  location: 'Phnom Penh, Cambodia',
  blog: 'https://seavik-gamma.vercel.app/',
  public_repos: 23,
  followers: 2,
  following: 2,
  created_at: '2025-01-15T04:15:51Z',
  updated_at: '2026-11-14T18:43:21Z',
};

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    id: 'chhlatai',
    num: '01',
    title: 'ChhlatAI',
    subtitle: 'Conversational Commerce & Copilot Inbox',
    category: 'Conversational AI',
    description:
      'Unified social-commerce inbox connecting Telegram, Messenger, Instagram, and TikTok with Google Gemini agents, automated Bakong KHQR invoicing, and receipt verification.',
    highlights: [
      'Context-aware customer support and order workflows powered by Google Gemini',
      'Automated Bakong KHQR payment generation and payment slip validation',
      'FastAPI and TypeScript/React architecture deployed with PostgreSQL and Docker',
    ],
    tech: ['TypeScript', 'Python', 'FastAPI', 'Google Gemini', 'React', 'PostgreSQL', 'Docker'],
    repoUrl: 'https://github.com/Seavik2142/ChhlatAI',
    languageBreakdown: [
      { lang: 'TypeScript', pct: 69.8, color: '#3178C6' },
      { lang: 'Python', pct: 29.3, color: '#3572A5' },
      { lang: 'Docker & CSS', pct: 0.9, color: '#71717A' },
    ],
  },
  {
    id: 'agrisystem-ai',
    num: '02',
    title: 'AgriSystem AI',
    subtitle: 'Agricultural Expert System & Fine-Tuned LLMs',
    category: 'AI & LLM Systems',
    description:
      'Domain-specific agricultural advisory platform powered by fine-tuned Qwen2.5-3B models. Provides crop disease diagnosis, localized weather risk alerts, and bilingual Khmer/English guidance.',
    highlights: [
      'Published four fine-tuned Qwen2.5 LoRA adapters and GGUF models on Hugging Face',
      'Symptom-based diagnostic engine paired with real-time weather risk indicators',
      'Presented at Norton University AI Expert System & Innovation 2026',
    ],
    tech: ['Python', 'Qwen2.5-3B', 'PEFT / LoRA', 'GGUF', 'Flask', 'PostgreSQL'],
    repoUrl: 'https://huggingface.co/Maoseavik',
    liveUrl: 'https://agricultureexp.space',
    award: 'Innovation Excellence 2026',
    languageBreakdown: [
      { lang: 'Python', pct: 82.0, color: '#3572A5' },
      { lang: 'Model Weights', pct: 18.0, color: '#EAB308' },
    ],
  },
  {
    id: 'digital-keys-mini-app',
    num: '03',
    title: 'Digital Keys PRO',
    subtitle: 'Telegram Mini App & Digital License Store',
    category: 'Full-Stack Platform',
    description:
      'High-speed Telegram WebApp storefront designed for instant software key delivery, automated inventory management, and native Telegram checkout.',
    highlights: [
      'Native Telegram WebApp authentication and streamlined purchase flow',
      'Automated license provisioning and real-time order history tracking',
      'Built with TypeScript, React, Node.js, and PostgreSQL',
    ],
    tech: ['TypeScript', 'React', 'Node.js', 'Telegram SDK', 'PostgreSQL', 'Docker'],
    repoUrl: 'https://github.com/Seavik2142/mini_app',
    liveUrl: 'https://mini-app-alpha-roan.vercel.app',
    languageBreakdown: [
      { lang: 'TypeScript', pct: 47.4, color: '#3178C6' },
      { lang: 'HTML & UI', pct: 36.2, color: '#E34C26' },
      { lang: 'JavaScript', pct: 16.4, color: '#F7DF1E' },
    ],
  },
  {
    id: 'driving-system',
    num: '04',
    title: 'Driving License Prep',
    subtitle: 'Cross-Platform Mobile Examination Suite',
    category: 'Mobile App',
    description:
      'Mobile learning and mock-examination app built with Flutter and Dart to help drivers study traffic regulations, road signs, and timed theory tests.',
    highlights: [
      'Cross-platform Flutter interface with clean question navigation',
      'Timed mock exams with instant explanations and score summaries',
      'Compiled natively for mobile and desktop platforms',
    ],
    tech: ['Flutter', 'Dart', 'Mobile UI', 'Cross-Platform'],
    repoUrl: 'https://github.com/Seavik2142/driving-system',
    languageBreakdown: [
      { lang: 'Dart', pct: 63.7, color: '#00B4AB' },
      { lang: 'C++ / Native', pct: 36.3, color: '#71717A' },
    ],
  },
  {
    id: 'ksn-music',
    num: '05',
    title: 'KSN Music',
    subtitle: 'Audio Streaming & Media Library Platform',
    category: 'Full-Stack Platform',
    description:
      'Web audio streaming platform built with Laravel and modern JavaScript, featuring curated playlists, persistent playback controls, and catalog management.',
    highlights: [
      'Structured Laravel backend for audio metadata and playlist indexing',
      'Continuous playback queue with responsive interface controls',
      'Backed by MySQL and styled with Tailwind CSS',
    ],
    tech: ['Laravel', 'PHP', 'JavaScript', 'Tailwind CSS', 'MySQL'],
    repoUrl: 'https://github.com/Seavik2142/ksnmusic',
    languageBreakdown: [
      { lang: 'PHP', pct: 74.0, color: '#4F5D95' },
      { lang: 'JavaScript & CSS', pct: 26.0, color: '#F7DF1E' },
    ],
  },
  {
    id: 'school-manage',
    num: '06',
    title: 'Academic & Property Systems',
    subtitle: 'Python & PostgreSQL Management Software',
    category: 'Full-Stack Platform',
    description:
      'Administrative platforms for school records and property management, engineered with Python and PostgreSQL to handle scheduling, billing, and reporting.',
    highlights: [
      'Modular Python backend services for student and course administration',
      'PostgreSQL database schema with stored procedures for data integrity',
      'Role-based views for administrators and staff',
    ],
    tech: ['Python', 'JavaScript', 'PostgreSQL', 'PL/pgSQL', 'REST API'],
    repoUrl: 'https://github.com/Seavik2142/School_Manage',
    languageBreakdown: [
      { lang: 'Python', pct: 68.0, color: '#3572A5' },
      { lang: 'JavaScript & SQL', pct: 32.0, color: '#F7DF1E' },
    ],
  },
];

export const HUGGING_FACE_MODELS: HuggingFaceModel[] = [
  {
    id: 'Maoseavik/agri-qwen3b-lora',
    name: 'agri-qwen3b-lora',
    baseModel: 'Qwen/Qwen2.5-3B-Instruct',
    method: 'SFT · LoRA',
    format: 'SafeTensors',
    description:
      'Supervised fine-tuned LoRA adapter on Qwen2.5-3B-Instruct trained for crop disease diagnosis, treatment planning, and agricultural Q&A.',
    tags: ['Qwen2.5-3B', 'SFT', 'TRL', 'SafeTensors'],
    downloads: 14,
    updatedAt: 'Sep 2026',
    url: 'https://huggingface.co/Maoseavik/agri-qwen3b-lora',
    codeSnippet: `from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

base_id = "Qwen/Qwen2.5-3B-Instruct"
adapter_id = "Maoseavik/agri-qwen3b-lora"

tokenizer = AutoTokenizer.from_pretrained(base_id)
base_model = AutoModelForCausalLM.from_pretrained(base_id, device_map="auto")
model = PeftModel.from_pretrained(base_model, adapter_id)

messages = [{"role": "user", "content": "Diagnose yellowing lower rice leaves with brown spots."}]
prompt = tokenizer.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
outputs = model.generate(**inputs, max_new_tokens=256)
print(tokenizer.decode(outputs[0], skip_special_tokens=True))`,
  },
  {
    id: 'Maoseavik/agrisystem-qwen2.5-3b-gguf',
    name: 'agrisystem-qwen2.5-3b-gguf',
    baseModel: 'Qwen/Qwen2.5-3B-Instruct',
    method: 'Quantized GGUF',
    format: 'GGUF (Edge / CPU)',
    description:
      'Quantized GGUF build of the AgriSystem Qwen2.5-3B model for low-latency local and CPU inference using llama.cpp or Ollama.',
    tags: ['GGUF', 'llama.cpp', 'Edge Inference'],
    downloads: 19,
    updatedAt: 'Sep 2026',
    url: 'https://huggingface.co/Maoseavik/agrisystem-qwen2.5-3b-gguf',
    codeSnippet: `from llama_cpp import Llama

llm = Llama.from_pretrained(
    repo_id="Maoseavik/agrisystem-qwen2.5-3b-gguf",
    filename="*.gguf",
    n_ctx=4096,
)

response = llm.create_chat_completion(
    messages=[
        {"role": "system", "content": "You are an Agricultural Expert System assistant."},
        {"role": "user", "content": "Recommended irrigation schedule for dry-season cassava?"}
    ]
)
print(response["choices"][0]["message"]["content"])`,
  },
  {
    id: 'Maoseavik/agrisystem-qwen2.5-3b-adapter',
    name: 'agrisystem-qwen2.5-3b-adapter',
    baseModel: 'Qwen/Qwen2.5-3B-Instruct',
    method: 'PEFT Adapter',
    format: 'Transformers',
    description:
      'Parameter-efficient adapter weights trained on curated agricultural knowledge bases for structured symptom-to-treatment reasoning.',
    tags: ['Transformers', 'Adapter', 'Qwen2.5-3B'],
    downloads: 11,
    updatedAt: 'Sep 2026',
    url: 'https://huggingface.co/Maoseavik/agrisystem-qwen2.5-3b-adapter',
    codeSnippet: `from transformers import AutoTokenizer, AutoModelForCausalLM

model_id = "Maoseavik/agrisystem-qwen2.5-3b-adapter"
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-3B-Instruct")
model = AutoModelForCausalLM.from_pretrained(model_id, device_map="auto")`,
  },
  {
    id: 'Maoseavik/agri-expert-adapter',
    name: 'agri-expert-adapter',
    baseModel: 'Qwen/Qwen2.5-1.5B-Instruct',
    method: 'PEFT · LoRA (1.5B)',
    format: 'SafeTensors',
    description:
      'Compact 1.5B LoRA adapter built for fast conversational response times on memory-constrained hardware.',
    tags: ['PEFT', 'LoRA', 'Qwen2.5-1.5B'],
    downloads: 16,
    updatedAt: 'Sep 2026',
    url: 'https://huggingface.co/Maoseavik/agri-expert-adapter',
    codeSnippet: `from peft import AutoPeftModelForCausalLM
from transformers import AutoTokenizer

model_id = "Maoseavik/agri-expert-adapter"
tokenizer = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-1.5B-Instruct")
model = AutoPeftModelForCausalLM.from_pretrained(model_id, device_map="auto")`,
  },
];

export const TECH_STACK: TechSkill[] = [
  {
    name: 'Python',
    category: 'Backend & APIs',
    role: 'Primary AI, Data Science & Backend Language',
    iconSlug: 'python',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    level: 'Core',
  },
  {
    name: 'PyTorch',
    category: 'AI & LLMs',
    role: 'Deep Learning & Neural Network Training',
    iconSlug: 'pytorch',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pytorch/pytorch-original.svg',
    level: 'Core',
  },
  {
    name: 'TensorFlow',
    category: 'AI & LLMs',
    role: 'Deep Learning Models & Production ML Pipelines',
    iconSlug: 'tensorflow',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg',
    level: 'Core',
  },
  {
    name: 'Hugging Face',
    category: 'AI & LLMs',
    role: 'Transformers, Model Hub, Datasets & Inference',
    iconUrl: 'https://huggingface.co/front/assets/huggingface_logo-noborder.svg',
    level: 'Core',
  },
  {
    name: 'LangChain',
    category: 'AI & LLMs',
    role: 'LLM Orchestration, RAG & Agentic Workflows',
    iconUrl: 'https://cdn.simpleicons.org/langchain/10B981',
    level: 'Core',
  },
  {
    name: 'PEFT · LoRA · GGUF',
    category: 'AI & LLMs',
    role: 'Parameter-Efficient Fine-Tuning & Quantization',
    iconUrl: 'https://cdn.simpleicons.org/weightsandbiases/FFBE00',
    level: 'Core',
  },
  {
    name: 'NumPy',
    category: 'Data & DevOps',
    role: 'High-Performance Numerical & Tensor Computing',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg',
    level: 'Core',
  },
  {
    name: 'Pandas',
    category: 'Data & DevOps',
    role: 'Data Wrangling, Cleaning & Feature Engineering',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg',
    level: 'Core',
  },
  {
    name: 'Scikit-learn',
    category: 'AI & LLMs',
    role: 'Classical Machine Learning & Model Evaluation',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/scikitlearn/scikitlearn-original.svg',
    level: 'Core',
  },
  {
    name: 'Matplotlib',
    category: 'Data & DevOps',
    role: 'Scientific Data Visualization & Analytics Plots',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matplotlib/matplotlib-original.svg',
    level: 'Core',
  },
  {
    name: 'Jupyter',
    category: 'Data & DevOps',
    role: 'Interactive ML Experimentation & Research Notebooks',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jupyter/jupyter-original.svg',
    level: 'Core',
  },
  {
    name: 'Streamlit',
    category: 'Frontend & Mobile',
    role: 'Interactive AI & Data Science Web Applications',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/streamlit/streamlit-original.svg',
    level: 'Core',
  },
  {
    name: 'FastAPI',
    category: 'Backend & APIs',
    role: 'High-Performance Async Python AI & REST APIs',
    iconSlug: 'fastapi',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg',
    level: 'Core',
  },
  {
    name: 'Flask',
    category: 'Backend & APIs',
    role: 'ML Model Serving & Lightweight Web Backends',
    iconSlug: 'flask',
    iconUrl: 'https://cdn.simpleicons.org/flask/38BDF8',
    level: 'Production',
  },
  {
    name: 'TypeScript',
    category: 'Frontend & Mobile',
    role: 'Type-Safe Full-Stack Web Applications',
    iconSlug: 'ts',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
    level: 'Core',
  },
  {
    name: 'React',
    category: 'Frontend & Mobile',
    role: 'Modern Frontend Interfaces & AI Dashboards',
    iconSlug: 'react',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    level: 'Core',
  },
  {
    name: 'PostgreSQL',
    category: 'Data & DevOps',
    role: 'Relational Databases & PL/pgSQL',
    iconSlug: 'postgres',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
    level: 'Core',
  },
  {
    name: 'Docker',
    category: 'Data & DevOps',
    role: 'Containerized AI & Backend Deployments',
    iconSlug: 'docker',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
    level: 'Production',
  },
  {
    name: 'Git & GitHub Actions',
    category: 'Data & DevOps',
    role: 'Version Control & CI/CD Workflows',
    iconSlug: 'git',
    iconUrl: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg',
    level: 'Core',
  },
];

export const CREDENTIALS: CredentialItem[] = [
  {
    id: 'kru-backend-internship',
    title: 'Backend Software Engineering Intern',
    role: 'KRU IT Solution & ETEC Center',
    organization: 'Phnom Penh, Cambodia',
    period: 'Oct 2026',
    badge: 'Internship',
    description:
      'Built backend API services, relational database schemas, and server-side application logic in a collaborative engineering team.',
  },
  {
    id: 'norton-ai-expert-system',
    title: 'Team Lead — AI Expert System & Innovation',
    role: 'Norton University · Dept. of Computer Studies',
    organization: '4-Member Engineering Team',
    period: 'Sep 2026',
    badge: 'Innovation Award',
    description:
      'Led dataset curation, Qwen2.5-3B LoRA fine-tuning, and full-stack implementation for the bilingual Agriculture Expert System.',
  },
  {
    id: 'norton-university-cs',
    title: 'B.Sc. in Computer Studies (Software Development)',
    role: 'Norton University',
    organization: 'Foundation Year Distinguished Standing',
    period: '2024 — Present',
    badge: 'Education',
    description:
      'Undergraduate coursework and research in Artificial Intelligence, Software Engineering, and Distributed Systems.',
  },
];

export const FALLBACK_REPOS: GitHubRepo[] = [
  {
    id: 1,
    name: 'ChhlatAI',
    full_name: 'Seavik2142/ChhlatAI',
    html_url: 'https://github.com/Seavik2142/ChhlatAI',
    description:
      'Omnichannel AI commerce CRM and copilot inbox built with Google Gemini, FastAPI, React, and Bakong KHQR.',
    fork: false,
    language: 'TypeScript',
    stargazers_count: 1,
    forks_count: 0,
    pushed_at: '2026-10-27T00:00:00Z',
    homepage: null,
    category: 'AI & ML',
  },
  {
    id: 2,
    name: 'School_Manage',
    full_name: 'Seavik2142/School_Manage',
    html_url: 'https://github.com/Seavik2142/School_Manage',
    description: 'Academic and student records management system written in Python.',
    fork: false,
    language: 'Python',
    stargazers_count: 1,
    forks_count: 0,
    pushed_at: '2026-11-14T00:00:00Z',
    homepage: null,
    category: 'Backend',
  },
  {
    id: 3,
    name: 'Seavik',
    full_name: 'Seavik2142/Seavik',
    html_url: 'https://github.com/Seavik2142/Seavik',
    description: 'Personal developer portfolio and project showcase deployed on Vercel.',
    fork: false,
    language: 'JavaScript',
    stargazers_count: 1,
    forks_count: 0,
    pushed_at: '2026-10-31T00:00:00Z',
    homepage: 'https://seavik-gamma.vercel.app',
    category: 'Full-Stack',
  },
  {
    id: 4,
    name: 'mini_app',
    full_name: 'Seavik2142/mini_app',
    html_url: 'https://github.com/Seavik2142/mini_app',
    description: 'Telegram Mini App storefront for digital software keys and instant delivery.',
    fork: false,
    language: 'TypeScript',
    stargazers_count: 1,
    forks_count: 0,
    pushed_at: '2026-07-28T00:00:00Z',
    homepage: 'https://mini-app-alpha-roan.vercel.app',
    category: 'Full-Stack',
  },
  {
    id: 5,
    name: 'ksnmusic',
    full_name: 'Seavik2142/ksnmusic',
    html_url: 'https://github.com/Seavik2142/ksnmusic',
    description: 'Audio streaming web application built with Laravel, PHP, and JavaScript.',
    fork: false,
    language: 'PHP',
    stargazers_count: 1,
    forks_count: 0,
    pushed_at: '2026-10-16T00:00:00Z',
    homepage: null,
    category: 'Full-Stack',
  },
  {
    id: 6,
    name: 'driving-system',
    full_name: 'Seavik2142/driving-system',
    html_url: 'https://github.com/Seavik2142/driving-system',
    description: 'Cross-platform Flutter mobile app for practicing driving license theory exams.',
    fork: false,
    language: 'Dart',
    stargazers_count: 1,
    forks_count: 0,
    pushed_at: '2026-06-03T00:00:00Z',
    homepage: null,
    category: 'Mobile',
  },
  {
    id: 7,
    name: 'Fullstack-House-management',
    full_name: 'Seavik2142/Fullstack-House-management',
    html_url: 'https://github.com/Seavik2142/Fullstack-House-management',
    description: 'Full-stack property and rental management system backed by PostgreSQL.',
    fork: false,
    language: 'JavaScript',
    stargazers_count: 1,
    forks_count: 0,
    pushed_at: '2026-03-19T00:00:00Z',
    homepage: null,
    category: 'Full-Stack',
  },
  {
    id: 8,
    name: 'ai-subtitle-generator',
    full_name: 'Seavik2142/ai-subtitle-generator',
    html_url: 'https://github.com/Seavik2142/ai-subtitle-generator',
    description: 'Automated speech-to-text video subtitle generation tool in Python.',
    fork: false,
    language: 'Python',
    stargazers_count: 1,
    forks_count: 0,
    pushed_at: '2025-07-04T00:00:00Z',
    homepage: null,
    category: 'AI & ML',
  },
  {
    id: 9,
    name: 'discord-gemini-saas',
    full_name: 'Seavik2142/discord-gemini-saas',
    html_url: 'https://github.com/Seavik2142/discord-gemini-saas',
    description: 'Discord assistant integrating Google Gemini for automated community workflows.',
    fork: false,
    language: 'JavaScript',
    stargazers_count: 1,
    forks_count: 0,
    pushed_at: '2026-01-04T00:00:00Z',
    homepage: null,
    category: 'AI & ML',
  },
  {
    id: 10,
    name: 'VideoExpertsystem',
    full_name: 'Seavik2142/VideoExpertsystem',
    html_url: 'https://github.com/Seavik2142/VideoExpertsystem',
    description: 'Rule-based video recommendation and expert system.',
    fork: false,
    language: 'Python',
    stargazers_count: 1,
    forks_count: 0,
    pushed_at: '2026-04-25T00:00:00Z',
    homepage: null,
    category: 'AI & ML',
  },
  {
    id: 11,
    name: 'Study-Python',
    full_name: 'Seavik2142/Study-Python',
    html_url: 'https://github.com/Seavik2142/Study-Python',
    description: 'Data structures, algorithms, and backend patterns in Python.',
    fork: false,
    language: 'Python',
    stargazers_count: 1,
    forks_count: 0,
    pushed_at: '2026-11-02T00:00:00Z',
    homepage: null,
    category: 'Backend',
  },
  {
    id: 12,
    name: 'mis',
    full_name: 'Seavik2142/mis',
    html_url: 'https://github.com/Seavik2142/mis',
    description: 'Management Information System web application written in TypeScript.',
    fork: false,
    language: 'TypeScript',
    stargazers_count: 1,
    forks_count: 0,
    pushed_at: '2026-07-08T00:00:00Z',
    homepage: null,
    category: 'Full-Stack',
  },
];

export const CLEAN_GITHUB_README_MARKDOWN = `<div align="center">

# Mao Seavik

**AI Engineer & Backend Software Developer**  
Phnom Penh, Cambodia · B.Sc. Computer Studies at Norton University

[![Portfolio](https://img.shields.io/badge/Portfolio-seavik--gamma.vercel.app-18181B?style=flat-square&logo=vercel&logoColor=white)](https://seavik-gamma.vercel.app/)
[![Hugging Face](https://img.shields.io/badge/Hugging_Face-Maoseavik-18181B?style=flat-square&logo=huggingface&logoColor=FFD21E)](https://huggingface.co/Maoseavik)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Mao_Seavik-18181B?style=flat-square&logo=linkedin&logoColor=0A66C2)](https://www.linkedin.com/in/mao-seavik-003a0a372)
[![GitHub](https://img.shields.io/badge/GitHub-Seavik2142-18181B?style=flat-square&logo=github&logoColor=white)](https://github.com/Seavik2142)

</div>

---

### About

I am an AI Engineer and Software Developer specializing in **open-source LLM fine-tuning** (\`Qwen2.5\`, \`SFT\`, \`PEFT/LoRA\`, \`GGUF\`), **Python backend services** (\`FastAPI\`, \`Flask\`, \`PostgreSQL\`), and **full-stack applications** (\`TypeScript\`, \`React\`, \`Next.js\`, \`Flutter\`).

- **Research & Models:** Published 4 domain-adapted agricultural language models on [Hugging Face (@Maoseavik)](https://huggingface.co/Maoseavik).
- **Engineering Focus:** Conversational AI agents, API design, and production web/mobile systems.
- **Opportunities:** Open to AI Engineering internships, backend roles, and international research collaboration.

---

### Published Language Models ([Hugging Face](https://huggingface.co/Maoseavik))

| Model | Base Architecture | Method | Purpose |
| :--- | :--- | :--- | :--- |
| [**agri-qwen3b-lora**](https://huggingface.co/Maoseavik/agri-qwen3b-lora) | \`Qwen2.5-3B-Instruct\` | \`SFT · TRL · LoRA\` | Crop disease diagnosis & agricultural advisory |
| [**agrisystem-qwen2.5-3b-gguf**](https://huggingface.co/Maoseavik/agrisystem-qwen2.5-3b-gguf) | \`Qwen2.5-3B-Instruct\` | \`Quantized GGUF\` | Low-latency CPU & edge inference (\`llama.cpp\`) |
| [**agrisystem-qwen2.5-3b-adapter**](https://huggingface.co/Maoseavik/agrisystem-qwen2.5-3b-adapter) | \`Qwen2.5-3B-Instruct\` | \`PEFT Adapter\` | Symptom-to-treatment domain reasoning |
| [**agri-expert-adapter**](https://huggingface.co/Maoseavik/agri-expert-adapter) | \`Qwen2.5-1.5B-Instruct\` | \`PEFT · SafeTensors\` | Lightweight conversational assistant |

---

### Selected Projects

| Project | Stack | Summary |
| :--- | :--- | :--- |
| [**ChhlatAI**](https://github.com/Seavik2142/ChhlatAI) | \`TypeScript\` \`FastAPI\` \`Gemini\` \`PostgreSQL\` | Omnichannel AI social-commerce CRM & copilot inbox with automated Bakong KHQR invoicing. |
| [**AgriSystem AI**](https://agricultureexp.space) | \`Python\` \`Qwen2.5-3B\` \`LoRA\` \`Flask\` | Bilingual (Khmer/English) agricultural expert system with fine-tuned LLMs and weather alerts. |
| [**Digital Keys PRO**](https://github.com/Seavik2142/mini_app) | \`TypeScript\` \`React\` \`Telegram SDK\` \`Node.js\` | Telegram Mini App marketplace for instant software key delivery ([Live Demo](https://mini-app-alpha-roan.vercel.app)). |
| [**Driving License Prep**](https://github.com/Seavik2142/driving-system) | \`Flutter\` \`Dart\` | Cross-platform mobile application for practicing driving theory examinations. |
| [**KSN Music**](https://github.com/Seavik2142/ksnmusic) | \`Laravel\` \`PHP\` \`JavaScript\` \`MySQL\` | Full-stack web audio streaming and playlist management platform. |

---

### Technical Stack

- **Deep Learning & LLMs:** PyTorch, TensorFlow, Hugging Face, LangChain, PEFT / LoRA, GGUF / llama.cpp
- **Data Science & ML Analytics:** NumPy, Pandas, Scikit-learn, Matplotlib, Jupyter, Streamlit
- **Backend & Web Interfaces:** Python, FastAPI, Flask, TypeScript, React, REST APIs
- **Databases & MLOps:** PostgreSQL, SQL / MySQL, Docker, Git, GitHub Actions, Linux

---

### GitHub Activity

<div align="center">
  <img width="49%" src="https://raw.githubusercontent.com/Seavik2142/Seavik2142/main/profile-summary-card-output/tokyonight/1-repos-per-language.svg" alt="Repos Per Language" />
  <img width="49%" src="https://raw.githubusercontent.com/Seavik2142/Seavik2142/main/profile-summary-card-output/tokyonight/4-productive-time.svg" alt="Productive Time" />
</div>

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/Seavik2142/Seavik2142/output/github-snake-dark.svg" />
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/Seavik2142/Seavik2142/output/github-snake.svg" />
    <img alt="Contribution Snake" src="https://raw.githubusercontent.com/Seavik2142/Seavik2142/output/github-snake.svg" width="100%" />
  </picture>
</div>
`;
