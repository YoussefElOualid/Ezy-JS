"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const UtilsMapper_1 = require("./UtilsMapper");
const Logger_1 = require("./Logger");
require("./Kernel");
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const request = require('request');
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const frameWs = io;
const cors = require('cors');
let __PREFFIX_URL__ = '';
exports.__FRAMEWORK_NAME__ = 'Ezy Js';
class EzyFactory {
    constructor() {
    }
    buildApp() {
        Object.keys(UtilsMapper_1.routerMapping).forEach((data, i) => {
            const { Function, type, className } = UtilsMapper_1.routerMapping[data];
            const apiUri = [className, '_', type, '_'].join('');
            const uri = __PREFFIX_URL__ + data.replace(apiUri, '');
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({ extended: true }));
            const routeQuery = [className, Function.value.name].join('_');
            app[type](uri, (req, res) => {
                req['api'] = request;
                this.buildQuery(req, UtilsMapper_1.Queriesql[routeQuery]).then((queries) => {
                    Function.value.apply(Function.value.name, [req, res, queries, frameWs]);
                });
            });
            Logger_1.RouterLogger(type.toUpperCase(), uri);
            Logger_1.QueryLogger(Function.value.name, UtilsMapper_1.Queriesql[routeQuery]);
        });
        Object.keys(UtilsMapper_1.webSocketMapping).forEach((nsp, i) => {
            let _nsp = (nsp[0] == '/' ? nsp : '/' + nsp);
            frameWs.on('connection', (socket) => {
                const { query } = socket.handshake;
                let roomName = this.prepareVarsOfSocket(_nsp, query);
                socket.join(roomName);
                UtilsMapper_1.webSocketMapping[nsp].forEach((elSocket, i) => {
                    const { parent, channel, Function } = elSocket;
                    socket.on(channel, function () {
                        let args = Array.prototype.slice.call(arguments);
                        args = [socket].concat(args);
                        parent[Function.value.name].call(new parent.constructor(), ...args);
                    });
                });
            });
        });
        app.use(express.static('src/public'));
        app.get('/', function (req, res) {
            res.sendFile(process.cwd() + '/src/public/index.html');
        });
        app.use(function (req, res, next) {
            return res.status(404).sendFile(process.cwd() + '/src/public/404.html');
        });
        app.use(function (err, req, res, next) {
            return res.status(500).sendFile(process.cwd() + '/src/public/500.html');
        });
    }
    prepareVarsOfSocket(str, params) {
        const vars = str.match(/[:|$|?]{1,1}[a-zA-z0-9-_]*\b/g);
        if (vars) {
            vars.forEach(e => {
                const id = e.replace(/[:|$|?]{1,1}/g, '');
                str = str.replace(e, params[id]);
            });
        }
        return str;
    }
    buildQuery(req, query) {
        return __awaiter(this, void 0, void 0, function* () {
            if (query) {
                const params = { query: query, results: [], err: [], params: {} };
                const vars = query.match(/[:|$|?]{1,1}[a-zA-z0-9-_]*\b/g);
                if (vars) {
                    vars.forEach(e => {
                        const id = e.replace(/[:|$|?]{1,1}/g, '');
                        params.params[e] = (req.params[id] || req.body[id]) || req.query[id];
                        params['query'] = params['query'].replace(e, params.params[e]);
                    });
                }
                try {
                    params['results'] = yield UtilsMapper_1.$query(params['query']);
                }
                catch (e) {
                    params['err'] = e;
                    Logger_1.DBLogger(e.sqlMessage, 'red');
                }
                return params;
            }
        });
    }
    load(module) {
        module = new module();
        return this;
    }
    usePreffixUri(uri) {
        __PREFFIX_URL__ = (uri[0] == '/' ? uri : '/' + uri);
    }
    useSwagger(uri) {
        var options = {};
        app.use((uri[0] == '/' ? uri : '/' + uri), swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
    }
    enableCros() {
        app.use(cors());
        app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', ['*']);
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.header("X-Powered-By", "Youssef ELoualid (C)");
            res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
            res.header(exports.__FRAMEWORK_NAME__.replace(/\s/g, ''), '1.0.0');
            res.header('X-Powered-By', 'Youssef ElOualid');
            res.header('X-Email-By', 'youssef.eloualid.dev@gmail.com');
            if (req.method === 'OPTIONS') {
                res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
                const e = {};
                e[req.method] = '<= Methode not allowed';
                return res.status(200).json(e);
            }
            next();
        });
    }
    listen(port) {
        this.buildApp();
        server.listen(port);
        Logger_1.ServerRunLogger('localhost', port);
        Logger_1.ServerRunLogger('Socketon: localhost', (port + 1));
    }
}
exports.EzyFactory = EzyFactory;
//# sourceMappingURL=EzyFactory.js.map