import { map } from 'conductor';

let environment;
let environments;
export const helpersMap = {};

const inject = async (conf, helpers) => {
  const acc = {};
  for (const [helperName, getHelper] of Object.entries(helpers)) {
    acc[helperName] = await getHelper(conf);
  }
  return acc;
};

export const getCurrentEnvironment = () => environment;
export const loadEnvironments = (config) => {
  environments = map(
    (env, key) => ({ ...env, name: key }),
    config.environments,
  );
  return environments;
};
export const setCurrentEnvironment = async (name, config) => {
  environment = environments[name];
  if (!helpersMap[name]) {
    helpersMap[name] = await inject(environment, config.helpers);
  }
};
