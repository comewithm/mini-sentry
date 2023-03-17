

export interface IFetchData {
    args: any[];
    data: {
        method: string;
        url: string;
    };
    startTimestamp: number;
    response?: any 
}