#!/usr/bin/env node
// examples/advanced/batch-evaluate.js

/**
 * Example: Batch Repository Evaluation with Export
 * 
 * Evaluates multiple repositories and exports results to JSON
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

class BatchEvaluator {
  constructor(githubToken) {
    this.githubToken = githubToken;
    this.results = [];
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
        timestamp: new Date().toISOString(),
        score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
        rating: ratingMatch ? ratingMatch[1] : 'Unknown',
        rawOutput: stdout
      };
      
      this.results.push(result);
      console.log(`   Score: ${result.score}% (${result.rating})`);
      
      return result;
    } catch (error) {
      console.error(`❌ Error evaluating ${owner}/${repo}:`, error.message);
      return null;
    }
  }

  async evaluateBatch(repositories) {
    for (const repo of repositories) {
      const [owner, name] = repo.split('/');
      await this.evaluateRepository(owner, name);
      
      // Respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  async exportResults(filename = 'evaluation-results.json') {
    const outputPath = path.join(__dirname, '..', 'data', filename);
    await fs.writeFile(outputPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 Results exported to ${outputPath}`);
  }

  generateSummary() {
    if (this.results.length === 0) return;
    
    const avgScore = this.results.reduce((sum, r) => sum + r.score, 0) / this.results.length;
    const ratingCounts = this.results.reduce((counts, r) => {
      counts[r.rating] = (counts[r.rating] || 0) + 1;
      return counts;
    }, {});
    
    console.log('\n📈 Batch Evaluation Summary');
    console.log(`   Repositories evaluated: ${this.results.length}`);
    console.log(`   Average score: ${avgScore.toFixed(1)}%`);
    console.log(`   Rating distribution:`, ratingCounts);
  }
}

// Example usage
const exampleRepos = [
  'OpenSource-Communities/RepoReady',
  'facebook/react',
  'microsoft/typescript'
];

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.error('Please set GITHUB_TOKEN environment variable');
    process.exit(1);
  }
  
  const batchEvaluator = new BatchEvaluator(token);
  
  await batchEvaluator.evaluateBatch(exampleRepos);
  batchEvaluator.generateSummary();
  await batchEvaluator.exportResults();
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { BatchEvaluator };
