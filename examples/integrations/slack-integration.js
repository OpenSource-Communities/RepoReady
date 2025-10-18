#!/usr/bin/env node
// examples/integrations/slack-integration.js

/**
 * Example: Slack Integration
 * 
 * This script evaluates repositories and sends results to Slack
 * using webhooks or the Slack API.
 */

const { exec } = require('child_process');
const util = require('util');
const https = require('https');

const execPromise = util.promisify(exec);

class SlackReporter {
  constructor(webhookUrl, githubToken) {
    this.webhookUrl = webhookUrl;
    this.githubToken = githubToken;
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

  async sendToSlack(message) {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify({ text: message });
      
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': data.length
        }
      };
      
      const req = https.request(this.webhookUrl, options, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          reject(new Error(`Slack API error: ${res.statusCode}`));
        }
      });
      
      req.on('error', reject);
      req.write(data);
      req.end();
    });
  }

  formatSlackMessage(results) {
    const emoji = {
      'Excellent': '🟢',
      'Good': '🟡',
      'Fair': '🟠',
      'Needs Work': '🔴',
      'Not Ready': '⚫'
    };
    
    let message = `*📊 Repository Health Report*\n\n`;
    
    results.forEach(result => {
      const statusEmoji = emoji[result.rating] || '❓';
      message += `${statusEmoji} *${result.repository}*: ${result.score}% (${result.rating})\n`;
    });
    
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;
    message += `\n*Average Score:* ${avgScore.toFixed(1)}%`;
    
    return message;
  }

  async evaluateAndReport(repositories) {
    console.log('🔄 Evaluating repositories for Slack report...\n');
    
    const results = [];
    
    for (const repo of repositories) {
      const [owner, name] = repo.split('/');
      const result = await this.evaluateRepository(owner, name);
      if (result) {
        results.push(result);
      }
      
      // Respect rate limits
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    if (results.length > 0) {
      const message = this.formatSlackMessage(results);
      
      try {
        await this.sendToSlack(message);
        console.log('✅ Results sent to Slack successfully!');
      } catch (error) {
        console.error('❌ Failed to send to Slack:', error.message);
      }
    }
  }
}

// Example usage
const repositories = [
  'facebook/react',
  'microsoft/vscode',
  'nodejs/node'
];

async function main() {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const githubToken = process.env.GITHUB_TOKEN;
  
  if (!webhookUrl) {
    console.error('Please set SLACK_WEBHOOK_URL environment variable');
    process.exit(1);
  }
  
  const reporter = new SlackReporter(webhookUrl, githubToken);
  await reporter.evaluateAndReport(repositories);
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { SlackReporter };
