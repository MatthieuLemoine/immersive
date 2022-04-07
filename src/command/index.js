import {
  compose,
  slice,
  head,
  split,
  flatten,
  entries,
  values,
  reduce,
  join,
} from 'conductor';
import parse from 'yargs-parser';
import requireDir from 'require-dir';
import { parseCommand } from '../utils';
import eventHub, { ON_COMMAND_END } from '../event-hub';
import { getCurrentEnvironment, helpersMap } from '../environment';
import internalCommands from './internals';
import logger from '../logger';
import * as history from '../history';
import { getConfig } from '../config';

let commandsMap = {};
let commands;

export const getCommands = () => commandsMap;

export const runCommand = async (command, internal) => {
  const parsed = parse(command, { configuration: { 'parse-numbers': false } });
  let found;
  let index = 0;
  for (; index < parsed._.length; index += 1) {
    found = commandsMap[parsed._.slice(0, index + 1).join(' ')];
    if (found) {
      break;
    }
  }
  try {
    if (!found) {
      await commandsMap.help.action(parsed, command);
    } else {
      const result = await found.action(
        {
          ...parsed,
          // Remove command from args
          _: parsed._.slice(index + 1),
        },
        command,
      );
      if (!internal) {
        return result;
      }
    }
  } catch (e) {
    if (!internal) {
      throw e;
    }
    logger.error('Error while executing command', command);
    logger.error(e.stack);
  }
  if (internal) {
    eventHub.emit(ON_COMMAND_END);
  }
  return null;
};

const getCommandKey = compose(
  head,
  slice(-1, Infinity),
  split('.'),
);

const getAccKey = compose(
  join('.'),
  slice(0, -1),
  split('.'),
);

const parseCommands = compose(
  values,
  reduce((acc, [key, item]) => {
    const accKey = getAccKey(key);
    const commandKey = getCommandKey(key);
    return {
      ...acc,
      [accKey]: {
        ...acc[accKey],
        [commandKey]: item,
      },
    };
  }, {}),
  entries,
  flatten,
);

const wrapCommand = (action, config) => (argv, command) => {
  const env = getCurrentEnvironment();
  return action({
    args: argv,
    commands,
    ...getHelpers(env),
    logger,
    command,
    history,
    runCommand,
    immersiveConfig: config,
    config: getConfig(),
    env: env ? env.name : null,
    envConfig: env,
  });
};

export const loadCommands = ({ commandsDirectory, ...config }) => {
  const customCommands = parseCommands(
    requireDir(commandsDirectory, { recurse: true }),
  );
  commands = [
    ...customCommands,
    ...internalCommands.slice(config.withEnvironment ? 0 : 1),
  ].map(item => ({
    ...item,
    ...parseCommand(item.command),
    action: wrapCommand(item.action, config),
  }));
  commandsMap = commands.reduce(
    (acc, item) => ({
      ...acc,
      [item.cmd]: item,
    }),
    {},
  );
};

function getHelpers(env) {
  if (env && env.name) {
    return helpersMap[env.name];
  }
  return helpersMap;
}
