export interface QueryVO {
    query?: string;
    results?: Array<any> | Object;
    err: Array<any>;
    params: Object;
}
