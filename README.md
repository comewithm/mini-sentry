### mini-sentry

#### 实现功能

主要是监听错误并对其进行定位，根据路由跳转和接口请求对用户行为快速复现。

+ 监听全局错误，并且捕获相关错误信息输出给用户。
+ 监听路由跳转，方便bug场景复现，快速定位问题。
  + 获取PV，UV信息。
+ 监听fetch，xhr接口请求，记录接口请求是否异常，请求时间记录。


##### 初始化
目前还是直接在bundle中调用，rollup打包还是不熟悉。。。之后看看要怎么改。
```js
    import {BreadCrumb, GlobalHandler} from 'bundle.js'
    init({
        integrations: [
            new BreadCrumb({
                performance: true,
                xhr: true,
                history: true,
                fetch: true,
                console: true,
            }),
            new GlobalHandler({
                onerror: true,
                onunhandledrejection: true,
            })
        ]
        reportUrl: "http://xxx"
    })
```

#### 配置说明

| 配置 | 类型 | 说明 |
| ------ | ------ | ------ |
| `integrations` | `array` | 传入对象属性默认都为true |
| `performance` | `boolean` | 表示开启页面加载性能分析 |
| `xhr` | `boolean` | 监听xhr请求 |
| `hisotry` | `boolean` | 监听路由跳转请求 |
| `fetch` | `boolean` | 监听fetch请求 |
| `console` | `boolean` | 收集console打印 |
| `onerror` | `boolean` | 监听onerror事件收集错误 |
| `onunhandledrejection` | `boolean` | 监听promise相关错误 |
| `reportUrl` | `string` | 监听数据上传地址 |


#### 数据收集 & 上传
+ 目前所有的数据都收集在内部类$\color{purple}{Store}$中
+ 内部根据监听页面的状态上传


```javascript
if(window.document) {
    document.addEventListener("visibilitychange", function(){
        if(document.visibilityState === 'hidden') {
            navigator.sendBeacon(reportUrl, sendData)
        }
    })
}
```
