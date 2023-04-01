import { initClient } from './client'
import { IClientOptions } from 'interface/options'
import { BrowserClient } from 'integration/client'
import { BreadCrumb } from 'integration/breadcrumb'
import { mergeIntegrations } from 'core/integrations'
import { IOptions } from 'interface'
import { GlobalHandler } from 'integration/globalhandler'
import { Reporter } from 'core/reporter'
import { logger } from 'utils/console'

export const defaultIntegrations = [
  new BreadCrumb(),
  new GlobalHandler(),
  new Reporter(),
]

export const __DEBUG__ = true

export function init(options: IOptions) {
  if (options.defaultIntegrations == undefined) {
    options.defaultIntegrations = defaultIntegrations
  }
  // 是否需要debug
  if (options.__DEBUG__) {
    logger.enable()
  }

  // 默认值和手动设置值合并
  const baseOptions: IClientOptions = {
    ...options,
    integrations: mergeIntegrations(options),
  }

  // 实例类，不是抽象类
  initClient(BrowserClient, baseOptions)
}

init({
  integrations: [
    new BreadCrumb({
      performance: true,
      xhr: true,
      history: true,
      fetch: true,
      console: true, // 暂时默认值为false,存在循环调用的问题。
    }),
    new GlobalHandler({
      onerror: true,
      onunhandledrejection: true,
    }),
    new Reporter({
      reportType: ['error'],
      reporturl: 'http://localhost:3000/report',
    }),
  ],
  initUserInfo: {
    userInfo: {
      id: 100,
      name: 'prayer',
    },
  },
  __DEBUG__: true,
})
