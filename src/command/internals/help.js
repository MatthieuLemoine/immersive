const chalk = require('chalk');

const command = 'help';
const description = 'Display help';
const action = ({ command: cmd, logger, commands }) => {
  // Didn't type help
  if (!cmd.startsWith('help')) {
    logger.error(`Invalid command: ${cmd}`);
  }
  logger.log(
    commands.reduce(
      (message, item) =>
        `${message}\n  • ${chalk.bold(item.command)}: ${item.description}`,
      chalk.green('Available commands:'),
    ),
  );
};

module.exports = {
  command,
  description,
  action,
};
