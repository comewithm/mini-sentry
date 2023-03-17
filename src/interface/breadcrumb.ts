
export const MAX_BREADCRUMB = 50


export interface IBreadCrumbOptions {
    xhr: boolean;
    fetch: boolean;
    history: boolean;
    console: boolean;
    performance: boolean;
}

export interface IBreadCrumb {
    type?: string;
    superType?: string;
    data?: {[key:string]: any};
    message?: string;
    timestamp?:number;
    level?: string;
    event_id?:string; 
}