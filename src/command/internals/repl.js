import repl from 'repl';
import vm from 'vm';

export const command = 'repl';
export const description = 'Lauch a REPL session in a command context';

const awaitEval = (cmd, context, filename, callback) => {
  const doEval = async () => {
    let code = cmd;
    // Wrap in async function to allow top await usage
    if (cmd.includes('await')) {
      code = `(async () => ${code})();`;
    }
    const script = vm.createScript(code, {
      filename,
      displayErrors: true,
    });
    const result = script.runInContext(context, {
      displayErrors: false,
      breakEvalOnSigint: false,
    });
    callback(null, await result);
  };
  doEval();
};

export const action = context => new Promise((resolve) => {
  const replServer = repl.start({
    prompt: '> ',
    eval: awaitEval,
  });
    // Read-only variables
  Object.entries(context).forEach(([key, value]) => Object.defineProperty(replServer.context, key, {
    configurable: false,
    enumerable: true,
    value,
  }));
  replServer.on('exit', resolve);
});
