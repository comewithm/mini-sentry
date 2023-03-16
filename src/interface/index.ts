

interface IOptions {
    [key: string]: any;
    performance: boolean;
}

type THandleType = "xhr" | 'fetch' | 'history' | 'console' | 'error' | 'unhandledrejection'

type THandleCallback = (data: any) => void