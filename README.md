<div align="center">
  <h1>🚀 RepoReady</h1>
  <p><strong>Evaluate & Create Contributor-Ready GitHub Repositories</strong></p>
  
  <a href="https://www.npmjs.com/package/repoready">
    <img src="https://img.shields.io/npm/v/repoready?color=blue" alt="npm version">
  </a>
  <a href="https://github.com/OpenSource-Communities/RepoReady/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
  </a>
  <a href="https://github.com/OpenSource-Communities/RepoReady/issues">
    <img src="https://img.shields.io/github/issues/OpenSource-Communities/RepoReady" alt="Issues">
  </a>
</div>

<br>

A command-line tool that helps maintainers evaluate GitHub repositories for contributor readiness and create new contributor-friendly projects.

## Features

- **Evaluate existing repositories**: Analyze any GitHub repository to see how ready it is for new contributors
- **Create new repositories**: Set up new GitHub repositories optimized for community contributions  
- **Detailed scoring**: Get a comprehensive score and rating based on best practices for open source projects
- **Actionable recommendations**: Receive specific suggestions to improve your repository's contributor readiness

## Installation & Setup

### Option 1: Install from npm (when published)

```bash
npm install -g repoready
```

Or run directly with npx:

```bash
npx repoready [command]
```

### Option 2: Run locally with Node.js

1. **Clone the repository**:
```bash
git clone https://github.com/OpenSource-Communities/RepoReady.git
cd RepoReady
```

2. **Install dependencies**:
```bash
npm install
```

3. **Build the project**:
```bash
npm run build
```

4. **Run the CLI**:
```bash
# Using the built JavaScript
# node dist/index.js evaluate OpenSource-Communities/RepoReady
node dist/index.js [command]

# Or run directly with TypeScript (development)
npm run dev [command]
```

## Usage

### Evaluate an Existing Repository

**Using npm/npx:**
```bash
rr evaluate owner/repository-name
```

**Using Node.js locally:**
```bash
node dist/index.js evaluate owner/repository-name
# Or in development:
npm run dev evaluate owner/repository-name
```

Example:
```bash
# npm/npx
rr evaluate facebook/react

# Local Node.js
node dist/index.js evaluate facebook/react
```

With GitHub token for higher rate limits:
```bash
# npm/npx
rr evaluate facebook/react --token your_github_token

# Local Node.js
node dist/index.js evaluate facebook/react --token your_github_token
```

### Create a New Repository

**Using npm/npx:**
```bash
rr create --token your_github_token
```

**Using Node.js locally:**
```bash
node dist/index.js create --token your_github_token
```

You can also provide repository details directly:
```bash
# npm/npx
rr create --token your_github_token --name my-awesome-project --description "A tool that does amazing things"

# Local Node.js
node dist/index.js create --token your_github_token --name my-awesome-project --description "A tool that does amazing things"
```

## What Gets Evaluated

The CLI evaluates repositories based on these criteria:

### Essential Elements (High Weight)
- **README File** (20 points): Comprehensive documentation
- **Contributing Guidelines** (15 points): Clear contribution instructions
- **Open Source License** (15 points): Valid open source license

### Community Building (Medium Weight)  
- **Code of Conduct** (12 points): Welcoming environment guidelines
- **Description** (10 points): Clear project description
- **Good First Issues** (10 points): Issues labeled for beginners

### Discoverability & Organization (Lower Weight)
- **Topics/Tags** (8 points): Relevant repository topics
- **Issue Templates** (8 points): Standardized issue reporting
- **Help Wanted Issues** (8 points): Issues seeking community help
- **Pull Request Template** (7 points): PR submission guidelines
- **Repository Name** (5 points): Descriptive and relevant name
- **Active Repository** (5 points): Not archived

## Scoring & Ratings

- **Excellent** (90-100%): Ready for contributors with outstanding setup
- **Good** (75-89%): Well-prepared with minor improvements needed
- **Fair** (60-74%): Has potential but needs important improvements
- **Needs Work** (40-59%): Significant improvements required
- **Not Ready** (<40%): Major work needed before accepting contributions

## GitHub Token

While not required for evaluation, using a GitHub personal access token is recommended to:
- Avoid rate limiting
- Access private repositories (if you have permissions)
- Create new repositories

Create a token at: https://github.com/settings/tokens

You can provide the token via:
- `--token` flag
- `GITHUB_TOKEN` environment variable

## Examples

### Evaluate a popular open source project
```bash
# Using npm/npx
rr evaluate microsoft/vscode

# Using Node.js locally
node dist/index.js evaluate microsoft/vscode
```

### Create a new project interactively
```bash
# Using npm/npx
rr create --token ghp_your_token_here

# Using Node.js locally
node dist/index.js create --token ghp_your_token_here
```

### Evaluate with token for higher rate limits
```bash
# Using npm/npx
export GITHUB_TOKEN=ghp_your_token_here
rr evaluate your-org/your-repo

# Using Node.js locally
export GITHUB_TOKEN=ghp_your_token_here
node dist/index.js evaluate your-org/your-repo
```

## Requirements

- Node.js 20 or higher
- npm (comes with Node.js)
- Git (for repository operations and local development)
- GitHub account (for creating repositories)

### For Local Development
- TypeScript knowledge (helpful for contributing)
- All dependencies will be installed via `npm install`

## Contributing

This project follows the same best practices it evaluates! We welcome contributions and maintain:

- Comprehensive documentation
- Contributing guidelines  
- Code of conduct
- Issue templates
- Good first issues

## License

MIT License - see [LICENSE](LICENSE) file for details.