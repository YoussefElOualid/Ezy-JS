import {
    db,
    Moduleimports,
    Queriesql,
    routerMapping,
    setConnectionDataBase,
    setControllerName,
    setRoutingName,
    setWebSocketName
} from "./UtilsMapper";
import {QueryLogger} from "./Logger"
import 'core-js/es7/reflect';


export function WebSocket(arg: any) {
    console.log('WebSocket', arg)
    return function (target) {
        //setW(arg)
        console.log('a', arg)
    }
}
export function DataBase(arg?: any) {
    return function (target) {
        const env = require('src/environment/environment' + ( !process.env.env ? '' : '.' + process.env.env )).environment;
        setConnectionDataBase(env.database);
    }
}
export function Controller(arg: any) {
    return function (target) {
        const className = target.constructor.name
        setRoutingName(['get', arg].join('_'), {type: 'get',Function: target.constructor, query: null, className: className})
    }
}

/*export function RequestHeaderParam(arg: any) {
    return function (target) {
        const className = target.constructor.name
        setRoutingName(['get', arg].join('_'), {type: 'get',Function: target.constructor, query: null, className: className})
    }
}
export function RequestHeaderParam(key: string) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        console.log(target)
        //descriptor.enumerable = value;
    };
}*/
export function Module(arg: any) {
    const { imports } = arg
    imports.forEach((e) => {
        setControllerName(e.name, {controller: e, api: arg, routing: []})
        Moduleimports.push(e);
    });
    return function (target) {
    }
}

export function Subscribe(options?: any) {
    let {namespace, channel} = options;
        namespace =  (namespace == '' ? 'dozjsNamespace' : namespace);
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        setWebSocketName(namespace, {parent: target, channel, Function: descriptor})
    }
}

export function Get(path?: string) {
    path = (typeof path == "undefined" ? '/' : path)
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const className = target.constructor.name
        const type = 'get'
        setRoutingName([className, type, path].join('_'), {type,Function: descriptor, query: null, className: className})
    }
}

export function Post(path?: string) {
    path = (typeof path == "undefined" ? '/' : path)
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const className = target.constructor.name
        const type = 'post'
        setRoutingName([className, type, path].join('_'), {type, Function: descriptor, query: null, className: className})
    }
}

export function Put(path?: string) {
    path = (typeof path == "undefined" ? '/' : path)
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const className = target.constructor.name
        const type = 'put'
        setRoutingName([className, type, path].join('_'), {type, Function: descriptor, query: null, className: className})
    }
}

export function Delete(path?: string) {
    path = (typeof path == "undefined" ? '/' : path)
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const className = target.constructor.name
        const type = 'delete'
        setRoutingName([className, type, path].join('_'), {type, Function: descriptor, query: null, className: className})
    }
}


export function Query(p) {
    return function (target, propertyKey: string, descriptor: PropertyDescriptor) {
        const className = target.constructor.name
        Queriesql[[className, descriptor.value.name].join('_')] = p;
    }
}


export function Param(target: Object, propertyName: string, index: number) {

    // generate metadatakey for the respective method
    // to hold the position of the decorated parameters
    const metadataKey = `log_${propertyName}_parameters`;
    if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(index);
    }
    else {
        target[metadataKey] = [index];
    }
}
