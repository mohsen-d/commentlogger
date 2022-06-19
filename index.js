module.exports.watch = function watch(moduleContent) {
  const content = moduleContent.toString();
  const loggedContent = insertLogsInto(content);
  return eval(loggedContent)();
};

module.exports.setLoggingFunction = function setLoggingFunction(func) {
  loggingFunction = func;
};

let loggingFunction = (variable) => console.log(variable);

function insertLogsInto(content) {
  const logComments = getLogCommentsFrom(content);

  for (const logComment of logComments) {
    if (currentENVExistsIn(logComment.environments)) {
      content = addTheLoggingCode(content, logComment);
    }
  }
  return "(function(){ return(" + content + ")})";
}

function getLogCommentsFrom(content) {
  const logComments = [];
  const regex = /(?:\/\/)(?:\s*)log(?:\s*)\(([^\)]*)(?:\))?/g;
  const matches = [...content.matchAll(regex)];
  for (const match of matches) {
    const [variable, ...envs] = match[1].split(",").map((p) => p.trim());
    logComments.push({
      fullComment: match[0],
      variableToLog: variable,
      environments: envs,
    });
  }
  return logComments;
}

function currentENVExistsIn(envs) {
  if (envs.length == 0 || envs.some((e) => e == process.env.NODE_ENV))
    return true;
}

function addTheLoggingCode(content, logComment) {
  const loggingCode = buildTheLoggingCode(logComment.variableToLog);
  if (!loggingCode) return content;
  return content.replace(logComment.fullComment, loggingCode);
}

function buildTheLoggingCode(variable) {
  const functionBodyStr = loggingFunction.toString().trim();

  if (functionBodyStr == "") return undefined;

  let functionBody = getLoggingFunctionBody(functionBodyStr);
  let param = getLoggingFunctionParam(functionBodyStr);

  if (param) {
    const t = "\\b" + param + "\\b";
    const replacingRegex = new RegExp(t, "g");

    functionBody = functionBody.replace(replacingRegex, variable);
  }

  return functionBody;
}

function getLoggingFunctionBody(functionBodyStr) {
  const functionBodyRegex = /(?:{|(?:>\s*{)|>)(([\s|\S]*)(?=[\}|\n]))/gm;

  if (!functionBodyStr.endsWith("}")) functionBodyStr += "\n";

  const matches = [...functionBodyStr.matchAll(functionBodyRegex)];
  return matches[0][2];
}

function getLoggingFunctionParam(functionBodyStr) {
  const paramRegex = /(?<=\(*\s*)(\b[\w]*\b)(?=\s*\)*\s*[=|{])/;
  if (paramRegex.test(functionBodyStr)) {
    const matches = [...functionBodyStr.match(paramRegex)];
    return matches[1];
  }
  return undefined;
}
