import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element'
import './assets/element-override.css'
import './assets/reset.css'
import './assets/dark.css'
import { initTheme } from './utils/theme'

initTheme()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
