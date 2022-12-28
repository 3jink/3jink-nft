// with polyfills
import 'core-js/stable'
import 'regenerator-runtime/runtime'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import moment from 'moment'
// import i18n from './locales'
import { VueAxios } from './utils/request'
import ProLayout, { PageHeaderWrapper } from '@ant-design-vue/pro-layout'
import themePluginConfig from '../config/themePluginConfig'
//引入自定义storages，注册在vue原型上，方便设置过期时间
import storages from './utils/storages'//引入
import globalMixin from '../mixin/globalMixin'
Vue.prototype.$storage = storages
Vue.prototype.$moment = moment

// mock
// WARNING: `mockjs` NOT SUPPORT `IE` PLEASE DO NOT USE IN `production` ENV.
// import './mock'

import bootstrap from './core/bootstrap'
import './core/lazy_use' // use lazy load components
import './permission' // permission control
import './utils/filter' // global filter
import './assets/css/global.less' // global style
import './assets/theme.less'
import '../public/font_3129536_e184xsj9q2p.js'//以symbol方式引入阿里图标
import Antd from 'ant-design-vue/es';//引入ant design组件库
import 'ant-design-vue/dist/antd.css';
import {VueJsonp} from "vue-jsonp";

Vue.use(VueJsonp);
Vue.mixin(globalMixin)
Vue.use(Antd);

Vue.config.productionTip = false

// mount axios to `Vue.$http` and `this.$http`
Vue.use(VueAxios)
// use pro-layout components
Vue.component('pro-layout', ProLayout)
Vue.component('page-container', PageHeaderWrapper)
Vue.component('page-header-wrapper', PageHeaderWrapper)

window.umi_plugin_ant_themeVar = themePluginConfig.theme

new Vue({
  router,
  store,
  // i18n,
  // init localstorage, vuex, Logo message
  created: bootstrap,
  render: h => h(App)
}).$mount('#app')


// window.addEventListener('storage', function(e) {
//   localStorage.setItem(e.key, e.oldValue)
// });
