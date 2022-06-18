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
