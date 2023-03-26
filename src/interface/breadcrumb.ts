export const MAX_BREADCRUMB = 50

export interface IBreadCrumbOptions {
  xhr: boolean
  fetch: boolean
  history: boolean
  console: boolean
  performance: boolean
}

export interface IBreadCrumb {
  /**添加的类型 */
  type?: string
  /**当前type的父级类型 */
  superType?: string
  /**添加的数据 */
  data?: { [key: string]: any }
  /**console中的message */
  message?: string
  /**当前时间戳 */
  timestamp?: number
  /**console的等级 */
  level?: string
  /**记录当前存储的事件id */
  event_id?: string
}

export interface IBreadCrumbHint {
  /**输入的参数 */
  input?: any[]
  /**错误信息 */
  data?: any
  args?: any[]
  /**响应结果 */
  response?: Response
  startTimestamp?: number
  endTimestamp?: number
  [key: string]: any
}
