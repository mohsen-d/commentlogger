# commentlogger

commentlogger enables developers to move their debugging console.log() out of their code and into the comments, resulting in a cleaner code.

## installing

install using `npm i commentlogger`

## using

    const logger = require('commentlogger');
    logger.watch(() => {
        module content ...
    })();

wherever a log is required, add a `//` , then add `log(variable, env)`

The following logs `sum` when `NODE_ENV` is set to `dev`:

    const sum = 3 + 2; // log(sum, dev)

This one will run if the environment is set to `prod`:

    const result = calculateSomething(); // log(result, prod)

Multiple `env` can be set:

    const result = calculateSomething(); // log(result, dev, test)

if `env` is not provided, logging will be done regardless of `NODE_ENV` value;

    const sum = 3 + 2; // log(sum)

It is not limited to logging variables. You can put messages to be logged

    throw new Error("something went wrong"); // log("an error occurred");

## define custom logging behavior

By default, console.log is used by the library. But it can be replaced using `setLoggingFunction()`

    const logger = require('commentlogger');
    logger.setLoggingFunction((msg) => console.error(msg));

This can be used to write logs to a file or sent to an email.
