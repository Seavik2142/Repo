import React, { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Award,
  Check,
  Copy,
  FileText,
  FolderGit2,
  GitFork,
  Github,
  Globe,
  GraduationCap,
  KeyRound,
  Linkedin,
  MapPin,
  Moon,
  RefreshCw,
  Search,
  Star,
  Sun,
  X,
} from 'lucide-react';
import {
  CLEAN_GITHUB_README_MARKDOWN,
  CREDENTIALS,
  FALLBACK_REPOS,
  FEATURED_PROJECTS,
  GitHubRepo,
  GitHubUser,
  HUGGING_FACE_MODELS,
  INITIAL_USER,
  TECH_STACK,
} from './data/profileData';
import { InteractiveSnakeCard } from './components/InteractiveSnakeCard';
import { HuggingFaceModelsSection } from './components/HuggingFaceModelsSection';
import { ReadmeStudioModal } from './components/ReadmeStudioModal';
import {
  fetchGitHubWithGraphQL,
  fetchServerlessGitHub,
  getConfiguredGitHubToken,
  setConfiguredGitHubToken,
} from './utils/githubApi';

const LANGUAGE_COLORS: Record<string, string> = {
  Python: '#3572A5',
  TypeScript: '#3178C6',
  JavaScript: '#F7DF1E',
  'Jupyter Notebook': '#DA5B0B',
  Dart: '#00B4AB',
  PHP: '#4F5D95',
  HTML: '#E34C26',
  CSS: '#563D7C',
};

export function App() {
  const [user, setUser] = useState<GitHubUser>(INITIAL_USER);
  const [repos, setRepos] = useState<GitHubRepo[]>(FALLBACK_REPOS);
  const [hfDownloads, setHfDownloads] = useState<Record<string, number>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Filters
  const [projectCategory, setProjectCategory] = useState<string>('All');
  const [stackCategory, setStackCategory] = useState<string>('All');
  const [repoSearch, setRepoSearch] = useState<string>('');
  const [repoLang, setRepoLang] = useState<string>('All');

  // Modals & Theme
  const [isReadmeModalOpen, setIsReadmeModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [tokenInput, setTokenInput] = useState<string>(() => getConfiguredGitHubToken());
  const [apiAuthSource, setApiAuthSource] = useState<'graphql' | 'serverless' | 'rest'>('rest');
  const [copiedQuickReadme, setCopiedQuickReadme] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);

  const activeAvatar = isDarkMode ? '/profile-dark.jpg' : '/profile-light.jpg';

  const applyMergedRepos = (reposData: GitHubRepo[]) => {
    const fallbackMap = new Map(FALLBACK_REPOS.map((r) => [r.name.toLowerCase(), r]));
    const merged = reposData
      .map((r) => {
        const fb = fallbackMap.get(r.name.toLowerCase());
        return {
          ...r,
          description:
            r.description ||
            fb?.description ||
            `Public repository maintained by @Seavik2142.`,
          language: r.language || fb?.language || 'Python',
        };
      })
      .sort(
        (a, b) =>
          new Date(b.pushed_at || 0).getTime() - new Date(a.pushed_at || 0).getTime()
      );
    setRepos(merged);
  };

  const syncLiveProfile = async () => {
    setIsSyncing(true);
    setRefreshTrigger((t) => t + 1);
    try {
      const configuredToken = getConfiguredGitHubToken();

      // 1. Try Authenticated GitHub GraphQL (via local token or Vercel /api/github)
      const gqlPayload = configuredToken
        ? await fetchGitHubWithGraphQL(configuredToken, 'Seavik2142')
        : await fetchServerlessGitHub();

      if (gqlPayload && gqlPayload.authenticated && gqlPayload.user) {
        setApiAuthSource(gqlPayload.source);
        setUser((prev) => ({
          ...prev,
          ...gqlPayload.user,
          avatar_url: '/profile.jpg',
          name: gqlPayload.user?.name || prev.name,
          bio: prev.bio,
        }));
        if (Array.isArray(gqlPayload.repos) && gqlPayload.repos.length > 0) {
          applyMergedRepos(gqlPayload.repos);
        }
      } else {
        setApiAuthSource('rest');
        const authHeaders: Record<string, string> = configuredToken
          ? { Authorization: `Bearer ${configuredToken}` }
          : {};

        const [userRes, reposRes] = await Promise.allSettled([
          fetch('https://api.github.com/users/Seavik2142', {
            headers: authHeaders,
            cache: 'no-store',
          }),
          fetch(
            'https://api.github.com/users/Seavik2142/repos?per_page=100&sort=pushed&direction=desc',
            {
              headers: authHeaders,
              cache: 'no-store',
            }
          ),
        ]);

        if (userRes.status === 'fulfilled' && userRes.value.ok) {
          const userData = await userRes.value.json();
          setUser((prev) => ({
            ...prev,
            ...userData,
            avatar_url: '/profile.jpg',
            name: userData.name || prev.name,
            bio: prev.bio,
          }));
        }

        if (reposRes.status === 'fulfilled' && reposRes.value.ok) {
          const reposData: GitHubRepo[] = await reposRes.value.json();
          if (Array.isArray(reposData) && reposData.length > 0) {
            applyMergedRepos(reposData);
          }
        }
      }

      // Sync Hugging Face downloads in parallel
      const hfRes = await fetch('https://huggingface.co/api/models?author=Maoseavik', {
        cache: 'no-store',
      });
      if (hfRes.ok) {
        const hfData = await hfRes.json();
        if (Array.isArray(hfData)) {
          const dlMap: Record<string, number> = {};
          for (const item of hfData) {
            if (item.id && typeof item.downloads === 'number') {
              dlMap[item.id] = item.downloads;
            }
          }
          setHfDownloads(dlMap);
        }
      }
    } catch {
      // Fallback already loaded
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    syncLiveProfile();
    const interval = setInterval(syncLiveProfile, 60000);
    const onFocus = () => syncLiveProfile();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const filteredFeaturedProjects = useMemo(() => {
    if (projectCategory === 'All') return FEATURED_PROJECTS;
    return FEATURED_PROJECTS.filter((p) => p.category === projectCategory);
  }, [projectCategory]);

  const filteredTechStack = useMemo(() => {
    if (stackCategory === 'All') return TECH_STACK;
    return TECH_STACK.filter((t) => t.category === stackCategory);
  }, [stackCategory]);

  const availableRepoLanguages = useMemo(() => {
    const counts = new Map<string, number>();
    for (const r of repos) {
      if (r.language) {
        counts.set(r.language, (counts.get(r.language) || 0) + 1);
      }
    }
    return ['All', ...Array.from(counts.keys())];
  }, [repos]);

  const filteredRepos = useMemo(() => {
    return repos.filter((r) => {
      const matchesLang = repoLang === 'All' || r.language === repoLang;
      const q = repoSearch.trim().toLowerCase();
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.language && r.language.toLowerCase().includes(q));
      return matchesLang && matchesQuery;
    });
  }, [repos, repoLang, repoSearch]);

  const totalStars = useMemo(() => {
    return repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
  }, [repos]);

  const handleQuickCopyReadme = () => {
    navigator.clipboard.writeText(CLEAN_GITHUB_README_MARKDOWN);
    setCopiedQuickReadme(true);
    setTimeout(() => setCopiedQuickReadme(false), 2000);
  };

  return (
    <div
      className={`min-h-screen relative overflow-hidden transition-colors duration-300 ${
        isDarkMode ? 'bg-[#09090B] text-zinc-100' : 'theme-light bg-slate-50 text-zinc-900'
      }`}
    >
      {/* Subtle Animated Ambient Background & Micro-Grid */}
      <div className="pointer-events-none fixed inset-0 bg-micro-grid opacity-70" />
      <div className="pointer-events-none fixed -top-32 left-1/4 w-[520px] h-[340px] rounded-full bg-sky-500/[0.06] blur-[120px] animate-orb-slow" />
      <div className="pointer-events-none fixed top-1/3 right-12 w-[460px] h-[340px] rounded-full bg-emerald-500/[0.05] blur-[130px] animate-orb-reverse" />
      <div
        className="pointer-events-none fixed inset-x-0 top-0 h-96"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, rgba(255, 255, 255, 0.045) 0%, rgba(9, 9, 11, 0) 100%)',
        }}
      />

      {/* Sticky Top Header */}
      <header
        className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${
          isDarkMode ? 'border-zinc-800/80 bg-[#09090B]/85' : 'border-zinc-200 bg-white/85'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/Seavik2142"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 group"
            >
              <img
                src={activeAvatar}
                alt={user.name}
                className="w-8 h-8 rounded-full ring-1 ring-zinc-700 object-cover"
              />
              <div className="flex items-baseline gap-2">
                <span className="font-semibold text-sm text-zinc-100 group-hover:text-white transition-colors">
                  {user.name}
                </span>
                <span className="text-xs text-zinc-400">@{user.login}</span>
              </div>
            </a>
          </div>

          <nav className="hidden md:flex items-center gap-1 text-sm text-zinc-400">
            <a href="#overview" className="px-3 py-1.5 rounded-lg hover:text-zinc-100 transition-colors">
              Overview
            </a>
            <a href="#projects" className="px-3 py-1.5 rounded-lg hover:text-zinc-100 transition-colors">
              Projects
            </a>
            <a href="#ai-models" className="px-3 py-1.5 rounded-lg hover:text-zinc-100 transition-colors">
              Models
            </a>
            <a href="#telemetry" className="px-3 py-1.5 rounded-lg hover:text-zinc-100 transition-colors">
              Activity
            </a>
            <a href="#stack" className="px-3 py-1.5 rounded-lg hover:text-zinc-100 transition-colors">
              Stack
            </a>
            <a href="#repositories" className="px-3 py-1.5 rounded-lg hover:text-zinc-100 transition-colors">
              Repositories
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode((d) => !d)}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-colors"
            >
              {isDarkMode ? (
                <>
                  <Moon className="w-3.5 h-3.5 text-sky-400" />
                  <span className="hidden sm:inline">Dark</span>
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5 text-amber-500" />
                  <span className="hidden sm:inline">Light</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsApiKeyModalOpen(true)}
              title="Configure GitHub API Key for real-time GraphQL sync"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                apiAuthSource === 'graphql' || apiAuthSource === 'serverless'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border-zinc-800'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {apiAuthSource === 'graphql' || apiAuthSource === 'serverless'
                  ? 'API Key Active'
                  : 'API Key'}
              </span>
            </button>

            <button
              onClick={syncLiveProfile}
              disabled={isSyncing}
              title="Refresh GitHub data"
              className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border border-zinc-800 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-zinc-200' : ''}`} />
            </button>

            <button
              onClick={() => setIsReadmeModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden xs:inline sm:inline">README</span>
            </button>

            <a
              href="https://github.com/Seavik2142"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 font-medium text-xs transition-colors"
            >
              <Github className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </div>
        </div>

        {/* Mobile Quick-Navigation Strip */}
        <nav className="md:hidden border-t border-zinc-800/60 px-4 py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs font-medium text-zinc-400">
          <a href="#overview" className="px-3 py-1.5 rounded-lg bg-zinc-900/70 border border-zinc-800/80 text-zinc-200 shrink-0">
            Overview
          </a>
          <a href="#projects" className="px-3 py-1.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:text-zinc-100 shrink-0">
            Projects
          </a>
          <a href="#ai-models" className="px-3 py-1.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:text-zinc-100 shrink-0">
            AI Models
          </a>
          <a href="#telemetry" className="px-3 py-1.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:text-zinc-100 shrink-0">
            Activity
          </a>
          <a href="#stack" className="px-3 py-1.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:text-zinc-100 shrink-0">
            Tech Stack
          </a>
          <a href="#repositories" className="px-3 py-1.5 rounded-lg bg-zinc-900/40 border border-zinc-800/60 hover:text-zinc-100 shrink-0">
            Repositories
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">
        {/* SECTION 1: EXECUTIVE HERO */}
        <section id="overview" className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
          {/* Left Identity Card (8 cols) */}
          <div className="lg:col-span-8 surface-card rounded-2xl p-5 sm:p-9 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <img
                  src={activeAvatar}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-zinc-800 shrink-0"
                />

                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium mb-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Available for Machine Learning Engineer & Data Science Roles</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-bold text-zinc-50 tracking-tight">
                    {user.name}
                  </h1>
                  <p className="text-base sm:text-lg text-zinc-300 font-medium mt-1">
                    Machine Learning Engineer & Data Science Developer
                  </p>
                </div>
              </div>

              <p className="mt-6 text-[15px] sm:text-base text-zinc-400 leading-[1.75] max-w-2xl">
                Machine Learning Engineer based in Cambodia specializing in deep learning and open-source LLM
                fine-tuning (PyTorch, TensorFlow, Hugging Face, LangChain, PEFT/LoRA), end-to-end
                data science pipelines (NumPy, Pandas, Scikit-learn), and production ML services
                built with Python, FastAPI, and Streamlit.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-y-2 gap-x-5 text-sm text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-zinc-500" />
                  <span>{user.location || 'Phnom Penh, Cambodia'}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-zinc-500" />
                  <span>Norton University · Computer Studies</span>
                </span>
              </div>

              {/* Clean Links Row */}
              <div className="mt-7 flex flex-wrap items-center gap-2.5">
                <a
                  href="https://github.com/Seavik2142"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-medium transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub Profile</span>
                </a>

                <a
                  href="https://huggingface.co/Maoseavik"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-sm font-medium transition-colors"
                >
                  <span>Hugging Face</span>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400" />
                </a>

                <a
                  href="https://www.linkedin.com/in/mao-seavik-003a0a372"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-sm font-medium transition-colors"
                >
                  <Linkedin className="w-4 h-4 text-zinc-400" />
                  <span>LinkedIn</span>
                </a>

                <a
                  href="https://seavik-gamma.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-sm font-medium transition-colors"
                >
                  <Globe className="w-4 h-4 text-zinc-400" />
                  <span>Portfolio</span>
                </a>

                <button
                  onClick={handleQuickCopyReadme}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/80 text-sm font-medium transition-colors"
                >
                  {copiedQuickReadme ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-300">Copied README</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-zinc-400" />
                      <span>Copy README.md</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Key Metrics Strip */}
            <div className="mt-8 pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-zinc-400">Public Repositories</p>
                <p className="text-2xl font-semibold text-zinc-50 mt-1">{user.public_repos}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Published AI Models</p>
                <p className="text-2xl font-semibold text-zinc-50 mt-1">
                  {HUGGING_FACE_MODELS.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Repository Stars</p>
                <p className="text-2xl font-semibold text-zinc-50 mt-1">{totalStars}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-400">Awards & Credentials</p>
                <p className="text-2xl font-semibold text-zinc-50 mt-1">{CREDENTIALS.length}</p>
              </div>
            </div>
          </div>

          {/* Right Engineering Summary Card (4 cols) */}
          <div className="lg:col-span-4 surface-card rounded-2xl p-7 flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <h2 className="text-base font-semibold text-zinc-100">
                  Engineering Focus
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Core areas of research and production work
                </p>

                <ul className="mt-4 space-y-3 text-sm text-zinc-300">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0" />
                    <span>
                      <strong className="text-zinc-100 font-medium">Deep Learning & LLMs:</strong> Model training, PEFT/LoRA fine-tuning, and RAG workflows with PyTorch, TensorFlow, Hugging Face, and LangChain.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0" />
                    <span>
                      <strong className="text-zinc-100 font-medium">Data Science & ML:</strong> Feature engineering, classical ML, and scientific analytics using NumPy, Pandas, Scikit-learn, Matplotlib, and Jupyter.
                    </span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-400 mt-2 shrink-0" />
                    <span>
                      <strong className="text-zinc-100 font-medium">AI Services & Deployment:</strong> High-performance inference APIs and interactive ML web apps in Python, FastAPI, Streamlit, and Docker.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="pt-5 border-t border-zinc-800/80">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-2.5">
                  <span className="font-medium text-zinc-300">Primary Languages</span>
                  <span>Across {user.public_repos || repos.length} repositories</span>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden flex gap-0.5">
                  <div style={{ width: '36%', backgroundColor: '#3572A5' }} className="h-full" title="Python 36%" />
                  <div style={{ width: '28%', backgroundColor: '#3178C6' }} className="h-full" title="TypeScript 28%" />
                  <div style={{ width: '20%', backgroundColor: '#F7DF1E' }} className="h-full" title="JavaScript 20%" />
                  <div style={{ width: '9%', backgroundColor: '#00B4AB' }} className="h-full" title="Dart 9%" />
                  <div style={{ width: '7%', backgroundColor: '#4F5D95' }} className="h-full" title="PHP 7%" />
                </div>

                <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-3.5 text-xs text-zinc-400">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-zinc-300">
                      <span className="w-2 h-2 rounded-full bg-[#3572A5]" />
                      Python
                    </span>
                    <span>36%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-zinc-300">
                      <span className="w-2 h-2 rounded-full bg-[#3178C6]" />
                      TypeScript
                    </span>
                    <span>28%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-zinc-300">
                      <span className="w-2 h-2 rounded-full bg-[#F7DF1E]" />
                      JavaScript
                    </span>
                    <span>20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-zinc-300">
                      <span className="w-2 h-2 rounded-full bg-[#00B4AB]" />
                      Dart & PHP
                    </span>
                    <span>16%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs">
              <span className="text-zinc-400">GitHub Profile README</span>
              <button
                onClick={() => setIsReadmeModalOpen(true)}
                className="text-zinc-200 hover:text-white font-medium inline-flex items-center gap-1"
              >
                <span>Preview & Copy</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 2: SELECTED ENGINEERING PROJECTS */}
        <section id="projects" className="surface-card rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-zinc-50 tracking-tight">
                Selected Engineering Projects
              </h2>
              <p className="text-sm text-zinc-400 mt-1">
                Production applications, fine-tuned expert systems, and full-stack software platforms.
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {['All', 'AI & LLM Systems', 'Conversational AI', 'Full-Stack Platform', 'Mobile App'].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setProjectCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      projectCategory === cat
                        ? 'bg-zinc-100 text-zinc-950'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFeaturedProjects.map((project) => (
              <div
                key={project.id}
                className="surface-subcard rounded-xl p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-medium text-zinc-400">
                      {project.category}
                    </span>
                    {project.award && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        <Award className="w-3 h-3" />
                        <span>{project.award}</span>
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-semibold text-zinc-100 tracking-tight">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {project.subtitle}
                  </p>

                  <p className="text-sm text-zinc-300 mt-3.5 leading-relaxed">
                    {project.description}
                  </p>

                  <ul className="mt-4 space-y-2 border-t border-zinc-800/70 pt-4">
                    {project.highlights.map((item, idx) => (
                      <li key={idx} className="text-xs text-zinc-400 flex items-start gap-2 leading-relaxed">
                        <span className="w-1 h-1 rounded-full bg-zinc-500 mt-2 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 pt-4 border-t border-zinc-800/70 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-xs px-2.5 py-0.5 rounded-md bg-zinc-900 text-zinc-300 border border-zinc-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs font-medium">
                    <a
                      href={project.repoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-zinc-200 hover:text-white transition-colors"
                    >
                      <span>View repository</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                    </a>

                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-emerald-300 hover:text-emerald-200 transition-colors"
                      >
                        <span>Live deployment</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 3: HUGGING FACE MODELS */}
        <section id="ai-models">
          <HuggingFaceModelsSection liveDownloads={hfDownloads} />
        </section>

        {/* SECTION 4: CONTRIBUTION ACTIVITY & SNAKE */}
        <section id="telemetry">
          <InteractiveSnakeCard repos={repos} user={user} refreshTrigger={refreshTrigger} />
        </section>

        {/* SECTION 5: TECHNICAL STACK & CREDENTIALS */}
        <section id="stack" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Technical Stack (7 cols) */}
          <div className="lg:col-span-7 surface-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-zinc-800/80">
                <div>
                  <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">
                    Technical Stack
                  </h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    Languages, frameworks, and ML tooling used in production.
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {['All', 'AI & LLMs', 'Backend & APIs', 'Frontend & Mobile', 'Data & DevOps'].map(
                    (cat) => (
                      <button
                        key={cat}
                        onClick={() => setStackCategory(cat)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          stackCategory === cat
                            ? 'bg-zinc-100 text-zinc-950'
                            : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                        }`}
                      >
                        {cat}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredTechStack.map((skill) => (
                  <div
                    key={skill.name}
                    className="surface-subcard rounded-xl p-3.5 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {skill.iconUrl || skill.iconSlug ? (
                        <div className="w-9 h-9 rounded-lg bg-zinc-900/90 border border-zinc-800/90 p-1.5 flex items-center justify-center shrink-0">
                          <img
                            src={
                              skill.iconUrl ||
                              `https://skillicons.dev/icons?i=${skill.iconSlug}&theme=dark`
                            }
                            alt={skill.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 font-semibold text-xs shrink-0">
                          AI
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-sm font-medium text-zinc-100 truncate">
                          {skill.name}
                        </h3>
                        <p className="text-xs text-zinc-400 truncate">{skill.role}</p>
                      </div>
                    </div>

                    <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800 shrink-0">
                      {skill.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Experience & Education (5 cols) */}
          <div className="lg:col-span-5 surface-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="pb-6 border-b border-zinc-800/80">
                <h2 className="text-xl font-semibold text-zinc-50 tracking-tight">
                  Experience & Education
                </h2>
                <p className="text-sm text-zinc-400 mt-1">
                  Academic background, leadership, and industry training.
                </p>
              </div>

              <div className="mt-6 space-y-4">
                {CREDENTIALS.map((cred) => (
                  <div key={cred.id} className="surface-subcard rounded-xl p-5 space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-medium px-2.5 py-0.5 rounded-md bg-zinc-800 text-zinc-300">
                        {cred.badge}
                      </span>
                      <span className="text-zinc-400">{cred.period}</span>
                    </div>
                    <h3 className="text-[15px] font-semibold text-zinc-100 pt-1">
                      {cred.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-medium">
                      {cred.role} · {cred.organization}
                    </p>
                    <p className="text-sm text-zinc-400 leading-relaxed pt-1">
                      {cred.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 6: PUBLIC REPOSITORY INDEX */}
        <section id="repositories" className="surface-card rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-zinc-800/80">
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-semibold text-zinc-50 tracking-tight">
                  Public Repositories
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{repos.length} Live Repositories</span>
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1">
                Sorted by latest GitHub push activity from github.com/Seavik2142.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={repoSearch}
                  onChange={(e) => setRepoSearch(e.target.value)}
                  placeholder="Filter repositories..."
                  className="pl-9 pr-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 focus:border-zinc-600 focus:outline-none text-sm text-zinc-200 placeholder:text-zinc-500 w-full sm:w-56"
                />
              </div>

              <div className="flex flex-wrap gap-1">
                {availableRepoLanguages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setRepoLang(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      repoLang === lang
                        ? 'bg-zinc-100 text-zinc-950'
                        : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRepos.map((repo) => {
              const langColor =
                (repo.language && LANGUAGE_COLORS[repo.language]) || '#A1A1AA';
              return (
                <a
                  key={repo.id}
                  href={repo.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="surface-subcard rounded-xl p-5 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <FolderGit2 className="w-4 h-4 text-zinc-400 shrink-0" />
                        <h3 className="text-[15px] font-semibold text-zinc-100 group-hover:text-white truncate">
                          {repo.name}
                        </h3>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-zinc-500 group-hover:text-zinc-200 shrink-0 transition-colors" />
                    </div>

                    <p className="text-sm text-zinc-400 mt-2.5 line-clamp-2 leading-relaxed">
                      {repo.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-zinc-800/70 flex items-center justify-between text-xs text-zinc-400">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-zinc-300">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: langColor }}
                        />
                        {repo.language || 'Code'}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-zinc-500" />
                        {repo.stargazers_count || 1}
                      </span>

                      {repo.forks_count > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <GitFork className="w-3.5 h-3.5 text-zinc-500" />
                          {repo.forks_count}
                        </span>
                      )}
                    </div>

                    <span>
                      {repo.pushed_at ? repo.pushed_at.slice(0, 10) : '2026'}
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-zinc-800/80 py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-zinc-400">
          <div>
            <span className="font-medium text-zinc-200">Mao Seavik</span> · Machine Learning Engineer & Software Developer
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs">
            <button
              onClick={() => setIsReadmeModalOpen(true)}
              className="hover:text-zinc-100 transition-colors"
            >
              README.md
            </button>
            <a
              href="https://github.com/Seavik2142"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-100 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://huggingface.co/Maoseavik"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-100 transition-colors"
            >
              Hugging Face
            </a>
            <a
              href="https://www.linkedin.com/in/mao-seavik-003a0a372"
              target="_blank"
              rel="noreferrer"
              className="hover:text-zinc-100 transition-colors"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </footer>

      <ReadmeStudioModal
        isOpen={isReadmeModalOpen}
        onClose={() => setIsReadmeModalOpen(false)}
      />

      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="surface-card rounded-2xl max-w-lg w-full p-6 space-y-5 border border-zinc-800">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-zinc-50">
                  GitHub API Token Configuration
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Connect a GitHub Personal Access Token (<code>ghp_...</code> or <code>github_pat_...</code>) to enable real-time GraphQL contribution calendar sync and 5,000 requests/hr rate limits.
                </p>
              </div>
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-medium text-zinc-300">
                GitHub Personal Access Token (stored locally in your browser or <code>.env.local</code>)
              </label>
              <input
                type="password"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 focus:border-sky-500 focus:outline-none text-sm font-mono text-zinc-100 placeholder:text-zinc-600"
              />
              <div className="rounded-xl bg-zinc-900/80 border border-zinc-800/80 p-3.5 text-xs text-zinc-400 space-y-1.5">
                <p className="font-medium text-zinc-200">3 Ways to Configure Automatic Real-Time Sync:</p>
                <p>1. <strong>Browser Instant Sync:</strong> Paste your token above and click <strong>Save &amp; Sync Now</strong>.</p>
                <p>2. <strong>Local Project (<code>.env.local</code>):</strong> Set <code>VITE_GITHUB_TOKEN=your_token</code> in <code>.env.local</code>.</p>
                <p>3. <strong>Vercel Production:</strong> Add <code>GITHUB_TOKEN=your_token</code> in Vercel Project Settings → Environment Variables (powers <code>/api/github</code> securely on the server).</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              {tokenInput && (
                <button
                  onClick={() => {
                    setTokenInput('');
                    setConfiguredGitHubToken('');
                    setIsApiKeyModalOpen(false);
                    syncLiveProfile();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 text-xs font-medium border border-zinc-800"
                >
                  Clear Token
                </button>
              )}
              <button
                onClick={() => {
                  setConfiguredGitHubToken(tokenInput);
                  setIsApiKeyModalOpen(false);
                  syncLiveProfile();
                }}
                className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors"
              >
                Save &amp; Sync Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
