// Vercel Serverless Function: /api/github
// Queries GitHub's official GraphQL & REST APIs using GITHUB_TOKEN or VITE_GITHUB_TOKEN
// so your token stays secure on the server and never gets revoked by GitHub secret scanning.

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

const LEVEL_MAP = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const token = process.env.GITHUB_TOKEN || process.env.VITE_GITHUB_TOKEN;
  const login = 'Seavik2142';

  if (token) {
    try {
      const [gqlRes, eventsRes] = await Promise.all([
        fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Seavik-Portfolio-Serverless',
          },
          body: JSON.stringify({
            query: GRAPHQL_QUERY,
            variables: { login },
          }),
        }),
        fetch(`https://api.github.com/users/${login}/events/public?per_page=30`, {
          headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'Seavik-Portfolio-Serverless',
          },
        }),
      ]);

      const gqlJson = await gqlRes.json();
      const eventsJson = eventsRes.ok ? await eventsRes.json() : [];

      if (gqlJson?.data?.user) {
        const u = gqlJson.data.user;
        const calendar = u.contributionsCollection?.contributionCalendar;
        const days = [];
        for (const week of calendar?.weeks || []) {
          for (const d of week.contributionDays || []) {
            days.push({
              date: d.date,
              count: d.contributionCount,
              level: LEVEL_MAP[d.contributionLevel] ?? 0,
            });
          }
        }

        const repos = (u.repositories?.nodes || []).map((r) => ({
          id: r.databaseId || r.name,
          name: r.name,
          full_name: r.nameWithOwner,
          html_url: r.url,
          description: r.description,
          fork: r.isFork,
          language: r.primaryLanguage?.name || null,
          stargazers_count: r.stargazerCount || 0,
          forks_count: r.forkCount || 0,
          pushed_at: r.pushedAt,
          homepage: r.homepageUrl,
        }));

        return res.status(200).json({
          authenticated: true,
          source: 'github-graphql',
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
        });
      }
    } catch (err) {
      // Fall through to unauthenticated REST fallback if GraphQL fails
    }
  }

  return res.status(200).json({
    authenticated: false,
    source: 'client-fallback',
  });
}
