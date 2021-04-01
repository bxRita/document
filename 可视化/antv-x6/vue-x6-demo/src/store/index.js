import Vue from 'vue'
import Vuex from 'vuex'
import CreateLogger from 'vuex/dist/logger'
import modules from './modules'
Vue.use(Vuex)

export default new Vuex.Store({
  modules,
  strict: false,
  plugins: [CreateLogger()]
})
