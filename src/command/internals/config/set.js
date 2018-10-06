export const command = 'config set <key> <value>';
export const description = 'Update config';

export const action = ({ args, config, logger }) => {
  const [key, value] = args._;
  config.set(key, value);
  logger.info('Updated');
};
