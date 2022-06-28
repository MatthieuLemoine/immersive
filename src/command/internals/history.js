const command = 'history clear';
const description = 'Clear history';
const action = ({ history, logger }) => {
  history.clearHistory();
  logger.info('Commands history cleared');
};

module.exports = {
  command,
  description,
  action,
};
