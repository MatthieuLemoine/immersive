export const command = 'config get <key>';
export const description = 'Get config value';

export const action = ({ args, config, logger }) => {
  const [key] = args._;
  logger.log(config.get(key));
};
