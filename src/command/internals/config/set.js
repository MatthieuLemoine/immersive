const chalk = require('chalk');

const command = 'config set <key> <value>';
const description = 'Update config';

const action = ({ args, config, logger }) => {
  const [key, value] = args._;
  if (key === 'colors.prompt' && !chalk[value]) {
    logger.error('Color not supported by chalk');
    return;
  }
  config.set(key, value);
  logger.info('Updated');
};

module.exports = {
  command,
  description,
  action,
};
