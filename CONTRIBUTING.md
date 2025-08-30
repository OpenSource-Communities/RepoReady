# Contributing to RepoReady

Thank you for your interest in contributing to RepoReady! 🎉 

RepoReady is a CLI tool that helps maintainers evaluate and create contributor-ready GitHub repositories. We welcome contributions from developers of all skill levels.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project adheres to a [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## How to Contribute

There are many ways to contribute to RepoReady:

- 🐛 **Report bugs** - [Create an issue](https://github.com/OpenSource-Communities/RepoReady/issues/new) to help us identify problems
- 💡 **Suggest features** - Share ideas for improvements via GitHub issues
- 📝 **Improve documentation** - Help make our docs clearer
- 🔧 **Fix issues** - Submit pull requests for bug fixes
- ✨ **Add features** - Implement new functionality
- 🧪 **Write tests** - Help improve our test coverage

## Development Setup

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- Git

### Getting Started

1. **Fork the repository** on GitHub

2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/RepoReady.git
   cd RepoReady
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Build the project**:
   ```bash
   npm run build
   ```

5. **Test the CLI** locally:
   ```bash
   # Run directly
   node dist/index.js --help
   
   # Or link for system-wide testing
   npm link
   rr --help
   ```

## Making Changes

### Project Structure

```
src/
├── commands/          # CLI command implementations
│   ├── evaluate.ts   # Repository evaluation logic
│   └── create.ts     # Repository creation logic
├── evaluator/        # Evaluation criteria and scoring
│   ├── criteria.ts   # Scoring criteria definitions
│   └── index.ts      # Main evaluator class
├── utils/            # Utility functions
│   ├── github.ts     # GitHub API interactions
│   ├── display.ts    # CLI output formatting
│   ├── ascii.ts      # ASCII art and headers
│   └── intro.ts      # Welcome messages
├── types/            # TypeScript type definitions
└── index.ts          # Main CLI entry point
```

### Coding Standards

- Use TypeScript for all new code
- Follow existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions small and focused

### Adding New Evaluation Criteria

If you want to add a new evaluation criterion:

1. Edit `src/evaluator/criteria.ts`
2. Add your new criterion to the `evaluationCriteria` array
3. Update the recommendation logic in `generateRecommendations`
4. Test with various repositories

Example:
```typescript
{
  name: 'My New Criterion',
  description: 'Checks for something important',
  weight: 10,
  check: (repo: RepositoryInfo) => {
    // Your evaluation logic here
    return someCondition;
  }
}
```

## Testing

### Manual Testing

Test your changes with various repositories:

```bash
# Test with well-maintained repos
rr evaluate facebook/react
rr evaluate microsoft/vscode

# Test with repos that need work
rr evaluate torvalds/linux

# Test error cases
rr evaluate nonexistent/repo

# Test creation (requires GitHub token)
rr create --token your_token
```

### Adding Tests

We welcome contributions to improve our test coverage. Tests are located in the `__tests__` directory.

## Pull Request Process

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following our coding standards

3. **Test your changes** thoroughly:
   ```bash
   npm run build
   # Test manually with different scenarios
   ```

4. **Commit your changes** with clear, descriptive messages:
   ```bash
   git commit -m "feat: add new evaluation criterion for security policies"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub with:
   - Clear title and description
   - Reference any related issues
   - Screenshots/examples if applicable
   - Testing instructions

### PR Guidelines

- Keep PRs focused on a single feature or fix
- Update documentation if needed
- Ensure your code builds successfully
- Be responsive to feedback during review

## Questions?

- Check existing [issues](https://github.com/OpenSource-Communities/RepoReady/issues)
- Create a [new issue](https://github.com/OpenSource-Communities/RepoReady/issues/new) for bugs or feature requests
- Join our community discussions

## Recognition

Contributors will be recognized in our README and release notes. Thank you for helping make RepoReady better! 🙏

---

**Happy contributing!** 🚀