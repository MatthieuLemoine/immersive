const command = 'config get <key>';
const description = 'Get config value';

const action = ({ args, config, logger }) => {
  const [key] = args._;
  logger.log(config.get(key));
};

module.exports = {
  command,
  description,
  action,
};
