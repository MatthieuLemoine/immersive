import { setCurrentEnvironment } from '../../environment';

export const command = 'env [environment]';
export const description = 'Switch environment';
export const action = ({ args, immersiveConfig }) => setCurrentEnvironment(args._[0], immersiveConfig);
