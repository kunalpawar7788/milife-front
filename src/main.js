import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false


if (process.env.NODE_ENV !== 'production') {
    //require('dotenv').load();
    console.log(process.env)
    require('dotenv').config()
    console.log(process.env)
}


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
