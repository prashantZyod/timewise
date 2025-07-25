/**
 * Helper script for Heroku deployment of TimeWise app
 * This script handles necessary environment setup for Heroku
 */
const fs = require('fs');
const path = require('path');

// Check if running in Heroku environment
const isHeroku = process.env.NODE_ENV === 'production' && process.env.DYNO;

if (isHeroku) {
  console.log('Detected Heroku environment, applying configuration...');
  
  // Create a static.json file if it doesn't exist (for SPA routing)
  const staticConfigPath = path.join(__dirname, 'static.json');
  if (!fs.existsSync(staticConfigPath)) {
    const staticConfig = {
      "root": "build/",
      "routes": {
        "/**": "index.html"
      }
    };
    
    fs.writeFileSync(staticConfigPath, JSON.stringify(staticConfig, null, 2));
    console.log('Created static.json for SPA routing on Heroku');
  }
  
  // Add any other Heroku-specific setup here
  console.log('Heroku configuration completed');
}
