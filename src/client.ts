import { setupIntegrations } from 'core/integrations'
import { getCurrentStore } from 'core/store'
import { IRedux } from 'integration/redux'
import { IIntegration, IIntegrationCls, IIntegrationIndex } from 'interface'
import { IClient } from 'interface/client'
import { IEventHint } from 'interface/event'
import { IClientOptions } from 'interface/options'
import { logger } from 'utils/console'

type ClientClass<F extends IClient, T extends IClientOptions> = new (
  options: T
) => F

// 包含所有方法
export abstract class BaseClient<O extends IClientOptions>
  implements IClient<O>
{
  protected readonly options: O

  protected isSetup: boolean = false

  protected integrations: IIntegrationIndex = {}

  constructor(options) {
    this.options = options
  }

  public captureMessage(
    message: any,
    hint: IEventHint,
    redux?: IRedux
  ): string | undefined {
    return
  }

  public captureException(
    exception: any,
    hint?: IEventHint,
    redux?: IRedux
  ): string | undefined {
    let eventId: string | undefined = hint?.event_id
    logger.log('captureException exception:', exception)
    logger.log('captureException hint:', hint)
    return eventId
  }

  public captureEvent(
    event: Event,
    hint?: IEventHint | undefined,
    redux?: IRedux | undefined
  ): string | undefined {
    let eventId: string | undefined = hint?.event_id
    logger.log('capture event:', event)
    logger.log('capture hint:', hint)
    return eventId
  }

  public getOptions(): O {
    return this.options
  }

  public setupIntegrations(): void {
    if (!this.isSetup) {
      this.isSetup = true
      // 初始化
      this.integrations = setupIntegrations(this.options.integrations)
    }
  }

  /**
   * @description 根据初始化的Class id获取不同的Class实例
   * @param integration
   * @returns
   */
  getIntegrations<T extends IIntegration>(
    integration: IIntegrationCls<T>
  ): T | null {
    try {
      return (this.integrations[integration.id] as T) || null
    } catch (error) {
      return null
    }
  }
}

export function initClient<F extends IClient, T extends IClientOptions>(
  clientClass: ClientClass<F, T>,
  options: T
) {
  // 数据中心获取
  const store = getCurrentStore()
  // 获取存储的数据Redux中是否有当前用户信息
  const redux = store.getRedux()

  const client = new clientClass(options)

  redux.updateUserInfo(options.initUserInfo)

  // 绑定client
  store.bindClient(client)
}
