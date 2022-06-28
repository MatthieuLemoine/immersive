const EventEmitter = require('events');

const ON_COMMAND = 'ON_COMMAND';
const ON_COMMAND_END = 'ON_COMMAND_END';

const eventHub = new EventEmitter();

module.exports = {
  ON_COMMAND,
  ON_COMMAND_END,
  eventHub,
};
