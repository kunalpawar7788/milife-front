<template>
<div class="programme-add-edit-container grid-layout" v-if="status=='success'">
  <SelectedUserDisplay class="middle-column" :fobj_user="fobj_user"> </SelectedUserDisplay>

  <div>
    <input
      type="text"
      class="input text-input programme-title"
      v-model="programme_name"
      placeholder="Programme Title"
      >
  </div>
  
  <div>
    <datepicker
      wrapper-class="datepicker-container"
      class="start-datepicker"
      input-class="datepicker-input"
      calendar-class="datepicker-calendar"
      v-model="start_date"
      format="dd/MM/yyyy"
      :typeable="false"
      placeholder="Select Start Date"
      v-on:input="reload"
      >
    </datepicker>
  </div>
  
  <div>
    <datepicker
      wrapper-class="datepicker-container"
      class="end-datepicker"
      input-class="datepicker-input"
      v-model="end_date"
      format="dd/MM/yyyy"
      :typeable="false"
      placeholder="Select End Date"
      v-on:input="reload"
    >
    </datepicker>
  </div>
  
  <div>
    <multiselect
      wrapper-class="choicefield"
      class="select-coach"
      input-class="choicefield-input"
      v-model="coach"
      placeholder="Select Coach"
      :options="coach_options_l"
      label="first_name"
      track-by="id"
      >
    </multiselect>
  </div>
  
  <div>
    <multiselect
      wrapper-class="choicefield"
      class="active-choicefield"
      input-class="choicefield-input"
      v-model="active"
      placeholder="Active / Inactive"
      :options="Object.values(active_options_d)"
      label="label"
      track_by="bool"
      >
    </multiselect>
  </div>
  
  
  <div class="button save" v-on:click="upsert_programme()"> Save </div>
</div>
<div v-else>
  {{status}}
</div>

</template>

<script>
import formatDate from "@/mixins/formatDate.js";
import Datepicker from 'vuejs-datepicker';
import Multiselect from 'vue-multiselect';
import SelectedUserDisplay from '@/components/SelectedUserDisplay.vue';

export default {
    name: 'ProgrammeAddEdit',
    components: {Datepicker, Multiselect, SelectedUserDisplay},
    props: ['fobj_user'],
    mixins: [formatDate],
    computed: {
        user() {return this.fobj_user;},
        full_name() {
            return this.fobj_user.first_name + " " + this.fobj_user.last_name;
        },
        programme_pk() {
            // if document_id exists, edit the document or add it.
            return this.$route.params.programme_pk || '';
        },
        user_pk() {
            return this.$route.params.pk;
        },
        upsert_method() {
            return this.programme_pk? 'PATCH' : 'POST';
        },
        upsert_url() {
            var base_url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk + "/programmes";
            return this.programme_pk?  base_url + "/" + this.programme_pk: base_url;
        },
        
        coach_options_d(){
            // renders coaches
            var d = {};
            for(var i=0; i<this.coaches.length; i++) {
                d[this.coaches[i]['id']] = this.coaches[i];
            }
            return d;
        },
        coach_options_l() {
            return this.coaches;
        },
        programme_name: {
            get() {
                return this.programme.name;
            },
            set(value) {
                this.programme.name = value;
            },
        },
        start_date: {
            get() {
                return this.programme.start_date;
            },
            set(value) {
                this.programme.start_date = value;
            },
            
        },
        end_date: {
            get() {
                return this.programme.end_date;
            },
            set(value) {
                this.programme.end_date = value;
            },
            
        },
        
        coach: {
            get() {
                return this.coach_options_d[this.programme.coach] || {};
            },
            set(value) {
                var value = Object.assign({}, value)
                this.programme.coach = value['id'];                
            },
        },
        active: {
            get() {
                return this.active_options_d[this.programme.active] || {};
            },
            set (value) {
                var value = Object.assign({}, value);
                this.programme.active = value['value'];
            }
        },
    },
    data() {
        return {
            status: "initial",
            active_options_d: {
                true: {label:'Active', value: true},
                false: {label: "Inactive", value: false},
            },
            programme: {
                coach: '',
                start_date: '',
                end_date: '',
                name: '',
                active: false,
            },
            coaches: [],
        }
    },
    watch: {
        // call again the method if the route changes
        '$route': 'fetch_programme'
    },
    
    methods: {
        fetch_programme: function(user_pk, programme_pk){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + user_pk + "/programmes/" + programme_pk;
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.status='success';
                    this.error_message="";
                    this.errors={};
                    this.programme = resp.data;
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },
        
        fetch_coaches: function(){
            const url = process.env.VUE_APP_BASE_URL+'/api/coaches';
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.coaches = resp.data.results;
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },
        
        reload: function(){
            console.log('reloading ...');
        },
        
        upsert_programme: function(){
            return new Promise((resolve, reject) => {
                var data = this.programme;
                data['user'] = this.user_pk;
                data['start_date'] =  this.backEndDateFormat(this.programme.start_date);
                data['end_date'] =  this.backEndDateFormat(this.programme.end_date);
                
                this.$http({url: this.upsert_url, method: this.upsert_method, data: this.programme})
                    .then(resp => {
                        resolve(resp);
                        this.$router.go('-1');

                    })
                    .catch(err => {
                        this.status='error';
                        console.log(err);
                        reject(err);
                    });
            });
            
        },
    },
    created() {
        this.$store.dispatch("theme/set_theme_white");
        this.fetch_coaches();
        if (this.programme_pk) {
            this.status='loading';
            this.fetch_programme(this.$route.params.pk, this.programme_pk);
        }
        else{
            this.status = 'success';
        }
    },
}
</script>

<style lang="scss">
.grid-layout {
    display: grid;
}
.programme-add-edit-container {
    display: grid;
    grid-template-columns: 1fr 8fr 1fr;
    grid-row-gap: 10px;
    justify-items: center;

    div {
        color: #000;
        grid-column: 1/12;
    }
    input{
        border: 1px solid #fff;
    }

    .programme-title {
        grid-row: 2;
    }

    .datepicker-container, .choicefield {
        text-align: center;
    }

    .datepicker-input {
        @extend .text-input;
        border: none;
        font-family: "Montserrat";
        background: url(../../assets/images/chevron-down-solid.svg) 92% no-repeat, linear-gradient($milife-green) right no-repeat;
        background-size: 6%, 20% 100%;
        background-color: #efefef;
        cursor: pointer;
    }

    .datepicker-calendar {
        right: 0;
        left: 0;
        margin-right: auto;
        margin-left: auto;
        text-align: initial;
    }

    .start-datepicker {
        grid-row: 3;
    }

    .end-datepicker {
        grid-row: 4;
    }

    .multiselect__tags {
        border: none;
        padding: 0;
        z-index: 200;
    }

    .multiselect__select {
        background: $milife-green;
        content: url(../../assets/images/chevron-down-solid.svg);
        border-radius: 0 50px 50px 0;
        border-top: solid 1px #fff;
        border-bottom: solid 1px #fff;
        width:60px!important;
        padding: 15px;
        z-index: 3;
    }
    .multiselect__input, .multiselect__single  {
        background-color: #efefef;
        border: 1px solid #fff;
        border-radius: 50px 0 0 50px;
        width: 240px!important;//92% * 300px
    }

    .multiselect__select, .multiselect__input, .multiselect__single {
        color: #232323;
        height: 50px;
        text-indent: 20px;
        font-size: 14pt;
        font-weight: 500;
        font-family: 'Montserrat';
        outline: none;
        top: 0;
        &::placeholder {
            color: #232323;
            font-weight: 500;
            font-size: 14pt;
        }
    }

    .multiselect--active .multiselect__select{
        transform:none
    }
    .multiselect__single {
        padding: 14px 0;
    }

    .multiselect__input:focus,
    .multiselect__single:focus {
        border: 1px solid #fff!important;
        border-bottom-left-radius: 50px!important;
        border-top-left-radius: 50px!important;
    }

    .multiselect__content-wrapper {
        border-radius: 10px;
    }

    .select-coach {
        grid-row: 5;
        width:300px;
        margin-bottom: -8px;

        span.multiselect__single:empty::before {
            content: "Select Coach";
        }
    }

    .active-choicefield {
        grid-row: 6;
        width:300px;

        span.multiselect__single:empty::before {
            content: "Active/ Inactive";
        }
    }

    .save {
        grid-row: 7;
        line-height: 3em;
        color: #fff;
        margin-top: 15px;
    }
}
div {
    color: black;
}

</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>