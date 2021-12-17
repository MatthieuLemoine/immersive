import figlet from 'figlet';
import {
  compose, converge, isNil, isEmpty, or, not,
} from 'ramda';
import { loadConfig } from './config';
import { writeLine, prompt } from './prompt';
import { runCommand, loadCommands } from './command';
import eventHub, { ON_COMMAND, ON_COMMAND_END } from './event-hub';
import { setCurrentEnvironment, loadEnvironments } from './environment';
import { mergeExport as merge } from './utils';
import setupRepl from './command/internals/repl';

const isNotEmptyOrNil = compose(
  not,
  converge(or, [isNil, isEmpty]),
);

function immersive(userConfig = {}) {
  const {
    environments,
    defaultEnvironment,
    projectName,
    displayName,
  } = userConfig;
  if (!projectName) {
    throw new Error('projectName is required in immersive options.');
  }
  const withEnvironment = isNotEmptyOrNil(environments);
  const config = { ...userConfig, withEnvironment };
  writeLine(figlet.textSync(displayName || projectName));
  loadConfig({
    defaults: isNotEmptyOrNil(config.defaultConfig)
      ? config.defaultConfig
      : undefined,
    projectName,
  });
  if (withEnvironment) {
    config.environments = loadEnvironments(config);
    setCurrentEnvironment(
      defaultEnvironment || Object.keys(environments)[0],
      config,
    );
  }
  loadCommands(config);
  eventHub.on(ON_COMMAND, command => runCommand(command, true));
  eventHub.on(ON_COMMAND_END, () => prompt());
  prompt();
}

export const repl = setupRepl;
export const mergeExport = merge;
export default immersive;
