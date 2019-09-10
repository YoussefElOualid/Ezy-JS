"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const EzyFactory_1 = require("./EzyFactory");
exports.logger = chalk_1.default;
const fs = require('fs');
const config = JSON.parse(fs.readFileSync('.ezy.json'));
const nameApp = (config.name + ':' + config.version || '0.0.1');
exports.initLogger = (message) => {
    console.log(exports.logger.green(`${message}`));
};
exports.RouterLogger = (ClassModule, routeLink) => {
    console.log(exports.logger.green(`[${EzyFactory_1.__FRAMEWORK_NAME__}: ${nameApp}] [RouterMapper]: [${new Date().toJSON().slice(0, 10)}]: ${ClassModule} : "${routeLink}"`));
};
exports.DBLogger = (config, type = 'yellow') => {
    let msg = '';
    switch (type) {
        case 'red':
            msg = `[${EzyFactory_1.__FRAMEWORK_NAME__}: ${nameApp}] [Database]: [${new Date().toJSON().slice(0, 10)}]: Except Query : ${config}`;
            break;
        case 'yellow':
            msg = `[${EzyFactory_1.__FRAMEWORK_NAME__}: ${nameApp}] [Database]: [${new Date().toJSON().slice(0, 10)}]: ${config.database}`;
            break;
    }
    console.log(exports.logger[type](msg));
};
exports.QueryLogger = (ClassModule, routeLink) => {
    console.log(exports.logger.blue(`[${EzyFactory_1.__FRAMEWORK_NAME__}: ${nameApp}] [Query]: [${new Date().toJSON().slice(0, 10)}]: ${JSON.stringify(ClassModule)} {"${routeLink}"}`));
};
exports.ServerRunLogger = (host, port) => {
    console.log(exports.logger.greenBright(`[${EzyFactory_1.__FRAMEWORK_NAME__}: ${nameApp}] [Server]:\x00\x00\x00[${new Date().toJSON().slice(0, 10)}]: App listening at http://${host}:${port}`));
};
//# sourceMappingURL=Logger.js.map