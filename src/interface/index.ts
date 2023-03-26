import { Store } from 'core/store'
import { IUserInfo } from './store'

export interface IOptions {
  [key: string]: any
  reportUrl?: string
  initUserInfo?: IUserInfo
}

export type THandleType =
  | 'xhr'
  | 'fetch'
  | 'history'
  | 'console'
  | 'error'
  | 'unhandledrejection'

export type THandleCallback = (data: any) => void

export interface IIntegration {
  name: string

  setup(
    addGlobalEvent: (callback: any) => void,
    getCurrentStore: () => Store
  ): void
}

export interface IIntegrationIndex {
  [key: string]: IIntegration
}
