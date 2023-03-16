import { BaseClient } from "client";
import { IClientOptions } from "interface/options";



export class BrowserClient extends BaseClient<IClientOptions> {


    constructor(options: IClientOptions){

        super(options)
    }

    
}