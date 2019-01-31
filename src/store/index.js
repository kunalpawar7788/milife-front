import Vue from 'vue';
import Vuex from 'vuex';
import auth from './modules/auth';
import user from './modules/user';
import VuexPersistence from 'vuex-persist';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
});

export default new Vuex.Store({
    modules: {
        auth,
        user,
    },
    strict: debug,
    //plugins: debug ? [createLogger()] : []
    plugins: [vuexLocal.plugin]

});
