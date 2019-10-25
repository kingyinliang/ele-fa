import * as Sentry from '@sentry/browser'
import Vue from 'vue'

let Log = function () {}
Log.Level = {
  DEBUG: 'debug',
  INFO: 'info',
  WARNING: 'warning',
  ERROR: 'error',
  FATAL: 'fatal'
}

/**
 * 写Info日志
 * @param {String} message
 * @param {Object} extra
 * @param {Object} tags
 * @param {Object} user
 */
Log.writeInfoLog = function (message, extra, tags, user) {
  // 上下文信息包括 ：user 、 tags 、 level 、fingerprint 、 extra data
  Sentry.withScope(scope => {
    scope.setLevel('info')
    if (extra) {
      scope.setExtra('extra', extra)
    }
    if (typeof tags === 'object') {
      for (let prop in tags) {
        scope.setTag(prop, tags[prop])
      }
    }
    if (user) {
      scope.setUser(user)
    }
    Sentry.captureMessage(message)
  })
}
/**
 * 写异常日志
 * @param {Object} ex
 * @param {Object} extra
 * @param {Object} tags
 * @param {Object} user
 */
Log.writeErrorLog = function (ex, extra, tags, user) {
  // 上下文信息包括 ：user 、 tags 、 level 、fingerprint 、 extra data
  Sentry.withScope(scope => {
    scope.setLevel('error')
    if (extra) {
      scope.setExtra('extra', extra)
    }
    if (typeof tags === 'object') {
      for (let prop in tags) {
        scope.setTag(prop, tags[prop])
      }
    }
    if (user) {
      scope.setUser(user)
    }
    Sentry.captureException(ex)
  })
  Sentry.configureScope(scope => {
    let id = sessionStorage.getItem('vuex') ? JSON.parse(sessionStorage.getItem('vuex')).user.id : ''
    let name = sessionStorage.getItem('vuex') ? `${JSON.parse(sessionStorage.getItem('vuex')).user.realName}（${JSON.parse(sessionStorage.getItem('vuex')).user.name}）` : ''
    scope.setUser({
      id: id,
      name: name,
      email: ''
    })
  })
}
// 局部上下文， 只对Sentry.captureMessage('bar')起作用
// Sentry.withScope(scope => {
//   scope.setUser({ id: '8888' })
//   Sentry.captureMessage('bar')
//   // scope.clear();
// })

// 新增面包屑供捕获
// Sentry.addBreadcrumb({
//   category: 'auth',
//   message: 'Authenticated user ' + user.email,
//   level: 'info'
// })

// 通过 showReportDialog 来实现框架的弹出。
// Sentry.showReportDialog()

// Capture exceptions, messages or manual events
// Sentry.captureMessage('Hello, world!')
// Sentry.captureException(new Error('Good bye'))
// Sentry.captureEvent({
//   message: 'Manual'
// })
// 设置此属性之后，event将被此方法捕捉，不再发送到服务端
// class HappyTransport extends Sentry.Transports.BaseTransport {
//   captureEvent (event) {
//     console.log(`This is the place where you'd implement your own sending logic. It'd get url: ${this.url} and an event itself:`, event)
//     return {
//       status: 'success'
//     }
//   }
// }
export default {
  init () {
    Sentry.init({
      // Client's DSN.
      dsn: 'https://73cd073d45de4ff19400cfb68b65e4a6@sentry.shinho.net.cn/3',
      // An array of strings or regexps that'll be used to ignore specific errors based on their type/message
      // ignoreErrors: [/PickleRick_\d\d/, 'RangeError'],
      // // An array of strings or regexps that'll be used to ignore specific errors based on their origin url
      // blacklistUrls: ['external-lib.js'],
      // An array of strings or regexps that'll be used to allow specific errors based on their origin url
      // whitelistUrls: ['http://10.10.2.255:8888', 'https://browser.sentry-cdn'],
      // Debug mode with valuable initialization/lifecycle informations.
      debug: true,
      // Whether SDK should be enabled or not.
      enabled: true,
      // Custom integrations callback
      integrations (integrations) {
        return [new Sentry.Integrations.Vue({ Vue }), ...integrations]
      },
      // A release identifier.
      release: `factory-wap@${process.env.srcconfig}${process.env.RELEASE_VERSION}`,
      // An environment identifier.
      environment: `${process.env.srcconfig}`,
      // Custom event transport that will be used to send things to Sentry
      // transport: HappyTransport
      // Method called for every captured event
      async beforeSend (event, hint) {
        // 当发送event到服务端时弹出对话框，可以收集用户反馈
        // Sentry.showReportDialog(event.eventId)
        // event.extra = {
        //   ...event.extra,
        //   added: '可以在此添为event添加更多的信息'
        // }
        // Because beforeSend and beforeBreadcrumb are async, user can fetch some data
        // return a promise, or whatever he wants
        // Our CustomError defined in errors.js has `someMethodAttachedToOurCustomError`
        // which can mimick something like a network request to grab more detailed error info or something.
        // hint is original exception that was triggered, so we check for our CustomError name
        if (hint.originalException.name === 'CustomError') {
          const serverData = await hint.originalException.someMethodAttachedToOurCustomError()
          event.extra = {
            ...event.extra,
            serverData
          }
        }
        return event
      }
      // Method called for every captured breadcrumb
      // 发送面包屑到服务端时调用
      // beforeBreadcrumb (breadcrumb, hint) {
      //   // We ignore our own logger and rest of the buttons just for presentation purposes
      //   if (breadcrumb.message && breadcrumb.message.startsWith('Sentry Logger')) return null
      //   if (breadcrumb.category !== 'ui.click' || hint.event.target.id !== 'breadcrumb-hint') return null
      //   // If we have a `ui.click` type of breadcrumb, eg. clicking on a button we defined in index.html
      //   // We will extract a `data-label` attribute from it and use it as a part of the message
      //   if (breadcrumb.category === 'ui.click') {
      //     const label = hint.event.target.dataset.label
      //     if (label) {
      //       breadcrumb.message = `User clicked on a button with label '${label}'`
      //     }
      //   }
      //   return breadcrumb
      // }
    })
    // 全局上下文环境
    // 上下文信息包括 ：user 、 tags 、 level 、fingerprint 、 extra data
    Sentry.configureScope(scope => {
      scope.setExtra('basic', {name: 'something in common'})
      scope.setTag('page_local', `${process.env.srcconfig === 'dev' ? '开发环境' : process.env.srcconfig === 'test' ? '测试环境' : process.env.srcconfig === 'pro' ? '正式环境' : '开发环境'}`)
      let id = sessionStorage.getItem('vuex') ? JSON.parse(sessionStorage.getItem('vuex')).user.id : ''
      let name = sessionStorage.getItem('vuex') ? `${JSON.parse(sessionStorage.getItem('vuex')).user.realName}（${JSON.parse(sessionStorage.getItem('vuex')).user.name}）` : ''
      scope.setUser({
        id: id,
        name: name,
        email: ''
      })
      // scope.clear();
    })
    Object.defineProperties(Vue.prototype, {
      $log: { value: Log, writable: true }
    })
  }
}
