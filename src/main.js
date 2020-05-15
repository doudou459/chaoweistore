import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import element from 'element-ui'
import { Message } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import ajax from 'axios'
import md5 from 'js-md5'
import BaiduMap from 'vue-baidu-map'
import dataModel from "./js/dataModel"
Vue.config.productionTip = false
Vue.use(element)
Vue.prototype.$md5 = md5
Vue.prototype.$dataModel=dataModel
Vue.use(BaiduMap, {
  ak: '4rqyHXXQQ7G3SXSu6MqX7P4D2OqdnnNV'
})

ajax.interceptors.response.use(
  response => {
     if (response.data.errno == "501") {
      Message({
        showClose: true,
        message: response.data.errmsg,
        type: "error"
      });
      localStorage.removeItem("loginToken");
      localStorage.removeItem("permissions");
      localStorage.removeItem("loginID");
      localStorage.removeItem("loginTime");
      store.commit('setLoginID','');
      store.commit('setToken','');
      router.push("/");
    } else if (response.data.errno == "502") {
      Message({
        showClose: true,
        message: response.data.errmsg,
        type: "error"
      });
      localStorage.removeItem("loginToken");
      localStorage.removeItem("permissions");
      localStorage.removeItem("loginID");
      localStorage.removeItem("loginTime");
      this.$store.commit('setLoginID','');
      this.$store.commit('setToken','');
      this.$router.push("/")
    }
      return response;
  },
  error => {
      return Promise.reject(error.response.data) 
  });
  Vue.prototype.$ajax = ajax
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
