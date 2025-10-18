#!/usr/bin/env node
// examples/basic/evaluate-popular-repos.js

/**
 * Example: Evaluate Popular Open Source Repositories
 * 
 * This script demonstrates how to use RepoReady to evaluate
 * several well-known open source repositories and compare their scores.
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

const popularRepos = [
  'facebook/react',
  'microsoft/vscode',
  'nodejs/node',
  'tensorflow/tensorflow',
  'vuejs/vue'
];

async function evaluateRepos() {
  console.log('🚀 Evaluating Popular Open Source Repositories\n');
  console.log('This may take a moment due to API rate limits...\n');
  
  for (const repo of popularRepos) {
    try {
      console.log(`📊 Evaluating ${repo}...`);
      
      // Use the built RepoReady CLI
      const { stdout } = await execPromise(`node ../../dist/index.js evaluate ${repo}`);
      
      console.log(stdout);
      console.log('─'.repeat(50));
      
      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`❌ Error evaluating ${repo}:`, error.message);
    }
  }
}

// Run if called directly
if (require.main === module) {
  evaluateRepos()
    .then(() => console.log('✅ Evaluation complete!'))
    .catch(console.error);
}

module.exports = { evaluateRepos, popularRepos };
