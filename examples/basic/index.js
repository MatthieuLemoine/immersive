const path = require('path');
const { immersive } = require('../../');
const db = require('./helpers/db');

const config = {
  // A name that will be displayed on CLI start
  name: 'Basic',
  // Path to the directory where commands are defined (required)
  commandsDirectory: path.join(__dirname, 'commands'),
  // Will be accessible from commands as argument
  helpers: {
    db,
  },
};

immersive(config);
