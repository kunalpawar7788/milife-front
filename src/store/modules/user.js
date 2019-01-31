import axios from "axios";
import moment from "moment";
import { getField, updateField, createHelpers } from 'vuex-map-fields';

//const state = {
// user: {},
// id = "",
// first_name: "",
// last_name: "",
// email: "",
// is_active: "",
// is_staff: "",
// email_verified: "",
const getDefaultState = () => {
    return {
            id: null,
            first_name: null,
            last_name: null,
            email: null,
            is_active: null,
            is_staff: null,
            email_verified: null,
            weight_kg: null,
            height_cm: null,
            height_unit: null,
            weight_unit: null,
            date_of_birth: null,
            image: null,
            gender: null,
        };
};

const genderOptions = () => {
    return {
        M: {label: 'Male', value: 'M',},
        F: {label: 'Female', value: 'F'},
        N: {label: 'Would rather not say', value: 'N'},
    };
};

const state = {user: getDefaultState()};

const getters = {
    getField,

    getGenderField(state){
        return genderOptions()[getField(state.gender)];
    },
    getDobField(state){return state.date_of_birth;},
};

const actions = {
    fetch_user({commit}, user_id){
        commit('INITIALIZE');
        const url = process.env.VUE_APP_BASE_URL+'/api/users/' + user_id;
        axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
        return new Promise((resolve, reject) => {
            axios({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    commit('USER_FETCH_SUCCESS', resp.data);
                    resolve(resp);
                }).catch(err => {
                    reject(err);
                });
        });

    },
    update_user({commit, state}){
        const url = process.env.VUE_APP_BASE_URL+'/api/users/' + state.user.id;
        axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');

        return new Promise((resolve, reject) => {
            axios({url: url, data: state.user, method: 'PATCH'})
                .then(resp => {
                    resolve(resp);
                }).catch(err => {
                    reject(err);
                });
        });

   },
};

const mutations = {
    updateField,

    update_date_of_birth_field(state, field){
        state.user.date_of_birth = moment(field).format("YYYY-MM-DD");
    },
    update_gender_field(state, field){
        state.user.gender = field['value'];
    },

    USER_FETCH_SUCCESS(state, data){
        Object.assign(state.user, data);
    },

    INITIALIZE(state) {
        Object.assign(state, {});
    },
};


// export const { mapFields: mapNameFields } = createHelpers({
//     getterType: `customer/name/getField`,
//     mutationType: `customer/name/updateField`,
// });

// export const { mapFields: mapDobFields } = createHelpers({
//     getterType: `user/getDobField`,
//     mutationType: 'user/updateDobField',
// });

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
