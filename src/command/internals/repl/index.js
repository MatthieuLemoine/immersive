import repl from 'repl';
import defaultEval from './eval';

export const command = 'repl';
export const description = 'Lauch a REPL session in a command context';

const awaitEval = (cmd, context, filename, callback) => defaultEval(cmd, context, filename, async (error, result) => callback(error, await result));

const setupReplServer = (context, customEval) => new Promise((resolve) => {
  const replServer = repl.start({
    prompt: '> ',
    eval: customEval,
  });
    // Read-only variables
  Object.entries(context).forEach(([key, value]) => Object.defineProperty(replServer.context, key, {
    configurable: false,
    enumerable: true,
    value,
  }));
  replServer.on('exit', resolve);
});

export const action = context => setupReplServer(context, awaitEval);

export default setupReplServer;
