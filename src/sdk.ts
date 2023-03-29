import { initClient } from './client'
import { IClientOptions } from 'interface/options'
import { BrowserClient } from 'integration/client'
import { BreadCrumb } from 'integration/breadcrumb'
import { mergeIntegrations } from 'core/integrations'
import { IOptions } from 'interface'
import { GlobalHandler } from 'integration/globalhandler'
import { SHOULD_LOG } from './cons'
import { Reporter } from 'core/reporter'

export const defaultIntegrations = [new BreadCrumb(), new GlobalHandler(), new Reporter()]

export function init(options: IOptions) {
  SHOULD_LOG && console.log('init')

  if (options.defaultIntegrations == undefined) {
    options.defaultIntegrations = defaultIntegrations
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
      console: false,
    }),
    new GlobalHandler({
      onerror: true,
      onunhandledrejection: true,
    }),
    new Reporter({
      reportType: ['fetch', 'xhr'],
      reporturl: "http://localhost:3000/report"
    })
  ],
  initUserInfo: {
    userInfo: {
      id: 100,
      name: 'prayer',
    },
  },
})
