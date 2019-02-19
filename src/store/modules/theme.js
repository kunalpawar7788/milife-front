const state = {
    theme: "blue",
};

const getters = {
    currenttheme: state => state.theme
};

const actions = {
    set_theme_blue({commit}){
        commit('set_theme_blue');
    },
    set_theme_white({commit}) {
        commit('set_theme_white');
    },
    set_theme({commit}, theme){
        commit('set_theme', theme);
    }
};

const mutations = {
    set_theme_blue(state){
        state.theme = 'blue';
    },
    set_theme_white(state){
        state.theme= 'white';
    },
    set_theme(state, theme){
        state.theme=theme;
    }
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
