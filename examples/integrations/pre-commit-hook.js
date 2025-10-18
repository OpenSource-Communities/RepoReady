#!/usr/bin/env node
// examples/integrations/pre-commit-hook.js

/**
 * Example: Pre-commit Hook Integration
 * 
 * This script can be used as a pre-commit hook to evaluate
 * repository health before allowing commits.
 */

const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises;
const path = require('path');

const execPromise = util.promisify(exec);

class PreCommitEvaluator {
  constructor() {
    this.minimumScore = 60; // Minimum score required to allow commit
  }

  async getRepositoryInfo() {
    try {
      // Get current repository info from git
      const { stdout: remoteUrl } = await execPromise('git config --get remote.origin.url');
      const { stdout: branch } = await execPromise('git branch --show-current');
      
      // Parse GitHub URL to get owner/repo
      const match = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/]+)\.git$/);
      if (!match) {
        throw new Error('Not a GitHub repository');
      }
      
      return {
        owner: match[1],
        repo: match[2].replace('.git', ''),
        branch
      };
    } catch (error) {
      throw new Error('Could not determine repository information');
    }
  }

  async evaluateRepository(owner, repo) {
    try {
      console.log(`📊 Evaluating ${owner}/${repo}...`);
      
      const command = `node ../../dist/index.js evaluate ${owner}/${repo}`;
      const { stdout } = await execPromise(command);
      
      // Parse score from output
      const scoreMatch = stdout.match(/Score: (\d+)%/);
      return scoreMatch ? parseInt(scoreMatch[1]) : 0;
    } catch (error) {
      console.error(`❌ Error evaluating repository:`, error.message);
      return 0;
    }
  }

  async checkRepositoryHealth() {
    try {
      console.log('🔍 Pre-commit Repository Health Check\n');
      
      const repoInfo = await this.getRepositoryInfo();
      console.log(`Repository: ${repoInfo.owner}/${repoInfo.repo}`);
      console.log(`Branch: ${repoInfo.branch}\n`);
      
      const score = await this.evaluateRepository(repoInfo.owner, repoInfo.repo);
      
      console.log(`\n📊 Repository Score: ${score}%`);
      console.log(`Minimum Required: ${this.minimumScore}%`);
      
      if (score >= this.minimumScore) {
        console.log('✅ Repository health check passed! Proceeding with commit...');
        return true;
      } else {
        console.log('❌ Repository health check failed!');
        console.log('Please improve your repository before committing:');
        console.log('- Add a README.md');
        console.log('- Add a CONTRIBUTING.md');
        console.log('- Add a LICENSE file');
        console.log('- Add issue templates');
        console.log('- Add good first issues');
        return false;
      }
    } catch (error) {
      console.error('❌ Pre-commit check failed:', error.message);
      return false;
    }
  }
}

async function main() {
  const evaluator = new PreCommitEvaluator();
  const passed = await evaluator.checkRepositoryHealth();
  
  if (!passed) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { PreCommitEvaluator };
