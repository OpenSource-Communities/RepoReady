import { EvaluationCriteria, RepositoryInfo } from '../types';

export const evaluationCriteria: EvaluationCriteria[] = [
  {
    name: 'Repository Name',
    description: 'Repository has a relevant and descriptive name',
    weight: 5,
    check: (repo: RepositoryInfo) => {
      // Check if name is not default/generic
      const genericNames = ['test', 'repo', 'project', 'new-repo', 'untitled'];
      return !genericNames.includes(repo.name.toLowerCase()) && repo.name.length > 2;
    }
  },
  {
    name: 'Description',
    description: 'Repository has a clear description explaining what it does',
    weight: 10,
    check: (repo: RepositoryInfo) => {
      return repo.description.length > 10;
    }
  },
  {
    name: 'Topics/Tags',
    description: 'Repository has relevant topics/tags for discoverability',
    weight: 8,
    check: (repo: RepositoryInfo) => {
      return repo.topics.length >= 2;
    }
  },
  {
    name: 'README File',
    description: 'Repository has a comprehensive README.md file',
    weight: 20,
    check: (repo: RepositoryInfo) => {
      return repo.hasReadme;
    }
  },
  {
    name: 'Contributing Guidelines',
    description: 'Repository has a CONTRIBUTING.md file with contribution guidelines',
    weight: 15,
    check: (repo: RepositoryInfo) => {
      return repo.hasContributing;
    }
  },
  {
    name: 'Code of Conduct',
    description: 'Repository has a Code of Conduct to ensure a welcoming environment',
    weight: 12,
    check: (repo: RepositoryInfo) => {
      return repo.hasCodeOfConduct;
    }
  },
  {
    name: 'Open Source License',
    description: 'Repository has a valid open source license',
    weight: 15,
    check: (repo: RepositoryInfo) => {
      return repo.hasLicense;
    }
  },
  {
    name: 'Issue Templates',
    description: 'Repository has issue templates to guide contributors',
    weight: 8,
    check: (repo: RepositoryInfo) => {
      return repo.hasIssueTemplates;
    }
  },
  {
    name: 'Pull Request Template',
    description: 'Repository has a pull request template to standardize contributions',
    weight: 7,
    check: (repo: RepositoryInfo) => {
      return repo.hasPullRequestTemplate;
    }
  },
  {
    name: 'Good First Issues',
    description: 'Repository has issues labeled for beginners (good first issue)',
    weight: 10,
    check: (repo: RepositoryInfo) => {
      return repo.hasGoodFirstIssues;
    }
  },
  {
    name: 'Help Wanted Issues',
    description: 'Repository has issues labeled as help wanted',
    weight: 8,
    check: (repo: RepositoryInfo) => {
      return repo.hasHelpWantedIssues;
    }
  },
  {
    name: 'Active Repository',
    description: 'Repository is not archived and actively maintained',
    weight: 5,
    check: (repo: RepositoryInfo) => {
      return !repo.isArchived;
    }
  }
];

export function calculateRating(percentage: number): 'Excellent' | 'Good' | 'Fair' | 'Needs Work' | 'Not Ready' {
  if (percentage >= 90) return 'Excellent';
  if (percentage >= 75) return 'Good';
  if (percentage >= 60) return 'Fair';
  if (percentage >= 40) return 'Needs Work';
  return 'Not Ready';
}

export function generateRecommendations(results: Array<{ criteria: string; passed: boolean; weight: number }>): string[] {
  const recommendations: string[] = [];
  
  const failedItems = results.filter(r => !r.passed).sort((a, b) => b.weight - a.weight);
  
  for (const item of failedItems) {
    switch (item.criteria) {
      case 'Repository Name':
        recommendations.push('Choose a more descriptive and relevant repository name');
        break;
      case 'Description':
        recommendations.push('Add a clear description explaining what your project does and who it\'s for');
        break;
      case 'Topics/Tags':
        recommendations.push('Add relevant topics/tags to help with discoverability (tech stack, purpose, etc.)');
        break;
      case 'README File':
        recommendations.push('Create a comprehensive README.md with project description, installation, and usage instructions');
        break;
      case 'Contributing Guidelines':
        recommendations.push('Add a CONTRIBUTING.md file explaining how others can contribute to your project (can be added to the repository or organization\'s .github repository)');
        break;
      case 'Code of Conduct':
        recommendations.push('Add a CODE_OF_CONDUCT.md file to create a welcoming environment for contributors (can be added to the repository or organization\'s .github repository)');
        break;
      case 'Open Source License':
        recommendations.push('Add an open source license (MIT, Apache 2.0, GPL, etc.) to make your project truly open source (can be added to the repository or organization\'s .github repository)');
        break;
      case 'Issue Templates':
        recommendations.push('Create issue templates in .github/ISSUE_TEMPLATE/ to help contributors report bugs and request features (can be added to the repository or organization\'s .github repository)');
        break;
      case 'Pull Request Template':
        recommendations.push('Add a pull request template to standardize contribution submissions (can be added to the repository or organization\'s .github repository)');
        break;
      case 'Good First Issues':
        recommendations.push('Create and label some issues as "good first issue" to welcome new contributors');
        break;
      case 'Help Wanted Issues':
        recommendations.push('Label issues as "help wanted" to indicate where you need community assistance');
        break;
      case 'Active Repository':
        recommendations.push('Ensure your repository is not archived and shows recent activity');
        break;
    }
  }
  
  return recommendations.slice(0, 5); // Limit to top 5 recommendations
}