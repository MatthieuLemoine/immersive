import Conf from 'conf';

const config = new Conf();

export const setDefaults = (
  defaults = {
    user: 'immersive',
    symbol: '>',
    colors: {
      prompt: 'yellow',
    },
  },
) => {
  Object.entries(defaults).forEach(([key, value]) => {
    if (!config.has(key)) {
      config.set(key, value);
    }
  });
};

export default config;
