import 'core-js/es7/reflect';
export declare function WebSocket(arg: any): (target: any) => void;
export declare function DataBase(arg?: any): (target: any) => void;
export declare function Controller(arg: any): (target: any) => void;
export declare function Module(arg: any): (target: any) => void;
export declare function Subscribe(options?: any): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Get(path?: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Post(path?: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Put(path?: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Delete(path?: string): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Query(p: any): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void;
export declare function Param(target: Object, propertyName: string, index: number): void;
