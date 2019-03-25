import axios from "axios";
import moment from "moment";
import { getField, updateField, createHelpers } from 'vuex-map-fields';

const getDefaultCheckinState = () => {
    return {
        waist: 0,
        hips: 0,
        chest: 0,
        shoulders: 0,
        left_arm: 0,
        right_arm: 0,
        left_leg: 0,
        right_leg: 0,
    };
};

const state = {
    user_id: '',
    measurements: getDefaultCheckinState(),
    checkin_date: new Date(),
    photo_front_profile: null,
    photo_side_profile: null,
    id: null,
};


const getters = {
    getField,
    getCheckinDate(state){return state.checkin_date;},
};

const actions = {
    fetch_checkin_for_user_by_date({state, commit}){
        const endpoint = "/api/users/" + state.user_id + "/checkin/" + moment(state.checkin_date).format("YYYY-MM-DD");
        console.log(state, endpoint);
        const url = process.env.VUE_APP_BASE_URL + endpoint;
        axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
        return new Promise((resolve, reject) => {
            axios({url: url, method: 'GET'})
                .then(resp => {
                    commit('CHECKIN_FETCH_SUCCESS', resp.data);
                    resolve(resp);
                }).catch(err => {
                    reject(err);
                });
        });

    },

    upsert_checkin({commit, state}){
        axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
        var payload = {...state.measurements};
        var formatted_date = moment(state.checkin_date).format("YYYY-MM-DD");
        payload['date_of_checkin'] = formatted_date;

        var method = 'POST';
        var endpoint = "/api/users/" + state.user_id + "/checkin";
        if (state.id) {
            console.log(state.id);
            method = 'PATCH';
            endpoint = "/api/users/" + state.user_id + "/checkin/" + formatted_date;
        }

        const url = process.env.VUE_APP_BASE_URL + endpoint;

        let formData = new FormData();
        for(var key in payload){
            formData.append(key, payload[key]);
        }
        formData.append('photo_front_profile',state.photo_front_profile );
        formData.append('photo_side_profile', state.photo_side_profile);
        console.log(payload);
        return new Promise((resolve, reject) => {
            axios({
                url: url,
                data: formData,
                method: method,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: function( progressEvent ) {
                    this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
                }.bind(this)
            })
                .then(resp => {
                    console.log('success', resp.data);
                    resolve(resp);
                }).catch(err => {
                    console.log('failure', err)
                    reject(err);
                });
        });

    },
};

const mutations = {
    updateField,

    update_checkin_date_field(state, field){
        state.checkin_date = moment(field).format("YYYY-MM-DD");
    },

    CHECKIN_FETCH_SUCCESS(state, data){
        state.measurements.waist = data.waist;
        state.measurements.hips = data.hips;
        state.measurements.chest = data.chest;
        state.measurements.shoulders = data.shoulders;
        state.measurements.left_arm = data.left_arm;
        state.measurements.right_arm = data.right_arm;
        state.measurements.left_leg = data.left_leg;
        state.measurements.right_leg = data.right_leg;

        state.id = data.id;
        state.photo_front_profile = data.photo_front_profile;
        state.photo_side_profile = data.photo_side_profile;
    },

    CHECKIN_FETCH_404(state){

    },

    INITIALIZE(state, payload) {
        state.checkin_date = moment(payload.date).format("YYYY-MM-DD");
        Object.assign(state, {
            user_id:  payload.user_id,
            measurements: {
                waist: 0,
                hips: 0,
                chest: 0,
                shoulders: 0,
                left_arm: 0,
                right_arm: 0,
                left_leg: 0,
                right_leg: 0,


            },
            id: null,
            photo_front_profile: null,
            photo_side_profile: null,

        });

    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
};
