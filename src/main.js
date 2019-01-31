import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import store from './store';
import './registerServiceWorker';
import AsyncComputed from 'vue-async-computed';

Vue.use(AsyncComputed);
Vue.prototype.$http = axios;
const token = localStorage.getItem('token');
if (token) {
    Vue.prototype.$http.defaults.headers.common['Authorization'] = token;
}

Vue.config.productionTip = false;


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
