const state = {
    user_search_param: "",
};

const getters = {
    user_search_param: state => state.user_search_param,
};

const actions = {
    set_user_search_param({commit}, param){
        commit('set_user_search_param', param);
    },
};

const mutations = {
    set_user_search_param(state, param){
        state.user_search_param=param;
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
