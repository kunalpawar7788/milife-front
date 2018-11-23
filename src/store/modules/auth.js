import axios from 'axios';

const state = {
    state: '',
    token: localStorage.getItem('token') || '',
    user: {}
}

// getters
const getters = {
    isLoggedIn: state => !!state.token || state.token==="undefined",
    authStatus: state => state.status,
    isTrainer: state => state.user.user_type='trainer',
    emailVerified: state=>(state.user.is_active && false),
}

// actions
const actions = {
    register({commit}, user){
        return new Promise((resolve, reject) => {
            commit('auth_request');
            console.log('inside auth/rehister');
            axios({url: process.env.VUE_APP_BASE_URL+'/api/auth/register', data: user, method: 'POST' })
                .then(resp => {
                    const token = resp.data.token;
                    const user = resp.data.user;
                    localStorage.setItem('token', token);
                    axios.defaults.headers.common['Authorization'] = token;
                    commit('auth_success', token, user);
                    resolve(resp);
                })
                .catch(err => {
                    commit('auth_error', err);
                    localStorage.removeItem('token');
                    reject(err);
                });
        });
    },
    login({commit}, user){
        return new Promise((resolve, reject) => {
            commit('auth_request');
            axios({url: process.env.VUE_APP_BASE_URL + '/api/auth/login', data: user, method: 'POST' })
                .then(resp => {
                    const token = resp.data.auth_token;
                    const user = {
                        first_name: resp.data.first_name,
                        last_name: resp.data.last_name,
                        number: resp.data.number,
                        email: resp.data.email,
                    };
                    localStorage.setItem('token', token);
                    axios.defaults.headers.common['Authorization'] = token;
                    commit('auth_success', token, user);
                    resolve(resp);
                })
                .catch(err => {
                    commit('auth_error');
                    localStorage.removeItem('token');
                    reject(err);
                });
        });
    },
    logout({commit}){
        return new Promise((resolve, reject) => {
            commit('logout');
            axios({url: process.env.VUE_APP_BASE_URL + '/api/auth/logout', method: 'POST' })
                .then(resp => {
                    localStorage.removeItem('token');
                    delete axios.defaults.headers.common['Authorization'];
                    resolve();
                    resolve(resp);
                })
                .catch(err => {
                    commit('auth_error');
                    localStorage.removeItem('token');
                    reject(err);
                });

        });
    }
}

// mutations
const mutations = {
    auth_request(state){
        state.status = 'loading';
    },
    auth_success(state, token, user){
        state.status = 'success';
        state.token = token;
        state.user = user;
    },
    auth_error(state){
        state.status = 'error';
    },
    logout(state){
        state.status = '';
        state.token = '';
    },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
