<!--
How to Maintain This Changelog

### For Contributors
- Add entries to the "Unreleased" section when making changes.
- Use the appropriate category (Added, Changed, Fixed, etc.).
- Write entries from the user's perspective.
- Reference issue numbers when applicable.

### For Maintainers
- Move "Unreleased" items to a new version section when releasing.
- Add the release date.
- Update the comparison links at the bottom.
- Tag the release in Git with the version number.
- When preparing the next development cycle, recreate the [Unreleased] section
  and add a new comparison link:
  [unreleased]: https://github.com/OpenSource-Communities/RepoReady/compare/<latest_version>...HEAD

### Categories
- **Added** for new features.
- **Changed** for changes in existing functionality.
- **Deprecated** for soon-to-be removed features.
- **Removed** for now removed features.
- **Fixed** for any bug fixes.
- **Security** in case of vulnerabilities.

### Template for Adding a New Version
Use this block as an example when creating a new version section:

## [Unreleased]

### Added
- _Nothing yet_

### Changed
- _Nothing yet_

### Deprecated
- _Nothing yet_

### Removed
- _Nothing yet_

### Fixed
- _Nothing yet_

### Security
- _Nothing yet_
-->

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-29

### Added
- Initial release of RepoReady CLI
- Repository evaluation functionality
- Repository creation functionality
- Support for GitHub personal access tokens
- Comprehensive scoring system with 12 evaluation criteria
- Organization-level community health file checking
- Interactive CLI with `intro` and `examples` commands
- Support for both npm installation and local development

### Features
- **Evaluate command**: Analyze any GitHub repository for contributor readiness
- **Create command**: Set up new contributor-friendly GitHub repositories
- **Scoring system**: 5-tier rating system (Excellent, Good, Fair, Needs Work, Not Ready)
- **Actionable recommendations**: Specific suggestions for improvement
- **Community health file detection**: Checks both repository and organization levels

### Evaluation Criteria
- Repository name and description
- README file presence and quality
- Contributing guidelines
- Code of conduct
- Open source license
- Issue and PR templates
- Good first issues and help wanted labels
- Repository topics and activity status

[1.0.0]: https://github.com/OpenSource-Communities/RepoReady/releases/tag/v1.0.0