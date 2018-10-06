import { setCurrentEnvironment } from '../../environment';

export const command = 'env [environment]';
export const description = 'Switch environment';
export const action = ({ args }) => setCurrentEnvironment(args._[0]);
