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
/* eslint-disable no-param-reassign */
import { parse } from 'acorn';
import * as walk from 'acorn-walk';

const noop = () => {};
const visitorsWithoutAncestors = {
  ClassDeclaration(node, state, c) {
    if (state.ancestors[state.ancestors.length - 2] === state.body) {
      state.prepend(node, `${node.id.name}=`);
    }
    walk.base.ClassDeclaration(node, state, c);
  },
  FunctionDeclaration(node, state) {
    state.prepend(node, `${node.id.name}=`);
  },
  FunctionExpression: noop,
  ArrowFunctionExpression: noop,
  MethodDefinition: noop,
  AwaitExpression(node, state, c) {
    state.containsAwait = true;
    walk.base.AwaitExpression(node, state, c);
  },
  ReturnStatement(node, state, c) {
    state.containsReturn = true;
    walk.base.ReturnStatement(node, state, c);
  },
  VariableDeclaration(node, state, c) {
    if (
      node.kind === 'var'
      || state.ancestors[state.ancestors.length - 2] === state.body
    ) {
      if (node.declarations.length === 1) {
        state.replace(node.start, node.start + node.kind.length, 'void');
      } else {
        state.replace(node.start, node.start + node.kind.length, 'void (');
      }
      node.declarations.forEach((decl) => {
        state.prepend(decl, '(');
        state.append(decl, decl.init ? ')' : '=undefined)');
      });

      if (node.declarations.length !== 1) {
        state.append(node.declarations[node.declarations.length - 1], ')');
      }
    }

    walk.base.VariableDeclaration(node, state, c);
  },
};

const visitors = {};
Object.keys(walk.base).forEach((nodeType) => {
  const callback = visitorsWithoutAncestors[nodeType] || walk.base[nodeType];
  visitors[nodeType] = (node, state, c) => {
    const isNew = node !== state.ancestors[state.ancestors.length - 1];
    if (isNew) {
      state.ancestors.push(node);
    }
    callback(node, state, c);
    if (isNew) {
      state.ancestors.pop();
    }
  };
});

function processTopLevelAwait(src) {
  const wrapped = `(async () => { ${src} })()`;
  const wrappedArray = wrapped.split('');
  let root;
  try {
    root = parse(wrapped, { ecmaVersion: 10 });
  } catch (err) {
    return null;
  }
  const { body } = root.body[0].expression.callee;
  const state = {
    body,
    ancestors: [],
    replace(from, to, str) {
      for (let i = from; i < to; i += 1) {
        wrappedArray[i] = '';
      }
      if (from === to) str += wrappedArray[from];
      wrappedArray[from] = str;
    },
    prepend(node, str) {
      wrappedArray[node.start] = str + wrappedArray[node.start];
    },
    append(node, str) {
      wrappedArray[node.end - 1] += str;
    },
    containsAwait: false,
    containsReturn: false,
  };

  walk.recursive(body, state, visitors);

  // Do not transform if
  // 1. False alarm: there isn't actually an await expression.
  // 2. There is a top-level return, which is not allowed.
  if (!state.containsAwait || state.containsReturn) {
    return null;
  }

  const last = body.body[body.body.length - 1];
  if (last.type === 'ExpressionStatement') {
    // For an expression statement of the form
    // ( expr ) ;
    // ^^^^^^^^^^   // last
    //   ^^^^       // last.expression
    //
    // We do not want the left parenthesis before the `return` keyword;
    // therefore we prepend the `return (` to `last`.
    //
    // On the other hand, we do not want the right parenthesis after the
    // semicolon. Since there can only be more right parentheses between
    // last.expression.end and the semicolon, appending one more to
    // last.expression should be fine.
    state.prepend(last, 'return (');
    state.append(last.expression, ')');
  }

  return wrappedArray.join('');
}

export default processTopLevelAwait;
