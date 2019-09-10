import {$query, db, Queriesql, routerMapping, webSocketMapping} from "./UtilsMapper";
import {DBLogger, QueryLogger, RouterLogger, ServerRunLogger} from "./Logger";
import {QueryVO} from "./model/QueryVO";
import './Kernel';

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
export let __FRAMEWORK_NAME__ = 'Ezy Js';
export class EzyFactory {
    constructor() {
    }

    private buildApp() {
        Object.keys(routerMapping).forEach((data, i) => {
            const {Function, type, className} = routerMapping[data];
            const apiUri = [className, '_', type, '_'].join('');
            const uri = __PREFFIX_URL__ + data.replace(apiUri, '')
            /**
             * @Using BodyParser
             */
            app.use(bodyParser.json())
            app.use(bodyParser.urlencoded({extended: true}));
            /**
             * @SetType [GET, POST, PUT, DELETE, ....]
             * @Api [${uri}]
             * @Function [${Function.value}]
             */

            const routeQuery = [className, Function.value.name].join('_');
            app[type](uri, (req, res) => {
                req['api'] = request;
                this.buildQuery(req, Queriesql[routeQuery]).then((queries) => {
                    Function.value.apply(Function.value.name, [req, res, queries, frameWs])
                })
            })
            /**
             * Router & Query Logger
             * */
            RouterLogger(type.toUpperCase(), uri);
            QueryLogger(Function.value.name, Queriesql[routeQuery]);

        })
        Object.keys(webSocketMapping).forEach((nsp, i) => {
            let _nsp = (nsp[0] == '/' ? nsp : '/' + nsp);
            frameWs.on('connection', (socket) => {
                const { query } = socket.handshake;
                let roomName = this.prepareVarsOfSocket(_nsp, query)
                socket.join(roomName);
                webSocketMapping[nsp].forEach((elSocket, i) => {
                    const {parent, channel, Function} = elSocket;
                    socket.on(channel, function () {
                        let args = Array.prototype.slice.call(arguments);
                        args = [socket].concat(args)
                        parent[Function.value.name].call(new parent.constructor(), ...args)
                    })
                })

            });
        })
        app.use(express.static('src/public'));
        app.get('/', function (req, res) {
            res.sendFile(process.cwd() + '/src/public/index.html');
        });
        // 404
        app.use(function(req, res, next) {
            return res.status(404).sendFile(process.cwd() + '/src/public/404.html');
        });

        // 500 - Any server error
        app.use(function(err, req, res, next) {
            return res.status(500).sendFile(process.cwd() + '/src/public/500.html');
        });
    }
    private prepareVarsOfSocket(str, params) {
        const vars = str.match(/[:|$|?]{1,1}[a-zA-z0-9-_]*\b/g);
        if (vars) {
            vars.forEach(e => {
                const id = e.replace(/[:|$|?]{1,1}/g, '');
                str = str.replace(e, params[id]);
            });
        }
        return str
    }
    private async buildQuery(req, query) {
        if (query) {
            const params: QueryVO = {query: query, results: [], err: [], params: {}}
            const vars = query.match(/[:|$|?]{1,1}[a-zA-z0-9-_]*\b/g);
            if (vars) {
                vars.forEach(e => {
                    const id = e.replace(/[:|$|?]{1,1}/g, '');
                    params.params[e] = (req.params[id] || req.body[id]) || req.query[id];
                    params['query'] = params['query'].replace(e, params.params[e]);
                });
            }
            try {
                params['results'] = await $query(params['query']);
            } catch (e) {
                params['err'] = e;
                DBLogger(e.sqlMessage, 'red')
            }
            return params;
        }
    }

    load(module) {
        module = new module();
        return this;
    }

    usePreffixUri(uri) {
        __PREFFIX_URL__ = (uri[0] == '/' ? uri : '/' + uri)
    }

    useSwagger(uri) {
        var options = {}
        app.use((uri[0] == '/' ? uri : '/' + uri), swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
    }

    enableCros() {
        app.use(cors());
        app.use(function (req, res, next) {
            res.header('Access-Control-Allow-Origin', ['*']);
            res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
            res.header("X-Powered-By", "Youssef ELoualid (C)");
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Authorization',
            );

            res.header(__FRAMEWORK_NAME__.replace(/\s/g, ''), '1.0.0');
            res.header('X-Powered-By', 'Youssef ElOualid');
            res.header('X-Email-By', 'youssef.eloualid.dev@gmail.com');

            if (req.method === 'OPTIONS') {
                res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
                const e = {};
                e[req.method] = '<= Methode not allowed'
                return res.status(200).json(e);
            }
            next();
        });
    }

    listen(port) {
        this.buildApp();
        server.listen(port)
//        app.listen(port)
        ServerRunLogger('localhost', port)
        ServerRunLogger('Socketon: localhost', (port + 1))
    }
}
