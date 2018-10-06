const { parseCommand } = require('../../src/utils');

describe('parseCommand', () => {
  it('should parse simple commands', () => {
    const command = 'help';
    const parsed = parseCommand(command);
    expect(parsed.cmd).toEqual('help');
  });
  it('should parse commands with arguments', () => {
    const command = 'get <id>';
    const parsed = parseCommand(command);
    expect(parsed.cmd).toEqual('get');
  });
  it('should parse subcommands', () => {
    const command = 'config list';
    const parsed = parseCommand(command);
    expect(parsed.cmd).toEqual('config list');
  });
  it('should parse subcommands with arguments', () => {
    const command = 'config set <key> <value>';
    const parsed = parseCommand(command);
    expect(parsed.cmd).toEqual('config set');
  });
});
