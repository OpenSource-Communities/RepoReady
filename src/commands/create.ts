import { Command } from 'commander';
import { input, confirm } from '@inquirer/prompts';
import ora from 'ora';
import { GitHubService } from '../utils/github';
import { DisplayUtils } from '../utils/display';

import { HeaderUtils } from '../utils/ascii';

export function createCreateCommand(): Command {
  const command = new Command('create');
  
  command
    .description('Create a new GitHub repository optimized for contributors')
    .option('-t, --token <token>', 'GitHub personal access token (required for creating repositories)')
    .option('-n, --name <name>', 'Repository name')
    .option('-d, --description <description>', 'Repository description')
    .option('--private', 'Create a private repository (default: public)')
    .action(async (options: { 
      token?: string;
      name?: string;
      description?: string;
      private?: boolean;
    }) => {
      // Show header
      console.log(HeaderUtils.getHeader());
      
      try {
        // Check for required token
        if (!options.token) {
          DisplayUtils.showError('GitHub personal access token is required to create repositories.');
          console.log('Create a token at: https://github.com/settings/tokens');
          console.log('Use --token flag or set GITHUB_TOKEN environment variable');
          process.exit(1);
        }

        // Get repository details from user if not provided
        let name = options.name;
        let description = options.description;

        if (!name) {
          name = await input({
            message: 'Repository name:',
            validate: (input: string) => {
              if (!input.trim()) return 'Repository name is required';
              if (!/^[a-zA-Z0-9._-]+$/.test(input)) return 'Repository name can only contain letters, numbers, dots, hyphens, and underscores';
              return true;
            }
          });
        }
        
        if (!description) {
          description = await input({
            message: 'Repository description:',
            validate: (input: string) => {
              if (!input.trim()) return 'Repository description is required';
              if (input.length < 10) return 'Description should be at least 10 characters long';
              return true;
            }
          });
        }

        const spinner = ora('Creating repository...').start();

        // Initialize GitHub service
        const githubService = new GitHubService(options.token);

        // Create repository
        const { owner, repo } = await githubService.createRepository(
          name!,
          description!,
          options.private || false
        );

        spinner.succeed('Repository created successfully!');

        // Show success message and next steps
        DisplayUtils.showCreateRepositorySuccess(owner, repo);

        // Prompt to evaluate the new repository
        const shouldEvaluate = await confirm({
          message: 'Would you like to evaluate your new repository now?',
          default: true
        });

        if (shouldEvaluate) {
          console.log('\n' + '='.repeat(50) + '\n');
          
          const evalSpinner = ora('Evaluating new repository...').start();
          
          // Import and run evaluation
          const { RepositoryEvaluator } = await import('../evaluator');
          
          const repositoryInfo = await githubService.getRepositoryInfo(owner, repo);
          const evaluator = new RepositoryEvaluator();
          const score = await evaluator.evaluate(repositoryInfo);

          evalSpinner.succeed('Evaluation complete!');
          DisplayUtils.showRepositoryScore(score);
        }

      } catch (error) {
        if (error instanceof Error) {
          if (error.message.includes('name already exists')) {
            DisplayUtils.showError('A repository with this name already exists in your account.');
          } else if (error.message.includes('Bad credentials')) {
            DisplayUtils.showError('Invalid GitHub token. Please check your token and try again.');
          } else {
            DisplayUtils.showError(error.message);
          }
        } else {
          DisplayUtils.showError('An unexpected error occurred while creating the repository');
        }
        
        process.exit(1);
      }
    });

  return command;
}