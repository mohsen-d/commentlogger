var rewire = require("rewire");

var commentlogger = rewire("./index.js");

function setEnvTo(env) {
  return commentlogger.__set__({
    process: {
      env: {
        NODE_ENV: env,
      },
    },
  });
}

test("log(var, prod) should not be uncommented in dev env", () => {
  setEnvTo("dev");
  const result = commentlogger.watch(() => {
    // log(x, prod)
  });
  expect(result.toString().includes("// log(x, prod)")).toBe(true);
});

test("log(var, dev) should be uncommented in dev env", () => {
  setEnvTo("dev");
  const result = commentlogger.watch(() => {
    // log(x, dev)
  });
  expect(result.toString().includes("// log(x, dev)")).toBe(false);
  expect(result.toString().includes("console.log(x)")).toBe(true);
});

test("multiple env values should work", () => {
  setEnvTo("dev");
  const result = commentlogger.watch(() => {
    // log(x, dev, prod)
  });
  expect(result.toString().includes("// log(x, dev, prod)")).toBe(false);
  expect(result.toString().includes("console.log(x)")).toBe(true);
});

test("spaces should be ignored", () => {
  setEnvTo("dev");
  const result = commentlogger.watch(() => {
    //   log ( x, dev )
  });
  expect(result.toString().includes("//   log ( x, dev )")).toBe(false);
  expect(result.toString().includes("console.log(x)")).toBe(true);
});

test("shall be uncommented if env is not provided", () => {
  setEnvTo("dev");

  const result = commentlogger.watch(() => {
    const x = 1 + 2; // log (x)
  });
  expect(result.toString().includes("// log (x)")).toBe(false);
  expect(result.toString().includes("console.log(x)")).toBe(true);
});

test("custom logging arrow function should work", () => {
  setEnvTo("dev");
  commentlogger.setLoggingFunction((v) => console.error(v));
  const result = commentlogger.watch(() => {
    const x = 1 + 2; // log (x)
  });
  expect(result.toString().includes("// log (x)")).toBe(false);
  expect(result.toString().includes("console.error(x)")).toBe(true);
});

test("custom logging function definition should work", () => {
  setEnvTo("dev");
  commentlogger.setLoggingFunction(function (v) {
    console.error(v);
  });
  const result = commentlogger.watch(() => {
    const x = 1 + 2; // log (x)
  });
  expect(result.toString().includes("// log (x)")).toBe(false);
  expect(result.toString().includes("console.error(x)")).toBe(true);
});

test("custom logging function reference should work", () => {
  setEnvTo("dev");
  const logFunc = function (v) {
    console.error(v);
  };
  commentlogger.setLoggingFunction(logFunc);
  const result = commentlogger.watch(() => {
    const x = 1 + 2; // log (x)
  });
  expect(result.toString().includes("// log (x)")).toBe(false);
  expect(result.toString().includes("console.error(x)")).toBe(true);
});

test("custom logging arrow function without param should work", () => {
  setEnvTo("dev");
  commentlogger.setLoggingFunction(() =>
    console.error("something went wrong!")
  );
  const result = commentlogger.watch(() => {
    const x = 1 + 2; // log (x)
  });
  expect(result.toString().includes("// log (x)")).toBe(false);
  expect(
    result.toString().includes('console.error("something went wrong!")')
  ).toBe(true);
});

test("custom logging function definition without parameter should work", () => {
  setEnvTo("dev");
  commentlogger.setLoggingFunction(function () {
    console.error("something went wrong!");
  });
  const result = commentlogger.watch(() => {
    const x = 1 + 2; // log (x)
  });
  expect(result.toString().includes("// log (x)")).toBe(false);
  expect(
    result.toString().includes('console.error("something went wrong!")')
  ).toBe(true);
});

test("custom logging function definition without body should leave the log commented", () => {
  setEnvTo("dev");
  commentlogger.setLoggingFunction(function () {});
  const result = commentlogger.watch(() => {
    const x = 1 + 2; // log (x)
  });
  expect(result.toString().includes("// log (x)")).toBe(true);
});
