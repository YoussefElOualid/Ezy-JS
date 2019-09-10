export declare const logger: import("chalk").Chalk & {
    supportsColor: import("chalk").ColorSupport;
};
export declare const initLogger: (message: any) => void;
export declare const RouterLogger: (ClassModule: any, routeLink: any) => void;
export declare const DBLogger: (config: any, type?: string) => void;
export declare const QueryLogger: (ClassModule: any, routeLink: any) => void;
export declare const ServerRunLogger: (host: any, port: any) => void;
