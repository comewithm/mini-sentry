import { IOptions } from 'interface'
import { TReportInfo } from './reporter'

export interface IClientOptions extends IOptions {
  [key: string]: any
  report?: TReportInfo
}
