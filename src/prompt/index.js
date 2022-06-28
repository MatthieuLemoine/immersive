const { unapply, compose } = require('ramda');
const { join, flip, concat } = require('conductor');
const chalk = require('chalk');
const readline = require('readline');
const { ON_COMMAND, eventHub } = require('../event-hub');
const { getCurrentEnvironment } = require('../environment');
const { getConfig } = require('../config');
const { getNextEntry, getPreviousEntry } = require('../history');
const autocomplete = require('../autocomplete');

const append = flip(concat);
const writer = process.stdout.write.bind(process.stdout);
let rl;
let isInPrompt = false;

process.stdin.on('keypress', (_, event) => {
  if (isInPrompt && event && event.name) {
    if (event.name === 'up') {
      replacePrompt(getPreviousEntry());
    } else if (event.name === 'down') {
      replacePrompt(getNextEntry());
    }
  }
});

const format = unapply(join(' '));

const write = compose(
  writer,
  format,
);

const writeLine = compose(
  write,
  append('\n'),
  format,
);

function prompt() {
  isInPrompt = true;
  rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    completer: autocomplete,
  });
  rl.question(getQuestion(), command => {
    isInPrompt = false;
    rl.pause();
    rl.close();
    if (!command) {
      prompt();
      return;
    }
    eventHub.emit(ON_COMMAND, command);
  });
}

// Utils

function getEnvironment(colors) {
  const env = getCurrentEnvironment();
  if (env && env.name) {
    return chalk[env.name === 'production' ? 'red' : colors.prompt](env.name);
  }
  return '';
}

function replacePrompt(text) {
  if (!text) {
    return;
  }
  const width = rl.line.length;
  rl.line = text;
  const newWidth = rl.line.length;
  const diff = newWidth - width;
  rl.cursor += diff;
  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);
  rl.output.write(getQuestion(rl.line));
}

function getPrefix() {
  const config = getConfig();
  const colors = config.get('colors');
  const user = config.get('user');
  const symbol = config.get('symbol');
  const env = getEnvironment(colors);
  const promptColor = chalk[colors.prompt];
  return `${promptColor(`${user}`)}${
    env ? `${promptColor(':')}${env}` : ''
  } ${chalk[colors.prompt](symbol)}`;
}

function getQuestion(text = '') {
  return `${getPrefix()} ${text}`;
}

module.exports = {
  write,
  writeLine,
  prompt,
};
