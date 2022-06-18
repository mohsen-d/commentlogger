# commentlogger

commentlogger enables developers to move their debugging console.log() out of their code and into the comments, resulting in a cleaner code.

## usage

install using `npm i commentlogger`

    const logger = require('commentlogger');
    logger.watch(
        module content ...
    )();

usage is simple:
wherever a log is required, add a `//` , then add `log(variable, env)`

The following logs `sum` when `NODE_ENV` is set to `dev`:

    const sum = 3 + 2; // log(sum, dev)

This one will run if the environment is set to `prod`:

    const result = calculateSomething(); // log(result, prod)

`env` can also be `all`. In that case logging will be done regardless of `NODE_ENV` value;

## Roadmap

- adding other logging options beside console.log
