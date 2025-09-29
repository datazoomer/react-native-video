#!/usr/bin/env node

/**
 * Fix React 19 compatibility issue
 * React 19 doesn't export a default export, so we need to change
 * react_1.default.createElement to react_1.createElement
 */

const fs = require('fs');
const path = require('path');

const libDir = path.join(__dirname, '..', 'lib');
const videoJsPath = path.join(libDir, 'Video.js');

if (fs.existsSync(videoJsPath)) {
  let content = fs.readFileSync(videoJsPath, 'utf8');
  
  // Replace react_1.default.createElement with react_1.createElement
  const originalCount = (content.match(/react_1\.default\.createElement/g) || []).length;
  content = content.replace(/react_1\.default\.createElement/g, 'react_1.createElement');
  
  fs.writeFileSync(videoJsPath, content);
  
  console.log(`✓ Fixed React 19 compatibility: replaced ${originalCount} occurrences of react_1.default.createElement`);
} else {
  console.log('⚠ Video.js not found, skipping React 19 compatibility fix');
}
