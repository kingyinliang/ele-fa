import Vue from 'vue'
import ElementUI from 'element-ui'
import VueCookie from 'vue-cookie'

import App from './App.vue'
import router from './router'
import store from './store'
import httpProxy from '@/net/httpProxy'
import { isAuth } from '@/net/validate'

import '@/assets/scss/index.scss'
import 'element-ui/lib/theme-chalk/index.css'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

Vue.use(ElementUI)
Vue.use(VueCookie)

// 挂载全局
Vue.prototype.$http = httpProxy // ajax请求方法
Vue.prototype.isAuth = isAuth// 权限方法
Vue.prototype.$ = $// jq
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
