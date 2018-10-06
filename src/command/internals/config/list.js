import { omit } from 'ramda';

export const command = 'config list';
export const description = 'Display configuration';

export const action = ({ config, logger }) => {
  logger.log(omit(['history'], config.store));
};
