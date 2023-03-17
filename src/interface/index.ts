

export interface IOptions {
    [key: string]: any;
    performance: boolean;
}

export type THandleType = "xhr" | 'fetch' | 'history' | 'console' | 'error' | 'unhandledrejection'

export type THandleCallback = (data: any) => void