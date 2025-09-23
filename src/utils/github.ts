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

    // Check organization's .github repository for community health files
    return await this.checkOrgCommunityFile(owner, 'CONTRIBUTING.md');
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

    // Check organization's .github repository for community health files
    return await this.checkOrgCommunityFile(owner, 'CODE_OF_CONDUCT.md');
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

    // Check organization's .github repository for license file
    const licenseFiles = ['LICENSE', 'LICENSE.md', 'LICENSE.txt'];
    for (const filename of licenseFiles) {
      if (await this.checkOrgCommunityFile(owner, filename)) {
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

      // Check organization's .github repository for issue templates
      return await this.checkOrgIssueTemplates(owner);
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

    // Check organization's .github repository for PR template
    return await this.checkOrgCommunityFile(owner, 'PULL_REQUEST_TEMPLATE.md');
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

  /**
   * Check if a community health file exists in the organization's .github repository
   * @param owner The organization name
   * @param filename The community health file to check for (e.g., 'CODE_OF_CONDUCT.md')
   * @returns Promise<boolean> indicating if the file exists
   */
  private async checkOrgCommunityFile(owner: string, filename: string): Promise<boolean> {
    try {
      // First check if the .github repository exists for this organization
      await this.octokit.repos.get({
        owner,
        repo: '.github',
      });

      // Check for the file in various possible locations within the org's .github repo
      const possiblePaths = [
        `profile/${filename}`,
        filename,
        `.github/${filename}`
      ];

      for (const path of possiblePaths) {
        if (await this.checkFileExists(owner, '.github', path)) {
          return true;
        }
      }
      
      return false;
    } catch {
      // If .github repository doesn't exist or isn't accessible, return false
      return false;
    }
  }

  /**
   * Check if issue templates exist in the organization's .github repository
   * @param owner The organization name
   * @returns Promise<boolean> indicating if issue templates exist
   */
  private async checkOrgIssueTemplates(owner: string): Promise<boolean> {
    try {
      // First check if the .github repository exists for this organization
      await this.octokit.repos.get({
        owner,
        repo: '.github',
      });

      // Check for issue templates in the org's .github repo
      const possiblePaths = [
        '.github/ISSUE_TEMPLATE',
        'ISSUE_TEMPLATE',
        '.github/ISSUE_TEMPLATE.md',
        'ISSUE_TEMPLATE.md'
      ];

      for (const path of possiblePaths) {
        try {
          const { data } = await this.octokit.repos.getContent({
            owner,
            repo: '.github',
            path,
          });

          // If it's a directory with templates, check if it has content
          if (Array.isArray(data) && data.length > 0) {
            return true;
          }
          // If it's a single template file
          if (!Array.isArray(data)) {
            return true;
          }
        } catch {
          // Continue checking other paths
        }
      }
      
      return false;
    } catch {
      // If .github repository doesn't exist or isn't accessible, return false
      return false;
    }
  }
}