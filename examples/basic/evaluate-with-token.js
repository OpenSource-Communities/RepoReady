#!/usr/bin/env node
// examples/basic/evaluate-with-token.js

/**
 * Example: Using GitHub Tokens with RepoReady
 * 
 * This script demonstrates best practices for using GitHub tokens
 * to avoid rate limits and access private repositories.
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function evaluateWithToken() {
  console.log('🔑 GitHub Token Usage Example\n');
  
  // Check for token
  if (!process.env.GITHUB_TOKEN) {
    console.log('❌ GITHUB_TOKEN environment variable not set.');
    console.log('Set it with: export GITHUB_TOKEN=your_token_here');
    console.log('Get a token at: https://github.com/settings/tokens');
    process.exit(1);
  }
  
  console.log('✅ GitHub token found');
  console.log('This allows for higher rate limits and access to private repos\n');
  
  const repositories = [
    'microsoft/vscode',
    'facebook/react',
    'nodejs/node'
  ];
  
  for (const repo of repositories) {
    try {
      console.log(`📊 Evaluating ${repo} with token...`);
      
      // Use token flag for better rate limits
      const { stdout } = await execPromise(`node ../../dist/index.js evaluate ${repo} --token ${process.env.GITHUB_TOKEN}`);
      
      console.log(stdout);
      console.log('─'.repeat(50));
      
      // Shorter delay since we have a token
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error(`❌ Error evaluating ${repo}:`, error.message);
    }
  }
  
  console.log('\n💡 Token Benefits:');
  console.log('- Higher rate limits (5000 requests/hour vs 60)');
  console.log('- Access to private repositories');
  console.log('- Better error messages');
  console.log('- Faster evaluation process');
}

// Run if called directly
if (require.main === module) {
  evaluateWithToken();
}

module.exports = { evaluateWithToken };
