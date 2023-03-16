

export interface IBreadCrumbOptions {
    xhr: boolean;
    fetch: boolean;
    history: boolean;
    console: boolean;
    performance: boolean;
}

export interface IBreadCrumb {
    type?: string;
    subtype?: string;
    data?: {[key:string]: any};
    message?: string;
    timestamp?:number;
    level?: string;
    event_id?:string; 
}