const { setCurrentEnvironment } = require('../../environment');

const command = 'env [environment]';
const description = 'Switch environment';
const action = ({ args, immersiveConfig }) =>
  setCurrentEnvironment(args._[0], immersiveConfig);

module.exports = {
  command,
  description,
  action,
};
