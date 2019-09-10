import chalk from 'chalk';
import {__FRAMEWORK_NAME__} from "./EzyFactory";
export const logger = chalk;
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('.ezy.json'));
const nameApp = (config.name + ':' + config.version || '0.0.1');

export const initLogger = (message) => {
    console.log(logger.green(`${message}`));
}

export const RouterLogger = (ClassModule, routeLink) => {
    console.log(logger.green(`[${__FRAMEWORK_NAME__}: ${nameApp}] [RouterMapper]: [${new Date().toJSON().slice(0,10)}]: ${ClassModule} : "${routeLink}"`));
}

export const DBLogger = (config, type='yellow') => {
    let msg = ''
    switch (type) {
        case 'red': msg = `[${__FRAMEWORK_NAME__}: ${nameApp}] [Database]: [${new Date().toJSON().slice(0,10)}]: Except Query : ${config}`; break;
        case 'yellow': msg = `[${__FRAMEWORK_NAME__}: ${nameApp}] [Database]: [${new Date().toJSON().slice(0,10)}]: ${config.database}`; break;
    }
    console.log(logger[type](msg));
}

export const QueryLogger = (ClassModule, routeLink) => {
    console.log(logger.blue(`[${__FRAMEWORK_NAME__}: ${nameApp}] [Query]: [${new Date().toJSON().slice(0,10)}]: ${JSON.stringify(ClassModule)} {"${routeLink}"}`));
}

export const ServerRunLogger = (host, port) => {
    console.log(logger.greenBright(`[${__FRAMEWORK_NAME__}: ${nameApp}] [Server]:\x00\x00\x00[${new Date().toJSON().slice(0,10)}]: App listening at http://${host}:${port}`));
}
