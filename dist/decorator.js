"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UtilsMapper_1 = require("./UtilsMapper");
require("core-js/es7/reflect");
function WebSocket(arg) {
    console.log('WebSocket', arg);
    return function (target) {
        console.log('a', arg);
    };
}
exports.WebSocket = WebSocket;
function DataBase(arg) {
    return function (target) {
        const env = require('src/environment/environment' + (!process.env.env ? '' : '.' + process.env.env)).environment;
        UtilsMapper_1.setConnectionDataBase(env.database);
    };
}
exports.DataBase = DataBase;
function Controller(arg) {
    return function (target) {
        const className = target.constructor.name;
        UtilsMapper_1.setRoutingName(['get', arg].join('_'), { type: 'get', Function: target.constructor, query: null, className: className });
    };
}
exports.Controller = Controller;
function Module(arg) {
    const { imports } = arg;
    imports.forEach((e) => {
        UtilsMapper_1.setControllerName(e.name, { controller: e, api: arg, routing: [] });
        UtilsMapper_1.Moduleimports.push(e);
    });
    return function (target) {
    };
}
exports.Module = Module;
function Subscribe(options) {
    let { namespace, channel } = options;
    namespace = (namespace == '' ? 'dozjsNamespace' : namespace);
    return function (target, propertyKey, descriptor) {
        UtilsMapper_1.setWebSocketName(namespace, { parent: target, channel, Function: descriptor });
    };
}
exports.Subscribe = Subscribe;
function Get(path) {
    path = (typeof path == "undefined" ? '/' : path);
    return function (target, propertyKey, descriptor) {
        const className = target.constructor.name;
        const type = 'get';
        UtilsMapper_1.setRoutingName([className, type, path].join('_'), { type, Function: descriptor, query: null, className: className });
    };
}
exports.Get = Get;
function Post(path) {
    path = (typeof path == "undefined" ? '/' : path);
    return function (target, propertyKey, descriptor) {
        const className = target.constructor.name;
        const type = 'post';
        UtilsMapper_1.setRoutingName([className, type, path].join('_'), { type, Function: descriptor, query: null, className: className });
    };
}
exports.Post = Post;
function Put(path) {
    path = (typeof path == "undefined" ? '/' : path);
    return function (target, propertyKey, descriptor) {
        const className = target.constructor.name;
        const type = 'put';
        UtilsMapper_1.setRoutingName([className, type, path].join('_'), { type, Function: descriptor, query: null, className: className });
    };
}
exports.Put = Put;
function Delete(path) {
    path = (typeof path == "undefined" ? '/' : path);
    return function (target, propertyKey, descriptor) {
        const className = target.constructor.name;
        const type = 'delete';
        UtilsMapper_1.setRoutingName([className, type, path].join('_'), { type, Function: descriptor, query: null, className: className });
    };
}
exports.Delete = Delete;
function Query(p) {
    return function (target, propertyKey, descriptor) {
        const className = target.constructor.name;
        UtilsMapper_1.Queriesql[[className, descriptor.value.name].join('_')] = p;
    };
}
exports.Query = Query;
function Param(target, propertyName, index) {
    const metadataKey = `log_${propertyName}_parameters`;
    if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(index);
    }
    else {
        target[metadataKey] = [index];
    }
}
exports.Param = Param;
//# sourceMappingURL=decorator.js.map