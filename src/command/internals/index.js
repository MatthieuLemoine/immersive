const env = require('./env');
const repl = require('./repl');
const configList = require('./config/list');
const configGet = require('./config/get');
const configSet = require('./config/set');
const history = require('./history');
const exit = require('./exit');
const help = require('./help');

module.exports = [
  env,
  repl,
  configList,
  configSet,
  configGet,
  history,
  exit,
  help,
];
