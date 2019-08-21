<template>
<div class="measurementsform-container" >
  <h3> Add Check in for {{fobj_user.first_name}}</h3>
  <div class="checkin-date">
    <datepicker
      wrapper-class="checkin-datepicker"
      input-class="text-input"
      v-model="checkin_date"
      format="dd/MM/yyyy"
      :typeable="false"
      placeholder="Select Date of Checkin"
      v-on:input="reload"
      >
    </datepicker>
  </div>
  
  <template v-if="!fetching">
    <div class="picture-input-side-profile">
      <PictureSelector
        v-model="photo_side_profile"
        id="side_profile"
        label="Side Profile"
        > </PictureSelector>
    </div>
    
    <div class="picture-input-front-profile">
      <PictureSelector
        v-model="photo_front_profile"
        id="front_profile"
        label="Front Profile"
        > </PictureSelector>
    </div>
    
    
    <table>
      <tr v-for="field in formfields">
        <td> {{field.label}}</td>
        <td> <NumberInput
               placeholder=""
               :min="0"
               step="0.01"
               :value="formdata[field.field_name]"
               v-on:input="update_value(field.field_name, $event)">
        </NumberInput> </td>
      </tr>
    </table>
  </template>
  <button class="button" v-on:click="submit"> Save </button>

</div>
</template>

<script>
import Datepicker from 'vuejs-datepicker'
import NumberInput from "vue-number-input"
import PictureSelector from '@/components/PictureSelector'
import moment from 'moment'

export default {
    name: "CheckinForm",
    props: ['fobj_user', ],
    components: {Datepicker, PictureSelector, NumberInput},
    data() {
        return {
            formfields: [
                {label: "Waist (inches)", field_name:"waist", value: ""},
                {label: "Hips (inches)", field_name:"hips", value: ""},
                {label: "Chest (inches)", field_name:"chest", value: ""},
                {label: "Shoulders (inches)", field_name:"shoulders", value: ""},
                {label: "Left Arm (inches)", field_name:"left_arm", value: ""},
                {label: "Right Arm (inches)", field_name:"right_arm", value: ""},
                {label: "Left Leg (inches)", field_name:"left_leg", value: ""},
                {label: "Right Leg (inches)", field_name:"right_leg", value: ""},
                {label: "Systolic BP", field_name:'systolic_blood_pressure', value: ""},
                {label: "Diastolic BP", field_name:'diastolic_blood_pressure', value: ""},
                {label: "Blood Sugar", field_name:'blood_sugar', value: ""},
                {label: " VO2 Max", field_name:'vo2_max', value: ""},
                {label: "Resting Heart Rate", field_name:'resting_heart_rate', value: ""},
                
            ],
            formdata: {
                waist: 0,
                hips: 0,
                chest: 0,
                shoulders: 0,
                left_arm: 0,
                right_arm: 0,
                left_leg: 0,
                right_leg:  0,
                systolic_blood_pressure: 0,
                diastolic_blood_pressure: 0,
                blood_sugar: 0,
                vo2_max: 0,
                resting_heart_rate:  0,
            },
            user_id: this.$route.params.pk,
            photo_side_profile: "",
            photo_front_profile: "",
            date_of_checkin: new Date(),
            id:null,
            fetching: true,
        }
    },
    computed: {
        user_pk() {
            return this.$route.params.pk;
        },
        base_url: function(){
            return process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk + "/checkin";
        },
        submit_url: function(){
            var date_str = moment(this.checkin_date).format("YYYY-MM-DD");
            return this.id? this.base_url + '/' + date_str: this.base_url;
        },
        computed_form_data: function(){
            var payload = {...this.formdata},
                formatted_date = moment(this.checkin_date).format("YYYY-MM-DD");
            
            payload['date_of_checkin'] = formatted_date;
            
            var formData= new FormData()
            for(var key in payload){
                formData.append(key, payload[key]);
            }
            if (this.photo_front_profile){
                formData.append('photo_front_profile',this.photo_front_profile, 'frontprofile.png' );
            }

            if(this.photo_side_profile){
                formData.append('photo_side_profile', this.photo_side_profile, 'sideprofile.png');
            }

            return formData;
        },
        
        submit_method: function(){
            return this.id? 'PATCH': 'POST'
        },
        
        checkin_date: {
            get(){
                return this.date_of_checkin;
            },
            set(value){
                this.date_of_checkin = value;
                this.fetch_checkin();
            },
        },
        
    },
    
    methods: {
        submit: function(){
            return new Promise((resolve, reject) => {
                this.$http({
                    url: this.submit_url,
                    data: this.computed_form_data,
                    method: this.submit_method,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                })
                    .then(resp => {
                        resolve(resp);
                        this.$router.go(-1);
                    }).catch(err => {
                        reject(err);
                    });
            });
        },
        
        set_data: function(data){
            console.log(data);
            this.$_.forEach(this.formdata, function(value, key){
                this.formdata[key] = data[key];
                console.log(key, data[key]);
            }.bind(this));
            
            this.photo_side_profile= data.photo_side_profile;
            this.photo_front_profile= data.photo_front_profile;
            this.id = data.id;
        },
        
        initialize: function(){
            this.$_.forEach(this.formdata, function(value, key){
                this.formdata[key] = 0;
            }.bind(this));
            this.photo_side_profile= "";
            this.photo_front_profile= "";
            this.id = null;
        },
        
        fetch_checkin: function(){
            var url = this.base_url + "/" + moment(this.checkin_date).format("YYYY-MM-DD")
            this.fetching=true;
            
            return new Promise((resolve, reject) => {
                this.$http({url: url, method: 'GET'})
                    .then(resp => {
                        this.set_data(resp.data);
                        this.fetching=false;
                        resolve(resp);
                    }).catch(err => {
                        this.initialize();
                        this.fetching=false;
                        // reject(err);
                    });
            });
                        
        },
        
        reload: function(){
            console.log('reloading ...');
        },
        update_value: function(field_name, value){
            console.log(value);
            this.formdata[field_name]=Number(value);
        },

    },

    mounted: function() {
        this.$store.dispatch("theme/set_theme_white");
        this.fetch_checkin();

    },

}
</script>

<style lang="scss">
.measurementsform-container{
    color: black;
    /* display: grid; */
    grid-template-columns: 2fr 2fr 1fr 2fr 2fr;
    grid-row-gap: 10px;
    grid-column-gap: 5px;

    h3 {
        grid-column: 1 / span 5;
    }

    .form-label{
        grid-column: 1 / span 2;
        justify-self: left;
    }
    .form-input{
        grid-column: 4/ span 2;
        input{
            text-align: center;
            width: 100%;
        }

    }
    .picture-input{
        width: 100%;
        height: 150px;
    }
    .picture-input-side-profile{
        grid-column: 4 / span 2;
        grid-row: 3;

    }

    .picture-input-front-profile{
        grid-column: 1 / span 2;
        grid-row: 3;
        width: 100%;
        height: 150px
    }
    .checkin-date{
        grid-column: 2 / span 3;
        justify-self: center;

    }
    .picture-input{
        grid-column: 1/ span 5;

    }
    *.checkin-datepicker {
        color: $milife-green;
        margin: 0 auto;
        width: 100%;
        span.cell:hover{
        }
        span.cell:active{
            color: white;
            background-color: $milife-green;
        }

    }

    .button{
        grid-column: 2/ span 3;
        height: 10px;
    }

}

</style>
