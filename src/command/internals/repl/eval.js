// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.
/* eslint-disable no-param-reassign, no-continue, no-constant-condition */
const vm = require('vm');
const { inherits } = require('util');
const processTopLevelAwait = require('./await');
const isRecoverableError = require('./recoverable');

const savedRegExMatches = ['', '', '', '', '', '', '', '', '', ''];
const sep = '\u0000\u0000\u0000';
const regExMatcher = new RegExp(
  `^${sep}(.*)${sep}(.*)${sep}(.*)${sep}(.*)` +
    `${sep}(.*)${sep}(.*)${sep}(.*)${sep}(.*)` +
    `${sep}(.*)$`,
);

function Recoverable(err) {
  this.err = err;
}
inherits(Recoverable, SyntaxError);

module.exports = (code, context, file, cb) => {
  let err;
  let result;
  let script;
  let wrappedErr;
  let wrappedCmd = false;
  let awaitPromise = false;
  const input = code;

  if (/^\s*\{/.test(code) && /\}\s*$/.test(code)) {
    // It's confusing for `{ a : 1 }` to be interpreted as a block
    // statement rather than an object literal.  So, we first try
    // to wrap it in parentheses, so that it will be interpreted as
    // an expression.  Note that if the above condition changes,
    // lib/internal/repl/recoverable.js needs to be changed to match.
    code = `(${code.trim()})\n`;
    wrappedCmd = true;
  }

  if (code.includes('await')) {
    const potentialWrappedCode = processTopLevelAwait(code);
    if (potentialWrappedCode !== null) {
      code = potentialWrappedCode;
      wrappedCmd = true;
      awaitPromise = true;
    }
  }

  // First, create the Script object to check the syntax
  if (code === '\n') {
    cb(null);
    return;
  }

  while (true) {
    try {
      script = vm.createScript(code, {
        filename: file,
        displayErrors: true,
      });
    } catch (e) {
      if (wrappedCmd) {
        // Unwrap and try again
        wrappedCmd = false;
        awaitPromise = false;
        code = input;
        wrappedErr = e;
        continue;
      }
      // Preserve original error for wrapped command
      const error = wrappedErr || e;
      if (isRecoverableError(error, code)) err = new Recoverable(error);
      else err = error;
    }
    break;
  }

  // This will set the values from `savedRegExMatches` to corresponding
  // predefined RegExp properties `RegExp.$1`, `RegExp.$2` ... `RegExp.$9`
  regExMatcher.test(savedRegExMatches.join(sep));

  let finished = false;
  function finishExecution(error, data) {
    if (finished) return;
    finished = true;

    // After executing the current expression, store the values of RegExp
    // predefined properties back in `savedRegExMatches`
    for (let idx = 1; idx < savedRegExMatches.length; idx += 1) {
      savedRegExMatches[idx] = RegExp[`$${idx}`];
    }

    cb(error, data);
  }

  if (!err) {
    try {
      const scriptOptions = {
        displayErrors: false,
        breakOnSigint: false,
      };
      result = script.runInContext(context, scriptOptions);
    } catch (e) {
      err = e;
      if (process.domain) {
        process.domain.emit('error', err);
        process.domain.exit();
        return;
      }
    }

    if (awaitPromise && !err) {
      const promise = result;

      promise.then(
        data => {
          finishExecution(undefined, data);
        },
        error => {
          if (err && process.domain) {
            process.domain.emit('error', error);
            process.domain.exit();
            return;
          }
          finishExecution(error);
        },
      );
    }
  }

  if (!awaitPromise || err) {
    finishExecution(err, result);
  }
};
