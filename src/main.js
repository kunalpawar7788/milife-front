import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import store from './store';
import './registerServiceWorker';
import AsyncComputed from 'vue-async-computed';
import Vuelidate from 'vuelidate';
import VueProgressBar from 'vue-progressbar';

import _ from 'lodash';
Object.defineProperty(Vue.prototype, '$_', { value: _ });

Vue.use(Vuelidate);

const progressbar_options = {
    color: '#8AC53F', // '#bffaf3',
    failedColor: '#874b4b',
    thickness: '7px',
    transition: {
        speed: '0.2s',
        opacity: '0.6s',
        termination: 300
    },
    autoRevert: true,
    location: 'top',
    inverse: false
};

Vue.use(VueProgressBar, progressbar_options);



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

Vue.prototype.$http.interceptors.request.use(config => {
    Vue.prototype.$Progress.start(); // for every request start the progress
    return config;
});

Vue.prototype.$http.interceptors.response.use(response => {
    Vue.prototype.$Progress.finish(); // finish when a response is received
    return response;
});
