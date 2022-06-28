const { omit } = require('ramda');

const command = 'config list';
const description = 'Display configuration';

const action = ({ config, logger }) => {
  logger.log(omit(['history'], config.store));
};

module.exports = {
  command,
  description,
  action,
};
