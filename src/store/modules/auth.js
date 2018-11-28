import axios from 'axios';

const state = {
    state: '',
    token: localStorage.getItem('token') || '',
    user: {},
};

// getters
const getters = {
    isAuthenticated: state=> !!state.token,
    isLoggedIn: state => !!state.token || state.token==="undefined",
    authStatus: state => state.status,
    is_staff: state => state.user['is_staff'],
    isUserEmailVerified: state=>state.user['email_verified'],
    email: state=>state.user.email,
    fetch_profile_flag: state => !!state.token && Object.keys(state.user).length === 0,
};

// actions
const actions = {
    register({commit}, user){
        return new Promise((resolve, reject) => {
            commit('auth_request');

            axios({url: process.env.VUE_APP_BASE_URL+'/api/auth/register', data: user, method: 'POST' })
                .then(resp => {
                    commit('auth_success', resp.data);
                    axios.defaults.headers.common['Authorization'] = "Token " + resp.data.auth_token;
                    resolve(resp);
                })
                .catch(err => {
                    commit('auth_error', err);
                    reject(err);
                });
        });
    },
    login({commit}, user){
        return new Promise((resolve, reject) => {
            commit('auth_request');
            axios({url: process.env.VUE_APP_BASE_URL + '/api/auth/login', data: user, method: 'POST' })
                .then(resp => {
                    commit('auth_success', resp.data);
                    axios.defaults.headers.common['Authorization'] = "Token " + resp.data.auth_token;

                    resolve(resp);
                })
                .catch(err => {
                    commit('auth_error');
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
                    resolve(resp);
                })
                .catch(err => {
                    commit('auth_error');
                    localStorage.removeItem('token');
                    reject(err);
                });

        });
    },
    fetch_profile({commit}){
        return new Promise((resolve, reject) => {
            axios({url: process.env.VUE_APP_BASE_URL + '/api/me', method: 'GET' })
                .then(resp => {
                    commit('profile_fetched', resp.data);
                    resolve(resp);
                })
                .catch(err => {
                    reject(err);
                });

        });
    },
    change_password({commit}, data){
        const url = process.env.VUE_APP_BASE_URL+'/api/auth/password_change';
        axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
        console.log(axios.defaults.headers.common['Authorization']);
        return new Promise((resolve, reject) => {
            axios({url: url, data: data, method: 'POST' })
            .then(resp => {
                //commit('email_verified');
                console.log("password changed");
            })
            .catch(err => {
                console.log(err);
            });

        });
    },
};

// mutations
const mutations = {
    auth_request(state){
        state.status = 'loading';
    },
    auth_success(state, data){
        state.status = 'success';
        state.user = {
            first_name:  data.first_name,
            last_name:  data.last_name,
            number: data.number,
            email: data.email,
            is_staff: data.is_staff,
            is_active: data.is_active,
            email_verified: data.email_verified,
        };
        state.token = data.auth_token;
        localStorage.setItem('token', data.auth_token);
    },
    auth_error(state){
        state.status = 'error';
        state.user = {};
        state.token = '';
        localStorage.removeItem('token');
    },
    logout(state){
        state.user = {};
        state.status = '';
        state.token = '';
        localStorage.removeItem('token');
    },

    email_verified(state){
        state.email_verified = true;
    },

    profile_fetched(state, data){
        state.user = {
            first_name: data.first_name,
            last_name: data.last_name,
            number: data.number,
            email: data.email,
            is_staff: data.is_staff,
            is_active: data.is_active,
            email_verified: data.email_verified,
        };
    }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
