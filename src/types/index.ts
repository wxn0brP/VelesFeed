export interface VelesSource {
    _id?: string;
    url?: string;
    name?: string;
}

export interface Setting<T = any, ID = string> {
    _id: ID;
    v: T;
}

export type Settings =
    | Setting<string, "proxy">