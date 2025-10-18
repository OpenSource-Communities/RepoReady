#!/usr/bin/env node
// examples/advanced/check-org-repos.js

/**
 * Example: Check Organization Repositories
 * 
 * This script demonstrates how to evaluate all repositories
 * in a GitHub organization for contributor readiness.
 */

const { exec } = require('child_process');
const util = require('util');
const fs = require('fs').promises;
const path = require('path');

const execPromise = util.promisify(exec);

class OrganizationEvaluator {
  constructor(githubToken) {
    this.githubToken = githubToken;
    this.results = [];
  }

  async getOrganizationRepos(orgName) {
    try {
      console.log(`🔍 Fetching repositories for organization: ${orgName}`);
      
      // Use GitHub API to get organization repositories
      const command = `curl -H "Authorization: token ${this.githubToken}" "https://api.github.com/orgs/${orgName}/repos?per_page=100"`;
      const { stdout } = await execPromise(command);
      
      const repos = JSON.parse(stdout);
      return repos.map(repo => `${repo.owner.login}/${repo.name}`);
    } catch (error) {
      console.error(`❌ Error fetching organization repos:`, error.message);
      return [];
    }
  }

  async evaluateRepository(owner, repo) {
    try {
      console.log(`📊 Evaluating ${owner}/${repo}...`);
      
      const command = this.githubToken 
        ? `node ../../dist/index.js evaluate ${owner}/${repo} --token ${this.githubToken}`
        : `node ../../dist/index.js evaluate ${owner}/${repo}`;
      
      const { stdout } = await execPromise(command);
      
      // Parse the output to extract score information
      const scoreMatch = stdout.match(/Score: (\d+)%/);
      const ratingMatch = stdout.match(/Rating: (\w+)/);
      
      const result = {
        repository: `${owner}/${repo}`,
        score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
        rating: ratingMatch ? ratingMatch[1] : 'Unknown',
        timestamp: new Date().toISOString()
      };
      
      this.results.push(result);
      console.log(`   Score: ${result.score}% (${result.rating})`);
      
      return result;
    } catch (error) {
      console.error(`❌ Error evaluating ${owner}/${repo}:`, error.message);
      return null;
    }
  }

  async evaluateOrganization(orgName) {
    console.log(`🏢 Evaluating Organization: ${orgName}\n`);
    
    const repositories = await this.getOrganizationRepos(orgName);
    
    if (repositories.length === 0) {
      console.log('No repositories found for this organization');
      return;
    }
    
    console.log(`Found ${repositories.length} repositories to evaluate\n`);
    
    for (const repo of repositories) {
      const [owner, name] = repo.split('/');
      await this.evaluateRepository(owner, name);
      
      // Respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.generateOrganizationReport(orgName);
    await this.exportOrganizationResults(orgName);
  }

  generateOrganizationReport(orgName) {
    if (this.results.length === 0) return;
    
    console.log(`\n📊 Organization Report: ${orgName}`);
    console.log('='.repeat(60));
    
    const avgScore = this.results.reduce((sum, r) => sum + r.score, 0) / this.results.length;
    const ratingCounts = this.results.reduce((counts, r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
      return counts;
    }, {});
    
    // Sort by score
    const sortedResults = this.results.sort((a, b) => b.score - a.score);
    
    console.log(`Total Repositories: ${this.results.length}`);
    console.log(`Average Score: ${avgScore.toFixed(1)}%`);
    console.log(`Rating Distribution:`, ratingCounts);
    
    console.log('\nTop Performing Repositories:');
    sortedResults.slice(0, 5).forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.repository} - ${result.score}% (${result.rating})`);
    });
    
    console.log('\nRepositories Needing Attention:');
    sortedResults.slice(-5).reverse().forEach((result, index) => {
      console.log(`  ${index + 1}. ${result.repository} - ${result.score}% (${result.rating})`);
    });
  }

  async exportOrganizationResults(orgName) {
    const outputPath = path.join(__dirname, '..', 'data', `${orgName}-evaluation.json`);
    await fs.writeFile(outputPath, JSON.stringify(this.results, null, 2));
    console.log(`\n📄 Organization results exported to ${outputPath}`);
  }
}

// Example usage
async function main() {
  const orgName = process.argv[2];
  const token = process.env.GITHUB_TOKEN;
  
  if (!orgName) {
    console.error('Please provide organization name: node check-org-repos.js <org-name>');
    process.exit(1);
  }
  
  if (!token) {
    console.error('Please set GITHUB_TOKEN environment variable');
    process.exit(1);
  }
  
  const evaluator = new OrganizationEvaluator(token);
  await evaluator.evaluateOrganization(orgName);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { OrganizationEvaluator };
