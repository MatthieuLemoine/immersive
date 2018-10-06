import EventEmitter from 'events';

export const ON_COMMAND = 'ON_COMMAND';
export const ON_COMMAND_END = 'ON_COMMAND_END';

const eventHub = new EventEmitter();

export default eventHub;
