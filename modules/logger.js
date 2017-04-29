'use strict';

let winston = require('winston');

winston.addColors({
    fatal: 'red',
    error: 'red',
    warn: 'yellow',
    info: 'green',
    debug: 'magenta',
    trace: 'blue',
    verbose: 'cyan'
});

let logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            level: 'verbose',
            prettyPrint: true,
            colorize: true,
            silent: false,
            timestamp: true
        }),
        new (winston.transports.File) ({
            filename: './logs/winston.log',
            level: 'verbose'
        })
    ]
});

logger.setLevels({
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
    verbose: 6
});


module.exports = (filename) => {
    let file = filename ? filename + ' - ' : '';

    logger.log('debug', 'logger.js - registering module ' + filename);

    let defaultLevel = (message, ...objects) => {
        logger.log('info', file + message, ...objects);
    };

    let logFunctions = {
        fatal:      (message, ...objects) => logger.log('fatal', file + message, objects),
        error:      (message, ...objects) => logger.log('error', file + message, objects),
        warn:       (message, ...objects) => logger.log('warn', file + message, objects),
        info:       (message, ...objects) => logger.log('info', file + message, objects),
        debug:      (message, ...objects) => logger.log('debug', file + message, objects),
        trace:      (message, ...objects) => logger.log('trace', file + message, objects),
        verbose:    (message, ...objects) => logger.log('verbose', file + message, objects)
    };

    let myLogger = defaultLevel;

    Object.assign(myLogger, logFunctions); // Use spread operator

    return myLogger;
};