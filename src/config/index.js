const Conf = require('conf');

let config;

const getConfig = () => config;

const loadConfig = ({
  defaults = {
    user: 'immersive',
    symbol: '>',
    colors: {
      prompt: 'yellow',
    },
  },
  projectName,
}) => {
  config = new Conf({
    defaults,
    projectName,
  });
  return config;
};

module.exports = {
  getConfig,
  loadConfig,
};
