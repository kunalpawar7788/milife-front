import axios from "axios";
import moment from "moment";
import { getField, updateField, createHelpers } from 'vuex-map-fields';

const getDefaultState = () => {
    return {
        };
};

const state = {checkin: getDefaultState()};

const getters = {
    getField,

};

const actions = {
};

const mutations = {
    updateField,

    INITIALIZE(state) {
        Object.assign(state, {});
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
