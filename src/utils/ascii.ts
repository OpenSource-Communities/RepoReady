import chalk from 'chalk';

export class HeaderUtils {
  static getHeader(): string {
    const title = chalk.hex('#667eea').bold('RepoReady');
    const subtitle = chalk.gray('🚀 Evaluate & Create Contributor-Ready Repositories');
    
    return `\n  ${title}\n  ${subtitle}\n`;
  }
}