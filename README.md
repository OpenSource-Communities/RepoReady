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
- **Create new repositories**: Set up new GitHub repositories optimized for community contributions with automatic post-creation evaluation
- **Interactive CLI**: Built-in `intro` and `examples` commands for new users, with guided prompts for repository creation
- **Comprehensive scoring system**: 12-criteria evaluation with weighted scoring (100-point scale)
- **5-tier rating system**: Excellent, Good, Fair, Needs Work, and Not Ready classifications
- **Actionable recommendations**: Receive specific suggestions to improve your repository's contributor readiness (top 5 prioritized by importance)
- **Organization-level file detection**: Automatically checks organization's `.github` repository for default community health files (follows GitHub's community health file standards)
- **Smart validation**: Input validation for repository creation (name format, description length)
- **Private repository support**: Option to create private repositories with `--private` flag
- **Auto-initialization**: New repositories are created with Node.js `.gitignore` template

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

**Interactive mode (recommended):**
```bash
# npm/npx
rr create --token your_github_token

# Local Node.js
node dist/index.js create --token your_github_token
```
The CLI will guide you through the process with prompts for:
- Repository name (validates format: letters, numbers, dots, hyphens, underscores)
- Description (minimum 10 characters)
- Post-creation evaluation option

**Non-interactive mode with flags:**
```bash
# npm/npx
rr create --token your_github_token --name my-awesome-project --description "A tool that does amazing things"

# Local Node.js
node dist/index.js create --token your_github_token --name my-awesome-project --description "A tool that does amazing things"
```

**Create a private repository:**
```bash
rr create --token your_github_token --private
```

**Post-creation evaluation:**
After creating a repository, you'll be prompted to evaluate it immediately to see your starting contributor-readiness score. This helps you understand what additional steps are needed to make your repository contributor-ready.

## What Gets Evaluated

The CLI evaluates repositories based on these criteria. When community health files are missing from a repository, the tool automatically checks the organization's `.github` repository for default community health files:

### Essential Elements (High Weight)
- **README File** (20 points): Comprehensive documentation with project information
- **Contributing Guidelines** (15 points): Clear contribution instructions
- **Open Source License** (15 points): Valid open source license

### Community Building (Medium Weight)  
- **Code of Conduct** (12 points): Welcoming environment guidelines
- **Description** (10 points): Clear project description (minimum 10 characters)
- **Good First Issues** (10 points): Issues labeled for beginners

### Discoverability & Organization (Lower Weight)
- **Topics/Tags** (8 points): At least 2 relevant repository topics
- **Issue Templates** (8 points): Standardized issue reporting
- **Help Wanted Issues** (8 points): Issues seeking community help
- **Pull Request Template** (7 points): PR submission guidelines
- **Repository Name** (5 points): Descriptive and relevant name (not generic)
- **Active Repository** (5 points): Not archived

**Total Maximum Score**: 103 points

### Organization-Level Community Health Files

RepoReady automatically checks for community health files in the organization's `.github` repository when they're missing from the individual repository. This follows [GitHub's community health file standards](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/creating-a-default-community-health-file) where organizations can provide default files for all their repositories.

**Files checked at the organization level:**
- `CODE_OF_CONDUCT.md` - Checked in `.github/profile/`, root, and `.github/` directories
- `CONTRIBUTING.md` - Multiple variants and locations supported
- `LICENSE` (and variants: `.md`, `.txt`, `.rst`, `COPYING`) - Multiple formats recognized
- Issue templates in `.github/ISSUE_TEMPLATE/` - Directory or single file
- `PULL_REQUEST_TEMPLATE.md` - Various naming conventions supported

**How it works:**
1. RepoReady first checks the repository itself for community health files
2. If not found, it automatically checks the organization's `.github` repository
3. Files in either location count toward the evaluation score
4. This reduces duplication for organizations with multiple repositories

## Scoring & Ratings

- **Excellent** (90-100%): Ready for contributors with outstanding setup
- **Good** (75-89%): Well-prepared with minor improvements needed
- **Fair** (60-74%): Has potential but needs important improvements
- **Needs Work** (40-59%): Significant improvements required
- **Not Ready** (<40%): Major work needed before accepting contributions

## GitHub Token

While not required for evaluation, using a GitHub personal access token is recommended to:
- **Avoid rate limiting**: Unauthenticated requests are limited to 60/hour; authenticated requests get 5,000/hour
- **Access private repositories**: If you have permissions
- **Create new repositories**: Required for the `create` command

**Create a token:**
1. Visit: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (for full repository access) or `public_repo` (for public repositories only)
4. Generate and copy your token

**Provide the token via:**
- `--token` or `-t` flag: `rr evaluate owner/repo --token ghp_xxxxx`
- `GITHUB_TOKEN` environment variable: `export GITHUB_TOKEN=ghp_xxxxx`

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

## Additional Commands

### Show Introduction
```bash
rr intro
```
Displays a welcome message and getting started guide.

### Show Examples
```bash
rr examples
```
Displays example commands and usage patterns.

### Show Version
```bash
rr --version
```

### Show Help
```bash
rr --help
rr evaluate --help
rr create --help
```

## Requirements

### Runtime Requirements
- **Node.js**: Version 16 or higher (20+ recommended for best performance)
- **npm**: Comes bundled with Node.js
- **Git**: For repository operations and local development
- **GitHub account**: Required for creating repositories

### For Local Development
- **TypeScript**: Knowledge helpful for contributing
- **Dependencies**: All automatically installed via `npm install`
- **Build tools**: TypeScript compiler, ts-node included in devDependencies

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for a detailed history of changes.

## Contributing

This project follows the same best practices it evaluates! We welcome contributions and maintain:

- Comprehensive documentation
- Contributing guidelines  
- Code of conduct
- Issue templates
- Good first issues

## License

MIT License - see [LICENSE](LICENSE) file for details.