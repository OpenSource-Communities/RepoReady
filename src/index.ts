#!/usr/bin/env node

import { Command } from 'commander';
import { createEvaluateCommand } from './commands/evaluate';
import { createCreateCommand } from './commands/create';
import { IntroUtils } from './utils/intro';

const program = new Command();

program
  .name('rr')
  .description('This CLI tool helps maintainers to evaluate and create contributor-ready GitHub repositories :rocket:')
  .version('1.0.0');

// Add intro command
program
  .command('intro')
  .description('Show introduction and getting started guide')
  .action(() => {
    IntroUtils.showWelcome();
  });

// Add examples command  
program
  .command('examples')
  .description('Show example commands and usage patterns')
  .action(() => {
    IntroUtils.showExamples();
  });

// Add commands
program.addCommand(createEvaluateCommand());
program.addCommand(createCreateCommand());

// Show welcome introduction if no command provided
if (!process.argv.slice(2).length) {
  IntroUtils.showWelcome();
}

program.parse();
