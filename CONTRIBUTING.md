# Contributing

## Setup

Use Node.js 22, the version [CI](.github/workflows/ci.yml) installs. Node.js 18 or later also runs the app locally.

```bash
git clone https://github.com/ninza-innovates/Ajeris-portal.git
cd Ajeris-portal
npm ci
cp .env.local.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

`npm ci` matches CI and uses `package-lock.json`. These are the scripts in `package.json`:

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run lint` | Run ESLint (`next lint`) |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |

There is no test script. Lint is the check CI runs on every push and pull request.

## Branches and pull requests

Branch from `main` with a short name that says what the change does, such as `fix/login-redirect` or `feature/study-filters`.

Before you open a pull request:

1. Run `npm run lint` and fix what it reports.
2. Push the branch and open the pull request against `main`.
3. Fill in the pull request template: what changed, why, and how you checked it.

Keep each pull request to one change. Write commit messages in the imperative mood, for example `Add a study status filter`.
