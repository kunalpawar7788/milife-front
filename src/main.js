import Vue from 'vue';
import App from './App.vue';
import router from './router';
import axios from 'axios';
import store from './store';
import './registerServiceWorker';
import AsyncComputed from 'vue-async-computed';
import Vuelidate from 'vuelidate';
import VueProgressBar from 'vue-progressbar';
import VuePromiseBtn from 'vue-promise-btn';
import 'vue-promise-btn/dist/vue-promise-btn.css';
import VueSimpleAlert from "vue-simple-alert";
import Filters from './filters';

Vue.use(VueSimpleAlert);
Vue.use(VuePromiseBtn);

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

Vue.mixin({
    filters: Filters
});


Vue.use(AsyncComputed);
Vue.prototype.$http = axios;
const token = localStorage.getItem('token');
if (token) {
    Vue.prototype.$http.defaults.headers.common['Authorization'] = "Token " + token;
}

Vue.config.productionTip = false;


if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

Vue.use(require('vue-moment'));

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
}, error => {
    Vue.prototype.$Progress.fail();

    // vueApp.loading = false;
    // vueApp.errors = error.response.data.errors || { "none": [error.response.data.message] };
    // vueApp.error = true;
    return Promise.reject(error);
});
