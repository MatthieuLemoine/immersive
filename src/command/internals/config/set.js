import chalk from 'chalk';

export const command = 'config set <key> <value>';
export const description = 'Update config';

export const action = ({ args, config, logger }) => {
  const [key, value] = args._;
  if (key === 'colors.prompt' && !chalk[value]) {
    logger.error('Color not supported by chalk');
    return;
  }
  config.set(key, value);
  logger.info('Updated');
};
