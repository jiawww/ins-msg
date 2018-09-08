import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/normalize.css'   //引入样式重置文件
import axios from "axios";
axios.defaults.withCredentials = true;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
