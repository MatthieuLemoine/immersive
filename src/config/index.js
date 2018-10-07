import Conf from 'conf';

let config;

export const getConfig = () => config;

export const loadConfig = ({
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
