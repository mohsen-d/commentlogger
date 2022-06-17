module.exports.watch = function watch(moduleContent) {
  content = moduleContent.toString();
  return eval(insertLogsInto(content))();
};

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
  const regex = /(?:\/\/)(?:\s*)log\(([^\)]*)(?:\))?/g;
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
  if (envs.some((e) => e == process.env.NODE_ENV || e == "all")) return true;
}

function addTheLoggingCode(content, logComment) {
  return content.replace(
    logComment.fullComment,
    buildTheLoggingCode(logComment.variableToLog)
  );
}

function buildTheLoggingCode(variable) {
  return `console.log(${variable});`;
}
