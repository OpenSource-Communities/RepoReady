import { Octokit } from '@octokit/rest';
import { RepositoryInfo } from '../types';

export class GitHubService {
  private octokit: Octokit;

  constructor(token?: string) {
    this.octokit = new Octokit({
      auth: token,
    });
  }

  async getRepositoryInfo(owner: string, repo: string): Promise<RepositoryInfo> {
    try {
      // Get repository basic info
      const { data: repoData } = await this.octokit.repos.get({
        owner,
        repo,
      });

      // Check for various files
      const [
        readme,
        contributing,
        codeOfConduct,
        license,
        issueTemplates,
        prTemplate,
        issues
      ] = await Promise.allSettled([
        this.checkFileExists(owner, repo, 'README.md'),
        this.checkContributingFile(owner, repo),
        this.checkCodeOfConductFile(owner, repo),
        this.checkLicenseFile(owner, repo),
        this.checkIssueTemplates(owner, repo),
        this.checkPullRequestTemplate(owner, repo),
        this.checkLabeledIssues(owner, repo)
      ]);

      const issuesData = issues.status === 'fulfilled' ? issues.value : { hasGoodFirst: false, hasHelpWanted: false };

      return {
        owner,
        repo,
        name: repoData.name,
        description: repoData.description || '',
        topics: repoData.topics || [],
        hasReadme: readme.status === 'fulfilled' ? readme.value : false,
        hasContributing: contributing.status === 'fulfilled' ? contributing.value : false,
        hasCodeOfConduct: codeOfConduct.status === 'fulfilled' ? codeOfConduct.value : false,
        hasLicense: license.status === 'fulfilled' ? license.value : false,
        hasIssueTemplates: issueTemplates.status === 'fulfilled' ? issueTemplates.value : false,
        hasPullRequestTemplate: prTemplate.status === 'fulfilled' ? prTemplate.value : false,
        hasGoodFirstIssues: issuesData.hasGoodFirst,
        hasHelpWantedIssues: issuesData.hasHelpWanted,
        isArchived: repoData.archived,
        defaultBranch: repoData.default_branch,
      };
    } catch (error) {
      throw new Error(`Failed to fetch repository information: ${error}`);
    }
  }

  private async checkFileExists(owner: string, repo: string, path: string): Promise<boolean> {
    try {
      await this.octokit.repos.getContent({
        owner,
        repo,
        path,
      });
      return true;
    } catch {
      return false;
    }
  }

  private async checkContributingFile(owner: string, repo: string): Promise<boolean> {
    const possiblePaths = [
      'CONTRIBUTING.md',
      'CONTRIBUTING.txt',
      'CONTRIBUTIONS.md',
      'CONTRIBUTIONS.txt',
      '.github/CONTRIBUTING.md',
      'docs/CONTRIBUTING.md'
    ];

    for (const path of possiblePaths) {
      if (await this.checkFileExists(owner, repo, path)) {
        return true;
      }
    }
    return false;
  }

  private async checkCodeOfConductFile(owner: string, repo: string): Promise<boolean> {
    const possiblePaths = [
      'CODE_OF_CONDUCT.md',
      'CODE_OF_CONDUCT.txt',
      '.github/CODE_OF_CONDUCT.md',
      'docs/CODE_OF_CONDUCT.md'
    ];

    for (const path of possiblePaths) {
      if (await this.checkFileExists(owner, repo, path)) {
        return true;
      }
    }
    return false;
  }

  private async checkLicenseFile(owner: string, repo: string): Promise<boolean> {
    const possiblePaths = [
      'LICENSE',
      'LICENSE.md',
      'LICENSE.txt',
      'LICENSE.rst',
      'COPYING',
      'COPYING.md',
      'COPYING.txt'
    ];

    for (const path of possiblePaths) {
      if (await this.checkFileExists(owner, repo, path)) {
        return true;
      }
    }
    return false;
  }

  private async checkIssueTemplates(owner: string, repo: string): Promise<boolean> {
    try {
      const { data } = await this.octokit.repos.getContent({
        owner,
        repo,
        path: '.github/ISSUE_TEMPLATE',
      });

      return Array.isArray(data) && data.length > 0;
    } catch {
      // Check for individual template files
      const templateFiles = [
        '.github/ISSUE_TEMPLATE.md',
        '.github/issue_template.md',
        'ISSUE_TEMPLATE.md'
      ];

      for (const path of templateFiles) {
        if (await this.checkFileExists(owner, repo, path)) {
          return true;
        }
      }
      return false;
    }
  }

  private async checkPullRequestTemplate(owner: string, repo: string): Promise<boolean> {
    const possiblePaths = [
      '.github/PULL_REQUEST_TEMPLATE.md',
      '.github/pull_request_template.md',
      'PULL_REQUEST_TEMPLATE.md',
      'pull_request_template.md'
    ];

    for (const path of possiblePaths) {
      if (await this.checkFileExists(owner, repo, path)) {
        return true;
      }
    }
    return false;
  }

  private async checkLabeledIssues(owner: string, repo: string): Promise<{ hasGoodFirst: boolean; hasHelpWanted: boolean }> {
    try {
      const [goodFirstIssues, helpWantedIssues] = await Promise.all([
        this.octokit.issues.listForRepo({
          owner,
          repo,
          labels: 'good first issue',
          state: 'open',
          per_page: 1,
        }),
        this.octokit.issues.listForRepo({
          owner,
          repo,
          labels: 'help wanted',
          state: 'open',
          per_page: 1,
        }),
      ]);

      return {
        hasGoodFirst: goodFirstIssues.data.length > 0,
        hasHelpWanted: helpWantedIssues.data.length > 0,
      };
    } catch {
      return { hasGoodFirst: false, hasHelpWanted: false };
    }
  }

  async createRepository(name: string, description: string, isPrivate: boolean = false): Promise<{ owner: string; repo: string }> {
    try {
      const { data } = await this.octokit.repos.createForAuthenticatedUser({
        name,
        description,
        private: isPrivate,
        auto_init: true,
        gitignore_template: 'Node',
      });

      return {
        owner: data.owner.login,
        repo: data.name,
      };
    } catch (error) {
      throw new Error(`Failed to create repository: ${error}`);
    }
  }
}