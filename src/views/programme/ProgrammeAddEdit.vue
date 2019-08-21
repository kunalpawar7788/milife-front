<template>
<div class="programme-add-edit-container grid-layout" v-if="status=='success'">
  <SelectedUserDisplay class="middle-column" :fobj_user="fobj_user"> </SelectedUserDisplay>
  
  <div>
    <input
      type="text"
      class="input text-input"
      v-model="programme_name"
      placeholder="Programme Name"
      >
      </input>
  </div>
  
  <div>
    <datepicker
      wrapper-class="start-datepicker"
      input-class="text-input"
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
      wrapper-class="end-datepicker"
      input-class="text-input"
      v-model="end_date"
      format="dd/MM/yyyy"
      :typeable="false"
      placeholder="Select End Date"
      v-on:input="reload"
      >
    </datepicker>
  </div>
  
  <div class="choicefield">
    <p>Coach:</p>
    <multiselect
      v-model="coach"
      placeholder="Select Coach"
      :options="coach_options_l"
      label="first_name"
      track-by="id"
      >
    </multiselect>
  </div>
  
  <div class="active-choicefield">
    <multiselect
      v-model="active"
      placeholder="Active / Inactive"
      :options="Object.values(active_options_d)"
      label="label"
      track_by="bool"
      >
    </multiselect>
  </div>
  
  
  <div class="button" v-on:click="upsert_programme()"> Save </div>
</div>
<div v-else>
  {{status}}
</div>

</template>

<script>
import moment from "moment";
import Datepicker from 'vuejs-datepicker';
import Multiselect from 'vue-multiselect';
import SelectedUserDisplay from '@/components/SelectedUserDisplay';

export default {
    name: 'ProgrammeAddEdit',
    components: {Datepicker, Multiselect, SelectedUserDisplay},
    props: ['fobj_user'],
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
            console.log('trying to render coaches');
            var d = {};
            for(var i=0; i<this.coaches.length; i++) {
                console.log(i, this.coaches[i])
                d[this.coaches[i]['id']] = this.coaches[i];
            }
            console.log(d);
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
                data['start_date'] =  moment(this.programme.start_date).format("YYYY-MM-DD");
                data['end_date'] =  moment(this.programme.end_date).format("YYYY-MM-DD");
                
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
    grid-template-columns: 1fr 8fr 1fr;
    grid-row-gap: 10px;
    justify-items: center;

    div {
        grid-column: 2;
        width: 100%
        
    }
    input{
        border: 1px solid lighten(grey, 40%);
    }

}
div {
    color: black;
}

</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
