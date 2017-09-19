import Vue from 'vue'
import App from './App'
// import router from './router'
import VueResource from 'vue-resource'
// import store from './store'
Vue.use(VueResource)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
