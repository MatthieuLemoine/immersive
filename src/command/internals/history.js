export const command = 'history clear';
export const description = 'Clear history';
export const action = ({ history, logger }) => {
  history.clearHistory();
  logger.info('Commands history cleared');
};
