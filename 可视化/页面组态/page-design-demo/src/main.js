import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { VueAxios } from './api/request'
import { EventBus } from '@/utils/EventBus'
import installComponents from '@/components/index'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css' // or 'ant-design-vue/dist/antd.less'
import '@/utils/globalWidgetRef'
Vue.config.productionTip = false

installComponents() // 自定义组件安装

Vue.use(Antd) // antd 组件安装
Vue.use(VueAxios) // 定义 全局HTTP请求
Vue.use(EventBus) // 定义全局事件总线

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
