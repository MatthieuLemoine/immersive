const { map } = require('conductor');

let environment;
let environments;
const helpersMap = {};

const inject = async (conf, helpers) => {
  const acc = {};
  for (const [helperName, getHelper] of Object.entries(helpers)) {
    acc[helperName] = await getHelper(conf);
  }
  return acc;
};

const getCurrentEnvironment = () => environment;
const loadEnvironments = config => {
  environments = map(
    (env, key) => ({ ...env, name: key }),
    config.environments,
  );
  return environments;
};
const setCurrentEnvironment = async (name, config) => {
  environment = environments[name];
  if (!helpersMap[name]) {
    helpersMap[name] = await inject(environment, config.helpers);
  }
};

module.exports = {
  helpersMap,
  getCurrentEnvironment,
  loadEnvironments,
  setCurrentEnvironment,
};
