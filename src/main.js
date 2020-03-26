import Vue from 'vue'
import App from './App.vue'
import router from './router'
import ElementUI from 'element-ui'
Vue.config.productionTip = false
// 全局样式
import './assets/css/global.css'
import 'element-ui/lib/theme-chalk/index.css';
import './assets/fonts/iconfont.css'

import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
// Do something before request is sent
config.headers.Authorization=window.sessionStorage.getItem('token')
return config;
},error => {
// Do something with request error
return Promise.reject(error);
});
Vue.prototype.$http = axios
Vue.use(ElementUI);
new Vue({
  render: h => h(App),
  router
}).$mount('#app')