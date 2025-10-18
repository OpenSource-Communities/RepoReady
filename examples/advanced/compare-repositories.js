#!/usr/bin/env node
// examples/advanced/compare-repositories.js

/**
 * Example: Compare Multiple Repositories
 * 
 * This script evaluates multiple repositories and provides
 * a side-by-side comparison of their scores.
 */

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class RepositoryComparator {
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
      
      return {
        repository: `${owner}/${repo}`,
        score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
        rating: ratingMatch ? ratingMatch[1] : 'Unknown',
        rawOutput: stdout
      };
    } catch (error) {
      console.error(`❌ Error evaluating ${owner}/${repo}:`, error.message);
      return null;
    }
  }

  async compareRepositories(repositories) {
    console.log('🔄 Comparing Repositories\n');
    
    for (const repo of repositories) {
      const [owner, name] = repo.split('/');
      const result = await this.evaluateRepository(owner, name);
      if (result) {
        this.results.push(result);
      }
      
      // Respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    this.displayComparison();
  }

  displayComparison() {
    if (this.results.length === 0) {
      console.log('No results to compare');
      return;
    }

    console.log('\n📊 Repository Comparison Results\n');
    console.log('='.repeat(80));
    console.log('Repository'.padEnd(30) + 'Score'.padEnd(10) + 'Rating'.padEnd(15) + 'Status');
    console.log('='.repeat(80));
    
    // Sort by score descending
    const sortedResults = this.results.sort((a, b) => b.score - a.score);
    
    sortedResults.forEach((result, index) => {
      const status = index === 0 ? '🥇 Best' : index === 1 ? '🥈 2nd' : index === 2 ? '🥉 3rd' : '   ';
      console.log(
        result.repository.padEnd(30) + 
        `${result.score}%`.padEnd(10) + 
        result.rating.padEnd(15) + 
        status
      );
    });
    
    console.log('='.repeat(80));
    
    // Show statistics
    const avgScore = this.results.reduce((sum, r) => sum + r.score, 0) / this.results.length;
    const bestRepo = sortedResults[0];
    const worstRepo = sortedResults[sortedResults.length - 1];
    
    console.log(`\n📈 Statistics:`);
    console.log(`   Average Score: ${avgScore.toFixed(1)}%`);
    console.log(`   Best Repository: ${bestRepo.repository} (${bestRepo.score}%)`);
    console.log(`   Needs Most Work: ${worstRepo.repository} (${worstRepo.score}%)`);
  }
}

// Example usage
const repositoriesToCompare = [
  'facebook/react',
  'microsoft/vscode',
  'nodejs/node',
  'tensorflow/tensorflow',
  'vuejs/vue'
];

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const comparator = new RepositoryComparator(token);
  
  await comparator.compareRepositories(repositoriesToCompare);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { RepositoryComparator };
