const repl = require('repl');
const defaultEval = require('./eval');
const envPaths = require('env-paths');
const path = require('path');

const command = 'repl';
const description = 'Lauch a REPL session in a command context';

const awaitEval = (cmd, context, filename, callback) =>
  defaultEval(cmd, context, filename, async (error, result) =>
    callback(error, await result),
  );

const setupReplServer = (context, customEval) =>
  new Promise(resolve => {
    const replServer = repl.start({
      prompt: '> ',
      eval: customEval,
    });
    // Read-only variables
    Object.entries(context).forEach(([key, value]) =>
      Object.defineProperty(replServer.context, key, {
        configurable: false,
        enumerable: true,
        value,
      }),
    );
    replServer.on('exit', resolve);
    // Setup history
    const paths = envPaths(context.immersiveConfig.projectName);
    const historyFilePath = path.join(paths.config, '.repl-history');
    replServer.setupHistory(historyFilePath, err => {
      if (err) {
        context.logger.error(err);
      }
    });
  });

const action = context => setupReplServer(context, awaitEval);

module.exports = {
  command,
  description,
  action,
  setupReplServer,
};
