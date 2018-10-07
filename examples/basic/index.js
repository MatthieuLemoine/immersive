const path = require('path');
const immersive = require('../../');
const db = require('./helpers/db');

const config = {
  // Application name used for config persistence (required)
  projectName: 'basic',
  // Will be displayed on CLI start (optional - default to displayName)
  displayName: 'Basic',
  // Path to the directory where commands are defined (required)
  commandsDirectory: path.join(__dirname, 'commands'),
  // Will be accessible from commands as argument
  helpers: {
    db,
  },
};

immersive(config);
