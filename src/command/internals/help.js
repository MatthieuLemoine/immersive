import chalk from 'chalk';

export const command = 'help';
export const description = 'Display help';
export const action = ({ command: cmd, logger, commands }) => {
  // Didn't type help
  if (!cmd.startsWith('help')) {
    logger.error(`Invalid command: ${cmd}`);
  }
  logger.log(
    commands.reduce(
      (message, item) => `${message}\n  • ${chalk.bold(item.command)}: ${item.description}`,
      chalk.green('Available commands:'),
    ),
  );
};
