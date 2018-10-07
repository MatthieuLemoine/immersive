import path from 'path';
import immersive from '../..';
import db from './helpers/db';

const config = {
  // Application name used for config persistence (required)
  projectName: 'esm',
  // Will be displayed on CLI start (optional - default to displayName)
  displayName: 'ESM',
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
    user: 'esm',
    // Displayed in prompt
    symbol: '>',
    colors: {
      prompt: 'green',
    },
  },
};

immersive(config);
