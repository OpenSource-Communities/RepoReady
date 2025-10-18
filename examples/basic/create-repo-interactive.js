#!/usr/bin/env node
// examples/basic/create-repo-interactive.js

/**
 * Example: Interactive Repository Creation
 * 
 * This script demonstrates how to create a new repository
 * using RepoReady with interactive prompts.
 */

const { exec } = require('child_process');
const util = require('util');
const readline = require('readline');

const execPromise = util.promisify(exec);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function createRepositoryInteractive() {
  console.log('🚀 Interactive Repository Creation with RepoReady\n');
  
  try {
    // Check if GitHub token is available
    if (!process.env.GITHUB_TOKEN) {
      console.log('⚠️  GITHUB_TOKEN environment variable not set.');
      const token = await askQuestion('Enter your GitHub token: ');
      process.env.GITHUB_TOKEN = token;
    }
    
    const name = await askQuestion('Repository name: ');
    const description = await askQuestion('Repository description: ');
    const isPrivate = await askQuestion('Private repository? (y/N): ');
    
    const privateFlag = isPrivate.toLowerCase() === 'y' ? '--private' : '';
    
    console.log('\n📦 Creating repository...\n');
    
    // Use the built RepoReady CLI
    const command = `node ../../dist/index.js create --token ${process.env.GITHUB_TOKEN} --name "${name}" --description "${description}" ${privateFlag}`;
    
    const { stdout } = await execPromise(command);
    console.log(stdout);
    
    console.log('\n✅ Repository created successfully!');
    console.log('Next steps:');
    console.log('1. Clone your repository');
    console.log('2. Add your code');
    console.log('3. Push to GitHub');
    console.log('4. Run: rr evaluate <your-username>/<repo-name>');
    
  } catch (error) {
    console.error('❌ Error creating repository:', error.message);
  } finally {
    rl.close();
  }
}

// Run if called directly
if (require.main === module) {
  createRepositoryInteractive();
}

module.exports = { createRepositoryInteractive };
