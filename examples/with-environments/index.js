const path = require('path');
const immersive = require('../../');
const db = require('./helpers/db');

const config = {
  // Application name used for config persistence (required)
  projectName: 'environments',
  // Will be displayed on CLI start (optional - default to displayName)
  displayName: 'Environments',
  // Path to the directory where commands are defined (required)
  commandsDirectory: path.join(__dirname, 'commands'),
  // Will be accessible from commands as argument
  helpers: {
    db,
  },
  // Configuration will be passed to helpers based on the current environment
  environments: {
    development: { database: 'devdb' },
    staging: { database: 'stagingdb' },
    production: { database: 'proddb' },
  },
  // Define the current environment on CLI start
  // The current environment can be changed using the `env <envName>` command
  defaultEnvironment: 'development',
  // Default cli config
  defaultConfig: {
    // Displayed in prompt
    user: 'john',
    // Displayed in prompt
    symbol: '>',
    colors: {
      prompt: 'green',
    },
  },
};

immersive(config);
