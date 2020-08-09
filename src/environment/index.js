import {
  compose, entries, reduce, map,
} from 'conductor';

let environment;
let environments;
export const helpersMap = {};

const inject = conf => compose(
  reduce((acc, [key, module]) => ({ ...acc, [key]: module(conf) }), {}),
  entries,
);

export const getCurrentEnvironment = () => environment;
export const loadEnvironments = (config) => {
  environments = map(
    (env, key) => ({ ...env, name: key }),
    config.environments,
  );
  return environments;
};
export const setCurrentEnvironment = (name, config) => {
  environment = environments[name];
  if (!helpersMap[name]) {
    helpersMap[name] = inject(environment)(config.helpers);
  }
};
