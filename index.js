module.exports.watch = function watch(
  moduleContent,
  loggingFunction = undefined
) {
  setLoggingFunction(loggingFunction);
  const content = cleanModuleContent(moduleContent);
  const loggedContent = insertLogsInto(content);
  return eval(loggedContent)();
};

function setLoggingFunction(func) {
  this.commentloggerFunc = func ? func : (msg) => console.log(msg);
}

function cleanModuleContent(moduleContent) {
  let content = moduleContent.toString();
  content = content.replace("() => {", "");
  content = content.substring(0, content.lastIndexOf("}"));
  return content;
}

function insertLogsInto(content) {
  const logComments = getLogCommentsFrom(content);

  for (const logComment of logComments) {
    if (currentENVExistsIn(logComment.environments)) {
      content = addTheLoggingCode(content, logComment);
    }
  }

  return "() => {return function(){" + content + "}}";
}

function getLogCommentsFrom(content) {
  const logComments = [];
  const regex = /(?:\/\/)(?:\s*)log(?:\s*)\(([^\)]*)(?:\))?/g;
  const matches = [...content.matchAll(regex)];
  for (const match of matches) {
    const [msg, ...envs] = match[1].split(",").map((p) => p.trim());
    logComments.push({
      fullComment: match[0],
      msgToLog: msg,
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
  const loggingCode = buildTheLoggingCode(logComment.msgToLog);
  if (!loggingCode) return content;
  return content.replace(logComment.fullComment, loggingCode);
}

function buildTheLoggingCode(msg) {
  const param = getLoggingFunctionParam();
  if (param) {
    const t = `commentloggerFunc(${msg});`;
    return t;
  } else return "commentloggerFunc();";
}

function getLoggingFunctionParam() {
  const functionBodyStr = this.commentloggerFunc.toString();
  const paramRegex = /(?<=\(*\s*)(\b[\w]*\b)(?=\s*\)*\s*[=|{])/;
  if (paramRegex.test(functionBodyStr)) {
    const matches = [...functionBodyStr.match(paramRegex)];
    return matches[1];
  }
  return undefined;
}
