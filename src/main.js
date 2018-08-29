import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/normalize.css'   //引入样式重置文件

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
