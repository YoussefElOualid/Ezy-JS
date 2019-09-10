"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("./Logger");
const util = require('util');
var mysql = require('mysql');
exports.declaration = {};
exports.webSocketMapping = {};
exports.subscribeMapping = [];
exports.routerMapping = [];
exports.Moduleimports = [];
exports.Queriesql = {};
function setConnectionDataBase(connection) {
    const { host, password, user, database } = connection;
    exports.db = mysql.createConnection({ host, password, user, database });
    exports.db.connect((err) => {
        if (err) {
            Logger_1.DBLogger(err, 'red');
            process.exit();
        }
        else {
            Logger_1.DBLogger(connection);
            exports.$query = util.promisify(exports.db.query).bind(exports.db);
        }
    });
}
exports.setConnectionDataBase = setConnectionDataBase;
function setControllerName(className, obj, c) {
    exports.declaration[className] = (typeof exports.declaration[className] == "undefined" ? {} : exports.declaration[className]);
    exports.declaration[className] = Object.assign(exports.declaration[className], obj);
    if (typeof c != "undefined")
        c(exports.declaration[className]);
}
exports.setControllerName = setControllerName;
function setRoutingName(router, obj, c) {
    exports.routerMapping[router] = (typeof exports.routerMapping[router] == "undefined" ? {} : exports.routerMapping[router]);
    exports.routerMapping[router] = Object.assign(exports.routerMapping[router], obj);
    if (typeof c != "undefined")
        c(exports.declaration[router]);
}
exports.setRoutingName = setRoutingName;
function setWebSocketName(router, obj, c) {
    if (typeof exports.webSocketMapping[router] == "undefined") {
        exports.webSocketMapping[router] = [];
    }
    exports.webSocketMapping[router].push(obj);
    if (typeof c != "undefined")
        c(exports.declaration[router]);
}
exports.setWebSocketName = setWebSocketName;
function setSubscribeName(router, obj, c) {
    exports.webSocketMapping[router]['children'] = (typeof exports.webSocketMapping[router] == "undefined" ? {} : exports.webSocketMapping[router]);
    exports.webSocketMapping[router]['children'] = Object.assign(exports.webSocketMapping[router], obj);
    if (typeof c != "undefined")
        c(exports.declaration[router]);
}
exports.setSubscribeName = setSubscribeName;
//# sourceMappingURL=UtilsMapper.js.map