import figlet from 'figlet';
import {
  compose, converge, isNil, isEmpty, or, not,
} from 'ramda';
import { setDefaults } from './config';
import { writeLine, prompt } from './prompt';
import { runCommand, loadCommands } from './command';
import eventHub, { ON_COMMAND, ON_COMMAND_END } from './event-hub';
import { setCurrentEnvironment, loadEnvironments } from './environment';

export { mergeExport } from './utils';

const isNotEmptyOrNil = compose(
  not,
  converge(or, [isNil, isEmpty]),
);

export const immersive = (userConfig = {}) => {
  const { environments, defaultEnvironment, name = 'Immersive' } = userConfig;
  const withEnvironment = isNotEmptyOrNil(environments);
  const config = { ...userConfig, withEnvironment };
  writeLine(figlet.textSync(name));
  setDefaults(isNotEmptyOrNil(config.defaultConfig) ? config.defaultConfig : undefined);
  if (withEnvironment) {
    loadEnvironments(config);
    setCurrentEnvironment(defaultEnvironment || Object.keys(environments)[0]);
  }
  loadCommands(config);
  eventHub.on(ON_COMMAND, command => runCommand(command, true));
  eventHub.on(ON_COMMAND_END, () => prompt());
  prompt();
};
