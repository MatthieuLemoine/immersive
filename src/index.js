const figlet = require('figlet');
const { compose, converge, isNil, isEmpty, or, not } = require('ramda');
const { loadConfig } = require('./config');
const { writeLine, prompt } = require('./prompt');
const { runCommand, loadCommands } = require('./command');
const { ON_COMMAND, ON_COMMAND_END, eventHub } = require('./event-hub');
const { setCurrentEnvironment, loadEnvironments } = require('./environment');
const { mergeExport: merge } = require('./utils');
const { setupReplServer } = require('./command/internals/repl');

const isNotEmptyOrNil = compose(
  not,
  converge(or, [isNil, isEmpty]),
);

async function immersive(userConfig = {}) {
  const {
    environments,
    defaultEnvironment,
    projectName,
    displayName,
    disableBanner = false,
  } = userConfig;
  if (!projectName) {
    throw new Error('projectName is required in immersive options.');
  }
  const withEnvironment = isNotEmptyOrNil(environments);
  const config = { ...userConfig, withEnvironment };
  if (!disableBanner) {
    writeLine(figlet.textSync(displayName || projectName));
  }
  loadConfig({
    defaults: isNotEmptyOrNil(config.defaultConfig)
      ? config.defaultConfig
      : undefined,
    projectName,
  });
  if (withEnvironment) {
    config.environments = loadEnvironments(config);
    await setCurrentEnvironment(
      defaultEnvironment || Object.keys(environments)[0],
      config,
    );
  }
  loadCommands(config);
  eventHub.on(ON_COMMAND, command => runCommand(command, true));
  eventHub.on(ON_COMMAND_END, () => prompt());
  prompt();
}

module.exports = {
  immersive,
  repl: setupReplServer,
  mergeExport: merge,
};
