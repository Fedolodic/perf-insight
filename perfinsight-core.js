const { parse, traverse } = require('@babel/core');
const generate = require('@babel/generator').default;
const path = require('path');

function hasPerformanceMarkOrMeasure(node) {
  return (
    node.type === 'ExpressionStatement' &&
    node.expression.type === 'CallExpression' &&
    node.expression.callee.object &&
    node.expression.callee.object.name === 'performance' &&
    (node.expression.callee.property.name === 'mark' ||
      node.expression.callee.property.name === 'measure')
  );
}

function addPerformanceMarks(code, filename, ignoreFiles = []) {
  if (ignoreFiles.some((ignorePattern) => filename.includes(ignorePattern))) {
    return code;
  }

  const fileBasename = path.basename(filename, '.js');
  const ast = parse(code, { sourceType: 'module' });
  const functionNameRegex = /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*/;

  function addMarksAndMeasuresToFunction(path, functionName) {
    const markStart = `performance.mark('${fileBasename}.${functionName}');\n`;
    const measureEnd = `performance.measure('${fileBasename} - ${functionName} duration', '${fileBasename}.${functionName}');\n`;

    const hasMarkOrMeasure = path.node.body.body.some(hasPerformanceMarkOrMeasure);

    if (!hasMarkOrMeasure) {
      path.node.body.body.unshift(parse(markStart, { sourceType: 'module' }).program.body[0]);

      const returnStatementIndex = path.node.body.body.findIndex((node) => node.type === 'ReturnStatement');
      if (returnStatementIndex >= 0) {
        path.node.body.body.splice(returnStatementIndex, 0, parse(measureEnd, { sourceType: 'module' }).program.body[0]);
      } else {
        path.node.body.body.push(parse(measureEnd, { sourceType: 'module' }).program.body[0]);
      }
    }
  }

  traverse(ast, {
    FunctionDeclaration(path) {
      const functionName = path.node.id.name;
      addMarksAndMeasuresToFunction(path, functionName);
    },

    ArrowFunctionExpression(path) {
      if (path.parent.type === 'VariableDeclarator' && functionNameRegex.test(path.parent.id.name)) {
        const functionName = path.parent.id.name;
        addMarksAndMeasuresToFunction(path, functionName);
      }
    },

    CallExpression(path) {
      if (
        path.node.callee.name === 'setTimeout' ||
        path.node.callee.name === 'setInterval'
      ) {
        const callback = path.node.arguments[0];

        if (callback.type === 'ArrowFunctionExpression') {
          const functionName = 'anonymous';
          addMarksAndMeasuresToFunction(callback, functionName);
        } else if (
          callback.type === 'Identifier' &&
          functionNameRegex.test(callback.name)
        ) {
          const functionName = callback.name;
          const markStart = `performance.mark('${fileBasename}.${functionName}');\n`;
          const measureEnd = `performance.measure('${fileBasename} - ${functionName} duration', '${fileBasename}.${functionName}');\n`;

          const wrappedCallback = parse(
            `(${functionName}) => {${markStart}${functionName}();${measureEnd}}`
          ).expression;

          path.node.arguments[0] = wrappedCallback;
        }
      }
    },
  });

  const updatedCode = generate(ast).code;
  return updatedCode;
}

function removePerformanceMarks(code) {
  const ast = parse(code, { sourceType: 'module' });

  traverse(ast, {
    enter(path) {
      if (hasPerformanceMarkOrMeasure(path.node)) {
        path.remove();
      }
    },
  });

  return generate(ast).code;
}

module.exports = {
  addPerformanceMarks,
  removePerformanceMarks,
};