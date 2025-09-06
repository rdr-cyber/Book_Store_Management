#!/usr/bin/env node

/**
 * Deployment Health Check Script
 * Validates the application is ready for deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Running Deployment Health Check...\n');

const checks = [
  {
    name: 'Package.json exists',
    check: () => fs.existsSync('package.json'),
    fix: 'Ensure package.json is in the root directory'
  },
  {
    name: 'Next.js config exists',
    check: () => fs.existsSync('next.config.ts') || fs.existsSync('next.config.js'),
    fix: 'Create next.config.ts file'
  },
  {
    name: 'TypeScript config exists',
    check: () => fs.existsSync('tsconfig.json'),
    fix: 'Create tsconfig.json file'
  },
  {
    name: 'Source directory exists',
    check: () => fs.existsSync('src'),
    fix: 'Ensure src directory exists with app files'
  },
  {
    name: 'App directory exists',
    check: () => fs.existsSync('src/app'),
    fix: 'Ensure src/app directory exists'
  },
  {
    name: 'Environment example exists',
    check: () => fs.existsSync('.env.example'),
    fix: 'Create .env.example file'
  }
];

let passed = 0;
let failed = 0;

checks.forEach(({ name, check, fix }) => {
  const result = check();
  if (result) {
    console.log(`✅ ${name}`);
    passed++;
  } else {
    console.log(`❌ ${name} - ${fix}`);
    failed++;
  }
});

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('🎉 All checks passed! Application is ready for deployment.\n');
  
  console.log('🌐 Deployment Options:');
  console.log('1. Vercel: https://vercel.com/new/clone?repository-url=https://github.com/rdr-cyber/Book_Store_Management');
  console.log('2. Netlify: https://app.netlify.com/start/deploy?repository=https://github.com/rdr-cyber/Book_Store_Management');
  console.log('3. Railway: https://railway.app/new/template');
  
  process.exit(0);
} else {
  console.log('⚠️  Please fix the failed checks before deployment.');
  process.exit(1);
}