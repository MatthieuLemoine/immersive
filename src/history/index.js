import { getConfig } from '../config';
import eventHub, { ON_COMMAND } from '../event-hub';

let historyIndex = 0;

export const addEntry = (command) => {
  const config = getConfig();
  const currentHistory = config.get('history', []);
  const lastEntry = currentHistory[currentHistory.length - 1];
  if (lastEntry !== command) {
    config.set('history', [...currentHistory, command]);
  }
};

// On press up
export const getPreviousEntry = () => {
  const config = getConfig();
  const currentHistory = config.get('history', []);
  historyIndex = historyIndex >= currentHistory.length ? currentHistory.length : historyIndex + 1;
  return currentHistory[currentHistory.length - historyIndex];
};

// On press down
export const getNextEntry = () => {
  const config = getConfig();
  const currentHistory = config.get('history', []);
  historyIndex -= 1;
  if (historyIndex < 0) {
    historyIndex = 0;
    return '';
  }
  return currentHistory[currentHistory.length - historyIndex];
};

export const clearHistory = () => {
  const config = getConfig();
  config.set('history', []);
};

eventHub.on(ON_COMMAND, (command) => {
  historyIndex = 0;
  addEntry(command);
});
