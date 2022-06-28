const { getConfig } = require('../config');
const { ON_COMMAND, eventHub } = require('../event-hub');

let historyIndex = 0;

const addEntry = command => {
  const config = getConfig();
  const currentHistory = config.get('history', []);
  const lastEntry = currentHistory[currentHistory.length - 1];
  if (lastEntry !== command) {
    config.set('history', [...currentHistory, command]);
  }
};

// On press up
const getPreviousEntry = () => {
  const config = getConfig();
  const currentHistory = config.get('history', []);
  historyIndex =
    historyIndex >= currentHistory.length
      ? currentHistory.length
      : historyIndex + 1;
  return currentHistory[currentHistory.length - historyIndex];
};

// On press down
const getNextEntry = () => {
  const config = getConfig();
  const currentHistory = config.get('history', []);
  historyIndex -= 1;
  if (historyIndex < 0) {
    historyIndex = 0;
    return '';
  }
  return currentHistory[currentHistory.length - historyIndex];
};

const clearHistory = () => {
  const config = getConfig();
  config.set('history', []);
};

eventHub.on(ON_COMMAND, command => {
  historyIndex = 0;
  addEntry(command);
});

module.exports = {
  addEntry,
  getPreviousEntry,
  getNextEntry,
  clearHistory,
};
