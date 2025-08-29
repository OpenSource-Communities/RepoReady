import { Command } from 'commander';
import ora from 'ora';
import { GitHubService } from '../utils/github';
import { RepositoryEvaluator } from '../evaluator';
import { DisplayUtils } from '../utils/display';
import { AsciiArt } from '../utils/ascii';

export function createEvaluateCommand(): Command {
  const command = new Command('evaluate');
  
  command
    .description('Evaluate a GitHub repository for contributor readiness')
    .argument('<repository>', 'Repository in format owner/repo (e.g., facebook/react)')
    .option('-t, --token <token>', 'GitHub personal access token (for higher rate limits)')
    .action(async (repository: string, options: { token?: string }) => {
      const spinner = ora('Fetching repository information...').start();
      
      try {
        // Parse repository argument
        const [owner, repo] = repository.split('/');
        if (!owner || !repo) {
          throw new Error('Repository must be in format "owner/repo" (e.g., facebook/react)');
        }

        // Initialize services
        const githubService = new GitHubService(options.token);
        const evaluator = new RepositoryEvaluator();

        // Fetch repository information
        spinner.text = 'Analyzing repository...';
        const repositoryInfo = await githubService.getRepositoryInfo(owner, repo);

        // Evaluate repository
        spinner.text = 'Evaluating contributor readiness...';
        const score = await evaluator.evaluate(repositoryInfo);

        spinner.succeed('Evaluation complete!');

        // Show ASCII header
        console.log(AsciiArt.getSimpleHeader());
        
        // Display results
        DisplayUtils.showRepositoryScore(score);

      } catch (error) {
        spinner.fail('Evaluation failed');
        
        if (error instanceof Error) {
          if (error.message.includes('Not Found')) {
            DisplayUtils.showError('Repository not found. Please check the repository name and ensure it exists.');
          } else if (error.message.includes('rate limit')) {
            DisplayUtils.showError('GitHub API rate limit exceeded. Try using a personal access token with --token flag.');
          } else {
            DisplayUtils.showError(error.message);
          }
        } else {
          DisplayUtils.showError('An unexpected error occurred');
        }
        
        process.exit(1);
      }
    });

  return command;
}