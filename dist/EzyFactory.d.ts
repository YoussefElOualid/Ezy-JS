import './Kernel';
export declare let __FRAMEWORK_NAME__: string;
export declare class EzyFactory {
    constructor();
    private buildApp;
    private prepareVarsOfSocket;
    private buildQuery;
    load(module: any): this;
    usePreffixUri(uri: any): void;
    useSwagger(uri: any): void;
    enableCros(): void;
    listen(port: any): void;
}
