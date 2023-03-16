

interface Options {
    [key: string]: any;
    performace: boolean;
}

type HandleType = "xhr" | 'fetch' | 'history' | 'console' | 'error' | 'unhandledrejection'

type HandleCallback = (data: any) => void