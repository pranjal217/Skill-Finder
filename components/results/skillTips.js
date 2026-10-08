// skillTips.js
// Skill-specific "how to achieve it" advice. Used when the API doesn't send its own
// suggestion for a missing skill. Each entry: which names it matches, the action type,
// and one concrete thing the user can do.

const TIPS = [
  // ---------- Web / frontend ----------
  {
    match: ['graphql', 'apollo'],
    type: 'project',
    tip: 'Build a small app that queries a public GraphQL API (a countries or Rick and Morty API works well) using Apollo Client or plain fetch, and put it on GitHub.',
  },
  {
    match: ['react', 'reactjs'],
    type: 'project',
    tip: 'Build and deploy a small app that uses hooks, routing and a real API call, and link the live demo on your resume.',
  },
  {
    match: ['nextjs', 'next'],
    type: 'project',
    tip: 'Build a small full-stack app with the App Router and a route handler that calls an API, then deploy it on Vercel or Netlify.',
  },
  {
    match: ['typescript', 'ts'],
    type: 'practice',
    tip: 'Convert one of your existing JavaScript projects to TypeScript step by step, typing props and API responses, and mention the migration in a resume bullet.',
  },
  {
    match: ['javascript', 'js', 'es6'],
    type: 'practice',
    tip: 'Build small vanilla JS projects (a to-do app, a weather widget) with async/await and DOM handling, without a framework.',
  },
  {
    match: ['html', 'css', 'html css', 'html5', 'css3'],
    type: 'project',
    tip: 'Recreate a real landing page from scratch with semantic HTML and responsive CSS (flexbox and grid), then host it for free.',
  },
  {
    match: ['tailwind', 'tailwindcss', 'tailwind css'],
    type: 'project',
    tip: 'Rebuild one of your existing pages with Tailwind utility classes and add a responsive layout and dark mode.',
  },
  {
    match: ['redux', 'state management', 'zustand'],
    type: 'practice',
    tip: 'Add global state to one of your React apps (cart, auth or filters) with Redux Toolkit or Zustand, and explain why in your README.',
  },
  {
    match: ['accessibility', 'accessibility auditing', 'a11y', 'wcag'],
    type: 'practice',
    tip: 'Run a Lighthouse or axe audit on one of your existing projects, fix the issues it finds, and note the fixes in your resume bullet.',
  },
  {
    match: ['figma', 'ui ux', 'uiux', 'ux design', 'ui design', 'ux', 'wireframing', 'prototyping'],
    type: 'contribute',
    tip: 'Comment on a design file or annotate a handoff to show familiarity, and redesign one screen of an app you use in Figma.',
  },

  // ---------- Backend / APIs ----------
  {
    match: ['nodejs', 'node', 'express', 'expressjs'],
    type: 'project',
    tip: 'Build a REST API with Express that has validation, error handling and a database, and test the endpoints with Postman.',
  },
  {
    match: ['rest', 'rest api', 'rest apis', 'restful', 'restful api', 'api design', 'api development', 'openapi', 'swagger'],
    type: 'project',
    tip: 'Design a small REST API with clear resources and status codes, and document it with an OpenAPI or Swagger spec.',
  },
  {
    match: ['fastapi', 'flask', 'django'],
    type: 'project',
    tip: 'Build a small backend with auth and CRUD endpoints, and deploy it on a free tier so the link works on your resume.',
  },
  {
    match: ['java', 'spring', 'spring boot'],
    type: 'project',
    tip: 'Build a Spring Boot CRUD service with a database and unit tests, and push it to GitHub with a clear README.',
  },
  {
    match: ['csharp', 'c#', 'dotnet', 'net', 'aspnet', 'asp net', 'net core'],
    type: 'project',
    tip: 'Build an ASP.NET Core web app with models, controllers and a database, and add it to your portfolio.',
  },
  {
    match: ['c++', 'cpp'],
    type: 'practice',
    tip: 'Solve data-structure problems in C++ and build a small command-line project that uses the STL and classes.',
  },
  {
    match: ['python'],
    type: 'practice',
    tip: 'Automate something real with Python (a scraper, a file organiser or a data report) and publish it with a README.',
  },
  {
    match: ['microservices', 'microservice'],
    type: 'project',
    tip: 'Split a small app into two services that talk over HTTP, run them together with Docker Compose, and draw the architecture in your README.',
  },
  {
    match: ['security', 'owasp', 'authentication', 'oauth', 'jwt'],
    type: 'practice',
    tip: 'Go through the OWASP Top 10 against one of your projects, fix what you find, and add proper auth (JWT or OAuth) with a short write-up.',
  },

  // ---------- Data / ML ----------
  {
    match: ['sql', 'mysql', 'postgresql', 'postgres', 'database', 'databases', 'rdbms'],
    type: 'practice',
    tip: 'Practise joins, aggregations and window functions on a sample dataset, then add a real database to one of your projects.',
  },
  {
    match: ['mongodb', 'nosql', 'firebase', 'firestore'],
    type: 'project',
    tip: 'Add MongoDB (or Firestore) to a small CRUD app and describe how you modelled the data.',
  },
  {
    match: ['pandas', 'numpy', 'data analysis', 'data analytics', 'data cleaning', 'eda'],
    type: 'practice',
    tip: 'Pick a messy public dataset, clean it and explore it in a notebook, and publish the notebook with your findings.',
  },
  {
    match: ['machine learning', 'ml', 'scikit learn', 'sklearn', 'predictive modeling'],
    type: 'project',
    tip: 'Train and compare a few models on a public dataset, report accuracy and the other metrics in a README, and explain your choices.',
  },
  {
    match: ['deep learning', 'tensorflow', 'pytorch', 'keras', 'neural networks'],
    type: 'project',
    tip: 'Train a small neural network (for example an image classifier) and document the architecture, training curve and results.',
  },
  {
    match: ['nlp', 'natural language processing', 'llm', 'llms', 'generative ai', 'prompt engineering', 'langchain'],
    type: 'project',
    tip: 'Build a small app on top of an LLM API (a resume summariser or a Q&A bot) and write down the prompts and limitations you handled.',
  },
  {
    match: ['data visualization', 'data visualisation', 'tableau', 'power bi', 'powerbi', 'dashboard', 'dashboards'],
    type: 'project',
    tip: 'Build an interactive dashboard from a public dataset and write three insights it shows, then add a screenshot to your portfolio.',
  },
  {
    match: ['excel', 'advanced excel', 'spreadsheets'],
    type: 'practice',
    tip: 'Build a pivot-table and lookup-formula report from a sample dataset and mention the time or effort it saved.',
  },
  {
    match: ['statistics', 'statistical analysis', 'hypothesis testing'],
    type: 'practice',
    tip: 'Run a hypothesis test (t-test or chi-square) on a real dataset and explain the result in plain language in a notebook.',
  },

  // ---------- DevOps / cloud / tooling ----------
  {
    match: ['ci cd', 'cicd', 'ci cd pipelines', 'ci cd pipeline', 'continuous integration', 'continuous delivery', 'continuous deployment', 'github actions', 'jenkins', 'gitlab ci'],
    type: 'practice',
    tip: 'Add a GitHub Actions workflow to one of your repos that runs tests and lint on every push and deploys on merge to main.',
  },
  {
    match: ['docker', 'containers', 'containerization', 'containerisation'],
    type: 'project',
    tip: 'Containerise one of your apps with a Dockerfile and a docker-compose file that also starts its database, and add run instructions to the README.',
  },
  {
    match: ['kubernetes', 'k8s'],
    type: 'practice',
    tip: 'Deploy a containerised app to a local cluster with minikube or kind, writing the Deployment and Service YAML yourself.',
  },
  {
    match: ['aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'cloud', 'cloud computing'],
    type: 'project',
    tip: 'Deploy a small app on a free-tier cloud service (static hosting plus a serverless function is enough) and draw its architecture in your README.',
  },
  {
    match: ['devops'],
    type: 'practice',
    tip: 'Automate build, test and deploy for one project end to end, and describe the pipeline in a resume bullet.',
  },
  {
    match: ['linux', 'unix', 'bash', 'shell scripting', 'shell'],
    type: 'practice',
    tip: 'Set up WSL or a VM, practise everyday shell commands, and write a few scripts that automate chores like backups or log parsing.',
  },
  {
    match: ['git', 'github', 'version control', 'git github'],
    type: 'practice',
    tip: 'Use feature branches and pull requests on your own repos, and resolve a merge conflict so your history shows a real workflow.',
  },
  {
    match: ['testing', 'unit testing', 'jest', 'test automation', 'pytest', 'selenium', 'cypress', 'tdd'],
    type: 'practice',
    tip: 'Add unit tests to one of your existing projects (Jest or pytest), cover the core logic, and note the coverage in your resume bullet.',
  },

  // ---------- CS fundamentals / ways of working ----------
  {
    match: ['data structures', 'algorithms', 'dsa', 'data structures and algorithms', 'problem solving'],
    type: 'practice',
    tip: 'Solve a few problems a week by topic (arrays, trees, graphs) on a coding platform, and keep your solutions in a GitHub repo.',
  },
  {
    match: ['system design', 'software architecture', 'design patterns'],
    type: 'practice',
    tip: 'Sketch designs for common systems (URL shortener, chat app), write down the trade-offs, and apply one pattern in a real project.',
  },
  {
    match: ['agile', 'scrum', 'kanban', 'jira', 'project management'],
    type: 'practice',
    tip: 'Run your next project in one-week sprints on a Trello or Jira board, and mention the workflow and what you delivered in a resume bullet.',
  },
  {
    match: ['communication', 'teamwork', 'collaboration', 'leadership', 'presentation', 'presentation skills', 'public speaking'],
    type: 'practice',
    tip: 'Lead a small team project or give a short talk, then add a bullet with what you led and the outcome.',
  },
];

// "Node.js" -> "nodejs", "CI/CD Pipelines" -> "ci cd pipelines", "C#" -> "c#"
function normalize(str) {
  return String(str || '')
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/[-_/&,()]/g, ' ')
    .replace(/[^a-z0-9+#\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Pre-normalise the match names once
const INDEX = TIPS.map((entry) => ({
  ...entry,
  names: entry.match.map(normalize),
}));

/**
 * Find skill-specific advice for a skill name.
 * Returns { type, tip } or null when the skill isn't in the map.
 */
export function findSkillAdvice(skill) {
  const norm = normalize(skill);
  if (!norm) return null;
  const padded = ` ${norm} `;

  // 1) exact match on the whole skill name
  for (const entry of INDEX) {
    if (entry.names.includes(norm)) return { type: entry.type, tip: entry.tip };
  }

  // 2) a known name appears as whole words inside the skill (longest name wins)
  let best = null;
  let bestLen = 0;
  for (const entry of INDEX) {
    for (const name of entry.names) {
      if (name.length > bestLen && padded.includes(` ${name} `)) {
        best = entry;
        bestLen = name.length;
      }
    }
  }
  return best ? { type: best.type, tip: best.tip } : null;
}