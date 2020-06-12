<template>
<div id="my-profile-edit-container"
     v-if="profile_api_status=='success'"
     >
  <h3 class="fc-white"> Edit Profile Details </h3>
  <div class="cropped-profile-photo">
    <img class="profile-photo" :src="profile.image" v-if="profile.image!=null"/>
    <img class="profile-photo" src="@/assets/images/placeholder-profile.png" v-else/>
  </div>
  
  <div class="pd-10"
    v-on:click="goto_update_profile_picture">
    Update Profile Picture <div class="arr-right fc-green"> </div>
  </div>

  <div class="genderselect">
    <multiselect
      v-model="gender"
      placeholder="Gender"
      :options="gender_options"
      label="label"
      track-by="value"
      >
    </multiselect>
  </div>

  <div>
    <datepicker
      wrapper-class="datepicker"
      input-class="text-input date_input"
      v-model="date_of_birth"
      format="dd/MM/yyyy"
      :typeable="false"
      placeholder="Select Date of Birth"
      >
    </datepicker>
  </div>

  <HeightInput 
    v-model="height_retrieved"
    :height_retrieved_from_User="height_retrieved"
    ></HeightInput>

  <WeightInput 
    v-model="weight_retrieved"
    :weight_retrieved_from_User="weight_retrieved"
    ></WeightInput>

  <button v-promise-btn class="button width-80 btn-save" v-on:click="update_profile">Save</button>


</div>
<div v-else> loading ... </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import Datepicker from 'vuejs-datepicker';
import HeightInput from "@/components/HeightInput.vue";
import WeightInput from "@/components/WeightInput.vue";

import moment from 'moment';
export default {
    name: "MyProfile",
    components: { Multiselect, Datepicker, HeightInput, WeightInput },
    props: [],
    data() {
        return {
            profile_api_status: null,
            profile: {
                image: "",
                is_staff: "",
                is_active: "",
                accuniq_id: "",
                email: "",
                first_name: "",
                last_name: "",
                number: "",
                gender: "",
                date_of_birth: "",

                height_cm: "",
                height_unit: "",

                weight_kg: "",
                weight_unit: "",
            },
            errors: {},
            gender_options: [
                {label: 'Male', value: 'M',},
                {label: 'Female', value: 'F'},
                {label: 'Would rather not say', value: 'N'},
            ],

        };
    },
    computed: {

        gender_options_d() {
            var d = {};
            for(var i=0; i < this.gender_options.length; i++) {
                d[this.gender_options[i]['value']] = this.gender_options[i];
            }
            return d;
        },

        gender: {
            get(){
                var val = this.profile.gender;
                return this.gender_options_d[val];
            },
            set(value){
                var d = Object.assign({}, value);
                this.profile.gender = d['value'];
            },
        },

        date_of_birth: {
            get() {return this.profile.date_of_birth ;},
            set(value) {this.profile.date_of_birth =  moment(value).format("YYYY-MM-DD");}
        },

        height_retrieved: {
            get() {
                return {
                    magnitude_si: this.profile.height_cm,
                    preferred_unit: this.profile.height_unit || 'metric',
                };
            },
            set(value) {
                this.profile.height_cm = value['magnitude_si'];
                this.profile.height_unit = value['preferred_unit'];
            }
        },

        weight_retrieved: {
            get() {
                return {
                    magnitude_si: this.profile.weight_kg ,
                    preferred_unit: this.profile.weight_unit  || 'metric',
                };
            },
            set(value) {
                this.profile.weight_kg = value['magnitude_si'];
                this.profile.weight_unit = value['preferred_unit'];
            }

        },
        payload: function(){
            return {
                gender: this.profile.gender,
                date_of_birth: this.profile.date_of_birth,
                height_cm: this.profile.height_cm,
                height_unit: this.profile.height_unit,
                weight_kg: this.profile.weight_kg,
                weight_unit: this.profile.weight_unit,
            }
        },

    },
    methods: {
        goto_update_profile_picture: function() {
            this.$router.push({name: "update-profile-picture"})
        },
        fetch_profile: function(){
            this.$http({url: process.env.VUE_APP_BASE_URL + '/api/me', method: 'GET' })
                .then(resp => {
                    this.profile = resp.data;
                    this.profile_api_status='success';
                    //resolve(resp);
                })
                .catch(err => {
                    this.profile_api_status="error";
                    //reject(err);
                });
        },
        update_profile: function(){
            this.$http(
                {
                    url: process.env.VUE_APP_BASE_URL + '/api/me/',
                    method: 'PATCH',
                    data: this.payload
                })
                .then(resp => {
                    this.$router.go(-1);

                    //resolve(resp);
                })
                .catch(err => {
                    this.profile_api_status="error";
                    //reject(err);
                });

        },

    },
    created() {
        this.$store.dispatch("theme/set_theme_blue");
        this.fetch_profile();
    },
    mounted(){

    },
}
</script>

<style lang="scss">
#my-profile-edit-container {
    display: grid;
    align-items: center;
    justify-items: center;
    grid-template-columns: 1fr;
    grid-gap: 15px;

    .genderselect {
        width: 300px;

        .multiselect__select {
            z-index: 2;
            width: 100px;
            height: 45px;
        }
        .multiselect__tags {
            border-radius: 50px;
        }
        .multiselect__single {
            line-height: 30px;
        }
    }

    *.datepicker {
        color: $milife-green;
        margin: 0 auto;
        width: 100%;
        span.cell:hover{
        }
        span.cell:active{
            color: white;
            background-color: $milife-green;
        }
        * {
            color: #000;
        }
    }
    .date_input{
        margin: 10px 0px;
        height: 45px;
        font-size: calc(15px + 0.5vmin);
    }
    .profile-photo {
        height: 200px;
    }
    .btn-save{
        width: 250px;
        padding: 0px;
        line-height: 2.5;
        margin: 20px 0px;
        color: #fff;
    }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
