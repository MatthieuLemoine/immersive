const path = require('path');
const { immersive } = require('../../');
const db = require('./helpers/db');

const config = {
  // A name that will be displayed on CLI start
  name: 'Basic',
  // Path to the directory where we cant to define our commands
  commandsDirectory: path.join(__dirname, 'commands'),
  // Will be accessible from commands as argument
  helpers: {
    db,
  },
};

immersive(config);
