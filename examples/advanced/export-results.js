#!/usr/bin/env node
// examples/advanced/export-results.js

/**
 * Example: Export Evaluation Results
 * 
 * This script demonstrates how to export evaluation results
 * to various formats (JSON, CSV, Markdown).
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

class ResultsExporter {
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
        timestamp: new Date().toISOString(),
        rawOutput: stdout
      };
    } catch (error) {
      console.error(`❌ Error evaluating ${owner}/${repo}:`, error.message);
      return null;
    }
  }

  async evaluateAndExport(repositories) {
    console.log('🔄 Evaluating repositories for export...\n');
    
    for (const repo of repositories) {
      const [owner, name] = repo.split('/');
      const result = await this.evaluateRepository(owner, name);
      if (result) {
        this.results.push(result);
      }
      
      // Respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Export to different formats
    await this.exportToJSON();
    await this.exportToCSV();
    await this.exportToMarkdown();
  }

  async exportToJSON() {
    const outputPath = path.join(__dirname, '..', 'data', 'results.json');
    await fs.writeFile(outputPath, JSON.stringify(this.results, null, 2));
    console.log(`📄 JSON results exported to ${outputPath}`);
  }

  async exportToCSV() {
    const csvHeader = 'Repository,Score,Rating,Timestamp\n';
    const csvRows = this.results.map(r => 
      `"${r.repository}",${r.score},"${r.rating}","${r.timestamp}"`
    ).join('\n');
    
    const outputPath = path.join(__dirname, '..', 'data', 'results.csv');
    await fs.writeFile(outputPath, csvHeader + csvRows);
    console.log(`📄 CSV results exported to ${outputPath}`);
  }

  async exportToMarkdown() {
    const mdContent = `# Repository Evaluation Results

Generated on: ${new Date().toISOString()}

## Summary

| Repository | Score | Rating | Timestamp |
|------------|-------|--------|-----------|
${this.results.map(r => `| ${r.repository} | ${r.score}% | ${r.rating} | ${r.timestamp} |`).join('\n')}

## Detailed Results

${this.results.map(r => `### ${r.repository}

**Score:** ${r.score}%  
**Rating:** ${r.rating}  
**Evaluated:** ${r.timestamp}

\`\`\`
${r.rawOutput}
\`\`\`

---`).join('\n\n')}
`;

    const outputPath = path.join(__dirname, '..', 'data', 'results.md');
    await fs.writeFile(outputPath, mdContent);
    console.log(`📄 Markdown results exported to ${outputPath}`);
  }
}

// Example usage
const repositories = [
  'facebook/react',
  'microsoft/vscode',
  'nodejs/node'
];

async function main() {
  const token = process.env.GITHUB_TOKEN;
  const exporter = new ResultsExporter(token);
  
  await exporter.evaluateAndExport(repositories);
  console.log('\n✅ All exports completed!');
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { ResultsExporter };
