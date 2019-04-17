<template>
<section class="add-user-container">
  <header><h3>Add New User </h3> </header>
  <div>
    <input
      class="text-input"
      type="text"
      v-model="email"
      placeholder="Email"
      >
    </input>
  </div>
  
  <div>
    <input
      class="text-input"
      type="text"
      v-model="first_name"
      placeholder="First Name"
      >
    </input>
  </div>
  
  <div>
    <input
      class="text-input"
      type="text"
      v-model="last_name"
      placeholder="Surname"
      >
    </input>
  </div>
  
  <div>
    <input
      class="text-input"
      type="text"
      v-model="number"
      placeholder="Mobile Number"
      >
    </input>
  </div>
  
  <div class="genderselect">
    <multiselect
      v-model="selected_gender"
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
      input-class="text-input"
      v-model="date_of_birth"
      format="yyyy-MM-dd"
      :typeable="true"
      placeholder="Select Date of Birth"
      >
    </datepicker>
  </div>
  
  <button class="button" v-on:click="add_user"> Create New User </button>
  <h3>
    <router-link :to="{name: 'home'}"> Cancel </router-link>
  </h3>
  
</section>
</template>

<script>
import Multiselect from 'vue-multiselect';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';

export default {
    name: "AddUserView",
    components: { Multiselect, Datepicker },
    data() {
        return {
            email: "",
            first_name: "",
            last_name: "",
            number: "",
            selected_gender: "",
            errors: {},
            date_of_birth: "",
            gender_options: [
                {label: 'Male', value: 'M',},
                {label: 'Female', value: 'F'},
                {label: 'Would rather not say', value: 'N'},
            ],
        };
    },
    methods: {
        add_user: function(){
            const url = process.env.VUE_APP_BASE_URL+'/api/users';
            var data = {
                email: this.email,
                first_name: this.first_name,
                last_name: this.last_name,
                number: this.number,
                gender: this.selected_gender['value'],
                date_of_birth: moment(this.date_of_birth).format("YYYY-MM-DD"),
            };
            this.$http({url: url, data:data, method: 'POST'})
                .then(resp => {
                    this.status='success';
                    this.error_message="";
                    this.errors={};
                    this.$router.go({name: 'home'});
                })
                .catch(err => {
                    this.status='error';
                    this.errors=resp.data;
                });
            
        },
        
    },
    
}
</script>

<style lang="scss">
section.add-user-container {
    color: black;
    *{
        margin: 5px;
        color: black;
    }
    input {
        border: 1px solid lighten(grey, 30%);
    }
}
</style>
