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

## Installation

```bash
npm install -g repoready
```

Or run directly with npx:

```bash
npx repoready [command]
```

## Usage

### Evaluate an Existing Repository

```bash
rr evaluate owner/repository-name
```

Example:
```bash
rr evaluate facebook/react
```

With GitHub token for higher rate limits:
```bash
rr evaluate facebook/react --token your_github_token
```

### Create a New Repository

```bash
rr create --token your_github_token
```

You can also provide repository details directly:
```bash
rr create --token your_github_token --name my-awesome-project --description "A tool that does amazing things"
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
rr evaluate microsoft/vscode
```

### Create a new project interactively
```bash
rr create --token ghp_your_token_here
```

### Evaluate with token for higher rate limits
```bash
export GITHUB_TOKEN=ghp_your_token_here
rr evaluate your-org/your-repo
```

## Requirements

- Node.js 16 or higher
- Git (for repository operations)
- GitHub account (for creating repositories)

## Contributing

This project follows the same best practices it evaluates! We welcome contributions and maintain:

- Comprehensive documentation
- Contributing guidelines  
- Code of conduct
- Issue templates
- Good first issues

## License

MIT License - see [LICENSE](LICENSE) file for details.