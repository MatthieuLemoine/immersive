import {
  compose, entries, reduce, map,
} from 'conductor';

let environment;
let environments;

const inject = conf => compose(
  reduce((acc, [key, module]) => ({ ...acc, [key]: module(conf) }), {}),
  entries,
);

export const injectEnvironment = (config, helpers) => {
  if (config.withEnvironment) {
    return compose(
      reduce(
        (acc, [env, conf]) => ({
          ...acc,
          [env]: inject(conf)(helpers),
        }),
        {},
      ),
      entries,
    )(config.environments);
  }
  return inject({})(helpers);
};

export const getCurrentEnvironment = () => environment;
export const loadEnvironments = (config) => {
  environments = map(
    (env, key) => ({ ...env, name: key }),
    config.environments,
  );
  return environments;
};
export const setCurrentEnvironment = (name) => {
  environment = environments[name];
};
