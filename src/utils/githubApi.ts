import { GitHubRepo, GitHubUser } from '../data/profileData';

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

export interface LiveGitHubPayload {
  authenticated: boolean;
  source: 'graphql' | 'serverless' | 'rest';
  user?: Partial<GitHubUser>;
  repos?: GitHubRepo[];
  contributions?: {
    total: number;
    days: ContributionDay[];
  };
  events?: any[];
}

const GRAPHQL_QUERY = `
query GetSeavikProfile($login: String!) {
  user(login: $login) {
    login
    name
    bio
    location
    websiteUrl
    createdAt
    updatedAt
    followers {
      totalCount
    }
    following {
      totalCount
    }
    repositories(first: 100, privacy: PUBLIC, orderBy: { field: PUSHED_AT, direction: DESC }) {
      totalCount
      nodes {
        databaseId
        name
        nameWithOwner
        url
        description
        isFork
        stargazerCount
        forkCount
        pushedAt
        homepageUrl
        primaryLanguage {
          name
        }
      }
    }
    contributionsCollection {
      totalCommitContributions
      restrictedContributionsCount
      contributionCalendar {
        totalContributions
        weeks {
          contributionDays {
            date
            contributionCount
            contributionLevel
          }
        }
      }
    }
  }
}
`;

const LEVEL_MAP: Record<string, number> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export function getConfiguredGitHubToken(): string {
  const envToken =
    (import.meta as any).env?.VITE_GITHUB_TOKEN ||
    (import.meta as any).env?.VITE_GH_TOKEN ||
    '';
  if (envToken && typeof envToken === 'string' && envToken.trim().length > 0) {
    return envToken.trim();
  }
  try {
    return localStorage.getItem('seavik_github_token')?.trim() || '';
  } catch {
    return '';
  }
}

export function setConfiguredGitHubToken(token: string): void {
  try {
    if (token.trim()) {
      localStorage.setItem('seavik_github_token', token.trim());
    } else {
      localStorage.removeItem('seavik_github_token');
    }
  } catch {
    // ignore storage errors
  }
}

export async function fetchGitHubWithGraphQL(
  token: string,
  login = 'Seavik2142'
): Promise<LiveGitHubPayload | null> {
  try {
    const [gqlRes, eventsRes] = await Promise.all([
      fetch('https://api.github.com/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: GRAPHQL_QUERY,
          variables: { login },
        }),
        cache: 'no-store',
      }),
      fetch(`https://api.github.com/users/${login}/events/public?per_page=30`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
      }),
    ]);

    if (!gqlRes.ok) return null;
    const gqlJson = await gqlRes.json();
    const u = gqlJson?.data?.user;
    if (!u) return null;

    const eventsJson = eventsRes.ok ? await eventsRes.json() : [];
    const calendar = u.contributionsCollection?.contributionCalendar;
    const days: ContributionDay[] = [];
    for (const week of calendar?.weeks || []) {
      for (const d of week.contributionDays || []) {
        days.push({
          date: d.date,
          count: d.contributionCount,
          level: LEVEL_MAP[d.contributionLevel] ?? 0,
        });
      }
    }

    const repos: GitHubRepo[] = (u.repositories?.nodes || []).map((r: any, idx: number) => ({
      id: r.databaseId || idx + 1,
      name: r.name,
      full_name: r.nameWithOwner,
      html_url: r.url,
      description: r.description,
      fork: Boolean(r.isFork),
      language: r.primaryLanguage?.name || null,
      stargazers_count: r.stargazerCount || 0,
      forks_count: r.forkCount || 0,
      pushed_at: r.pushedAt,
      homepage: r.homepageUrl,
    }));

    return {
      authenticated: true,
      source: 'graphql',
      user: {
        login: u.login,
        name: u.name || 'Mao Seavik',
        bio: u.bio,
        location: u.location || 'Phnom Penh, Cambodia',
        blog: u.websiteUrl || 'https://seavik-gamma.vercel.app/',
        public_repos: u.repositories?.totalCount || repos.length,
        followers: u.followers?.totalCount || 0,
        following: u.following?.totalCount || 0,
        created_at: u.createdAt,
        updated_at: u.updatedAt,
      },
      repos,
      contributions: {
        total: calendar?.totalContributions || 0,
        days,
      },
      events: Array.isArray(eventsJson) ? eventsJson : [],
    };
  } catch {
    return null;
  }
}

export async function fetchServerlessGitHub(): Promise<LiveGitHubPayload | null> {
  try {
    const res = await fetch('/api/github', { cache: 'no-store' });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.authenticated && data?.user) {
      return {
        authenticated: true,
        source: 'serverless',
        user: data.user,
        repos: data.repos,
        contributions: data.contributions,
        events: data.events,
      };
    }
    return null;
  } catch {
    return null;
  }
}
