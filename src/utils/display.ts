import chalk from 'chalk';
import Table from 'cli-table3';
import { RepositoryScore } from '../types';

export class DisplayUtils {
  static showRepositoryScore(score: RepositoryScore): void {
    console.log(chalk.bold.blue('\n🔍 Repository Evaluation Results\n'));
    
    // Repository Info
    console.log(chalk.bold('Repository:'), `${score.repository.owner}/${score.repository.repo}`);
    console.log(chalk.bold('Description:'), score.repository.description || chalk.gray('No description'));
    
    if (score.repository.topics.length > 0) {
      console.log(chalk.bold('Topics:'), score.repository.topics.join(', '));
    }
    
    console.log('');

    // Overall Score
    const ratingColor = this.getRatingColor(score.rating);
    console.log(chalk.bold('Overall Score:'), `${score.totalScore}/${score.maxScore} (${score.percentage}%)`);
    console.log(chalk.bold('Rating:'), ratingColor(score.rating));
    console.log('');

    // Detailed Results Table
    const table = new Table({
      head: [
        chalk.bold('Criteria'),
        chalk.bold('Status'),
        chalk.bold('Weight'),
        chalk.bold('Description')
      ],
      colWidths: [25, 10, 8, 50],
      wordWrap: true
    });

    score.results.forEach(result => {
      const status = result.passed 
        ? chalk.green('✓ Pass')
        : chalk.red('✗ Fail');
      
      table.push([
        result.criteria,
        status,
        result.weight,
        result.description
      ]);
    });

    console.log(table.toString());

    // Recommendations
    if (score.recommendations.length > 0) {
      console.log(chalk.bold.yellow('\n💡 Recommendations to improve contributor readiness:\n'));
      score.recommendations.forEach((rec, index) => {
        console.log(chalk.yellow(`${index + 1}.`), rec);
      });
    }

    // Summary message
    console.log(this.getSummaryMessage(score.rating, score.percentage));
  }

  private static getRatingColor(rating: string): (text: string) => string {
    switch (rating) {
      case 'Excellent': return chalk.green.bold;
      case 'Good': return chalk.green;
      case 'Fair': return chalk.yellow;
      case 'Needs Work': return chalk.yellow;
      case 'Not Ready': return chalk.red;
      default: return chalk.white;
    }
  }

  private static getSummaryMessage(rating: string, percentage: number): string {
    const messages = {
      'Excellent': chalk.green.bold('\n🎉 Excellent! Your repository is very well prepared for contributors!'),
      'Good': chalk.green('\n👍 Good work! Your repository is well-suited for contributors with minor improvements needed.'),
      'Fair': chalk.yellow('\n⚠️  Your repository has potential but needs some important improvements to attract contributors.'),
      'Needs Work': chalk.yellow('\n🔧 Your repository needs significant work before it\'s ready for external contributors.'),
      'Not Ready': chalk.red('\n❌ Your repository is not ready for contributors yet. Focus on the basic requirements first.')
    };

    return messages[rating as keyof typeof messages] || chalk.white('\nEvaluation complete.');
  }

  static showCreateRepositorySuccess(owner: string, repo: string): void {
    console.log(chalk.green.bold('\n✅ Repository created successfully!'));
    console.log(chalk.bold('Repository:'), `${owner}/${repo}`);
    console.log(chalk.bold('URL:'), `https://github.com/${owner}/${repo}`);
    console.log(chalk.yellow('\n💡 Next steps:'));
    console.log('1. Add a comprehensive README.md');
    console.log('2. Add a LICENSE file');
    console.log('3. Add CONTRIBUTING.md guidelines');
    console.log('4. Add a CODE_OF_CONDUCT.md');
    console.log('5. Create issue and PR templates');
    console.log(chalk.blue('\nRun the evaluation command to check your progress!'));
  }

  static showError(message: string): void {
    console.error(chalk.red.bold('❌ Error:'), chalk.red(message));
  }

  static showWarning(message: string): void {
    console.warn(chalk.yellow.bold('⚠️  Warning:'), chalk.yellow(message));
  }

  static showInfo(message: string): void {
    console.log(chalk.blue.bold('ℹ️  Info:'), chalk.blue(message));
  }
}