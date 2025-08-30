import chalk from 'chalk';

import { HeaderUtils } from './ascii';
import { DisplayUtils } from './display';

export class IntroUtils {
  static showWelcome(): void {
    const welcome = [
      HeaderUtils.getHeader(),
      
      chalk.bold.blue('👋 Welcome to RepoReady!'),
      '',
      'RepoReady helps you evaluate and create contributor-ready GitHub repositories.',
      '',
      
      chalk.bold('🚀 Quick Start:'),
      '',
      chalk.cyan('  # Evaluate any GitHub repository'),
      chalk.gray('  rr evaluate owner/repo-name'),
      '',
      chalk.cyan('  # Try it with a popular project'),
      chalk.gray('  rr evaluate facebook/react'),
      '',
      chalk.cyan('  # Create a new contributor-ready repository'),
      chalk.gray('  rr create --token your_github_token'),
      '',
      
      chalk.bold('📊 What RepoReady Evaluates:'),
      '',
      '  ✅ Essential files (README, LICENSE, CONTRIBUTING)',
      '  ✅ Community health (Code of Conduct, issue templates)',
      '  ✅ Beginner-friendliness (good first issues, help wanted)',
      '  ✅ Project discoverability (description, topics)',
      '',
      
      chalk.bold('💡 Pro Tips:'),
      '',
      '  • Use a GitHub token for higher rate limits:',
      chalk.gray('    rr evaluate owner/repo --token your_token'),
      '',
      '  • Get detailed help for any command:',
      chalk.gray('    rr evaluate --help'),
      chalk.gray('    rr create --help'),
      '',
      
      chalk.bold('🔗 Need a GitHub token?'),
      '  Visit: ' + chalk.blue.underline('https://github.com/settings/tokens'),
      '',
      
      chalk.dim('Run any command above to get started, or use --help for more options.'),
      ''
    ];
    
    console.log(welcome.join('\n'));
  }

  static showFirstRun(): void {
    DisplayUtils.showInfo('First time using RepoReady?');
    
    const firstRunInfo = [
      '',
      'Let\'s start by evaluating a well-known repository:',
      '',
      chalk.cyan('  rr evaluate facebook/react'),
      '',
      'This will show you how RepoReady scores repositories based on',
      'contributor-readiness criteria from open source best practices.',
      ''
    ];
    
    console.log(firstRunInfo.join('\n'));
  }

  static showExamples(): void {
    const examples = [
      chalk.bold('📚 Example Commands:'),
      '',
      
      chalk.yellow('🔍 Evaluate repositories:'),
      chalk.gray('  rr evaluate microsoft/vscode    # Excellent example'),
      chalk.gray('  rr evaluate facebook/react      # Well-maintained project'),
      chalk.gray('  rr evaluate torvalds/linux      # See areas for improvement'),
      '',
      
      chalk.yellow('🆕 Create new projects:'),
      chalk.gray('  rr create --name "my-project" --description "A cool tool"'),
      chalk.gray('  rr create --token ghp_xxx...    # Interactive mode'),
      '',
      
      chalk.yellow('⚙️  Advanced usage:'),
      chalk.gray('  rr evaluate owner/repo --token ghp_xxx  # Higher rate limits'),
      chalk.gray('  rr create --private                     # Create private repo'),
      ''
    ];
    
    console.log(examples.join('\n'));
  }
}