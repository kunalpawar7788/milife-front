<template>
<section class="user-add-edit-container">

  <PictureSelector
    v-model="image"
    v-on:cropping="cropping=true"
    v-on:cropped="cropping=false"
    :circle_stencil="true"
    > </PictureSelector>

<div v-if="cropping==false" class="components">
  <div class="email">
    <input
      :class="{'text-input': true, 'has-error': false}"
      type="text"
      v-model="email"
      placeholder="Email"
      >
  </div>

  <div class="first-name">
    <input class="text-input" type="text" v-model="first_name" placeholder="First Name">
  </div>

  <div class="last-name">
    <input
      class="text-input"
      type="text"
      v-model="last_name"
      placeholder="Surname"
      >
  </div>

  <div class="mobile">
    <input
      class="text-input"
      type="text"
      v-model="number"
      placeholder="Mobile Number"
      >
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

  <div class="dateofbirthselect">
    <datepicker
      required
      wrapper-class="datepicker"
      input-class="text-input"
      v-model="date_of_birth"
      format="dd/MM/yyyy"
      :typeable="false"
      placeholder="Select Date of Birth"
      >
    </datepicker>
  </div>

  <div class="is_staff">
    <label>Is staff(coach)</label>
    <input
      type="checkbox"
      v-model="is_staff"
      >
  </div>

  <div class="is_active">
    <label>Is active (inactive equals soft delete)</label>
    <input
      type="checkbox"
      default="true"
      v-model="is_active"
      >
  </div>


  <HeightInput
    v-model="height_retrieved"
    :height_retrieved_from_User="height_retrieved"
    ></HeightInput>

  <WeightInput
    v-model="weight_retrieved"
    :weight_retrieved_from_User="weight_retrieved"
    ></WeightInput>

  <div class="save">
      <div>
        <div id="error-box"><ErrorMessage v-bind:error_message="error_message"/></div>
        <button v-promise-btn class="button" v-on:click="upsert_user"> Save </button>
      </div>
  </div>
</div>

</section>
</template>

<script>
import Multiselect from 'vue-multiselect';
import Datepicker from 'vuejs-datepicker';
import HeightInput from "@/components/HeightInput.vue";
import WeightInput from "@/components/WeightInput.vue";
import PictureSelector from "@/components/PictureSelector.vue";
import ErrorMessage from '@/components/ErrorMessage.vue';
import formatDate from "@/mixins/formatDate.js";

export default {
    name: "UserAddEditComponent",
    components: { Multiselect, Datepicker, HeightInput, PictureSelector, WeightInput, ErrorMessage },
    props: ['fobj_user', ],
    mixins: [formatDate],
    data() {
        return {
            data: {
                image: "",
                is_staff: "",
                is_active: "true",
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
            error_message: "",
            gender_options: [
                {label: 'Male', value: 'M',},
                {label: 'Female', value: 'F'},
                {label: 'Would rather not say', value: 'N'},
            ],
            cropping: false,
        };
    },
    computed: {
        user() {
            var fobj_user = Object.assign({}, this.fobj_user);
            return fobj_user;
        },
        upsert_method() {
            return this.user.id? 'PATCH' : 'POST';
        },

        upsert_url() {
            var base_url = process.env.VUE_APP_BASE_URL+'/api/users';
            return this.user.id? base_url + "/" + this.user.id: base_url;
        },

        gender_options_d() {
            var d = {};
            for(var i=0; i < this.gender_options.length; i++) {
                d[this.gender_options[i]['value']] = this.gender_options[i];
            }
            return d;
        },

        gender: {
            get(){
                var val = this.data.gender || this.fobj_user.gender;
                return this.gender_options_d[val];
            },
            set(value){
                var d = Object.assign({}, value);
                this.data.gender = d['value'];
            },
        },

        date_of_birth: {
            get() { return this.data.date_of_birth || this.fobj_user.date_of_birth; },
            set(value) { this.data.date_of_birth =  this.backEndDateFormat(value); }
        },

        height_retrieved: {
            get() {
                return {
                    magnitude_si: this.data.height_cm || this.fobj_user.height_cm,
                    preferred_unit: this.data.height_unit || this.fobj_user.height_unit || 'metric',
                };
            },
            set(value) {
                this.data.height_cm = value['magnitude_si'];
                this.data.height_unit = value['preferred_unit'];
            }
        },

        weight_retrieved: {
            get() {
                return {
                    magnitude_si: this.data.weight_kg || this.fobj_user.weight_kg,
                    preferred_unit: this.data.weight_unit || this.fobj_user.weight_unit || 'metric',
                };
            },
            set(value) {
                this.data.weight_kg = value['magnitude_si'];
                this.data.weight_unit = value['preferred_unit'];
            }

        },

        image: {
            get(){return this.data.image || this.fobj_user.image;},
            set(value){
                if (value != this.fobj_user.image){
                    this.data.image=value;
                }
            },
        },

        is_staff: {
            get(){return this.data.is_staff || this.fobj_user.is_staff;},
            set(value){this.data.is_staff=value;},
        },

        is_active: {
            get(){return this.data.is_active || this.fobj_user.is_active;},
            set(value){this.data.is_active=value;},
        },

        accuniq_id: {
            get(){
                return this.data.accuniq_id || this.fobj_user.accuniq_id;
            },
            set(value){this.data.accuniq_id=value;},
        },

        email: {
            get(){return this.data.email || this.fobj_user.email;},
            set(value){this.data.email=value;},
        },

        first_name: {
            get(){return this.data.first_name || this.fobj_user.first_name;},
            set(value){this.data.first_name=value;},
        },

        last_name: {
            get(){return this.data.last_name || this.fobj_user.last_name;},
            set(value){this.data.last_name=value;},
        },

        number: {
            get(){return this.data.number || this.fobj_user.number;},
            set(value){this.data.number=value;},
        },
    },
    methods: {
        upsert_user: function(){
            let formData = new FormData();
            for(var key in this.data){
                if (key=="image") {continue;}
                if(this.data[key]){
                    formData.append(key, this.data[key]);
                };

            };
            if(this.data.image && typeof this.data.image != 'string'){
                formData.append('image', this.data.image, 'something.png');
            };
            return new Promise((resolve, reject) => {
                this.$http({url: this.upsert_url, data:formData, method: this.upsert_method})
                    .then(resp => {
                        this.status='success';
                        this.error_message="";
                        this.errors={};
                        this.$router.push({name: "user-list"});
                        resolve(resp);
                    })
                    .catch(err => {
                        this.status='error';
                        this.errors=err.response.data["errors"];
                        this.error_message = err.response.data['errors'][0]['field'] + " : " + err.response.data['errors'][0]['message'];
                        reject(err);
                    });
            });

        },

    },

    created() {
        var fobj_user = Object.assign({}, this.fobj_user);
        if(fobj_user.id) {
            this.data=fobj_user;
        };

    },

}
</script>

<style lang="scss">
section.user-add-edit-container {
    color: black;
    display: grid;
    *{
        color: black;
    }
    #error-box{
        text-align: right;
        padding-top: 15px;
        .errormessage{
            color: red;
        }
    }
    .components {
        display: grid; 
        grid-template-columns: 1fr 1fr 1fr;
        max-width: 100%;

        > div {
        max-width: fit-content;
        grid-column: 2;
        margin: 5px 0;
        padding: 2px 5px;
        }

        .email {
            grid-row: 1
        }
        .first-name {
            grid-row: 2;
        }
        .last-name {
            grid-row: 3;
        }
        .mobile {
            grid-row: 4;
        }
        .genderselect {
            grid-row: 5;
            display: grid;

            div {
                grid-column: 2/ span 1;
                width: 300px;
            }
            .multiselect__tags {
                border-radius: 50px;
            }
            .multiselect__select {
                width: 60px!important;
                margin-top: 5px;
            }
            .multiselect__tags {
                background: #efefef;
                height: 50px;
                line-height: 30px;
                padding-left: 20px;
                font-size: 18px;
                font-weight: 400;

                input.multiselect__input {
                    background: #efefef;
                }
            }
            .multiselect__single {
                line-height: 30px;
                background: #efefef;
            }
        } 
        .dateofbirthselect {
            grid-row: 6;
            display: grid;

            div {
                grid-column: 2/ span 1;
            }
        }
        .is_staff {
            grid-row: 7;
            padding: 2px 13px!important;
            
            label {
                color: #fff;
                font-size: 15px;
            }
        }
        .is_active {
            grid-row: 8;
            padding: 2px 13px!important;
            
            label {
                color: #fff;
                font-size: 15px;
            }
        }
        .heightinput, .weightinput {
            display: inline-flex;
            width: inherit;
        }
        .save {
            button {
                grid-row: 11;
                width: 100px;
                height: 0px;
                line-height: 0;
            }
            > div {
                width: 300px;
            }
            div > input {
                grid-column: 2/ span 1;
            }
        }
    }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
