import { setupIntegrations } from 'core/integrations'
import { getCurrentStore } from 'core/store'
import { IRedux } from 'integration/redux'
import { IIntegrationIndex } from 'interface'
import { IClient } from 'interface/client'
import { IEventHint } from 'interface/event'
import { IClientOptions } from 'interface/options'

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
    console.log('captureException exception:', exception)
    console.log('captureException hint:', hint)
    console.log('captureException redux:', redux)
    return eventId
  }

  public captureEvent(
    event: Event,
    hint?: IEventHint | undefined,
    redux?: IRedux | undefined
  ): string | undefined {
    let eventId: string | undefined = hint?.event_id
    console.log('capture event:', event)
    console.log('capture hint:', hint)
    console.log('capture redux:', redux)
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
