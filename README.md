# commentlogger

commentlogger enables developers to move their debugging console.log() out of their code and into the comments, resulting in a cleaner code.

## installing

install using `npm i commentlogger`

## using

    const logger = require('commentlogger');
    logger.watch(() => {
        module content ...
    })();

wherever a log is required, add a `//` , then add `log(message, env)`

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

## defining custom logging behavior

By default, `console.log` is used by the library. But a custom logic can be set as the second argument of `watch()` function

    const logger = require('commentlogger');
    logger.watch(() => {
        module content ...
    }, (msg) => someCustomFunction(msg))();

The example below writes logs to a file:

    const logger = require("commentlogger");
    const fs = require("fs");

    function writeToFile(msg) {
        fs.appendFile("file.log", msg.toString() + "\n", (err) => {
            if (err) {
              console.error(err);
            }
        });
    }

    logger.watch(() => {
        module content....
    },
        (msg) => writeToFile(msg)
    )();
