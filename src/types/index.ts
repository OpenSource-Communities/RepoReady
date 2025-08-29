export interface RepositoryInfo {
  owner: string;
  repo: string;
  name: string;
  description: string;
  topics: string[];
  hasReadme: boolean;
  hasContributing: boolean;
  hasCodeOfConduct: boolean;
  hasLicense: boolean;
  hasIssueTemplates: boolean;
  hasPullRequestTemplate: boolean;
  hasGoodFirstIssues: boolean;
  hasHelpWantedIssues: boolean;
  isArchived: boolean;
  defaultBranch: string;
}

export interface EvaluationCriteria {
  name: string;
  description: string;
  weight: number;
  check: (repo: RepositoryInfo) => boolean | Promise<boolean>;
}

export interface EvaluationResult {
  criteria: string;
  passed: boolean;
  weight: number;
  description: string;
}

export interface RepositoryScore {
  repository: RepositoryInfo;
  results: EvaluationResult[];
  totalScore: number;
  maxScore: number;
  percentage: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Needs Work' | 'Not Ready';
  recommendations: string[];
}