<template>
<div>
  <h1>Profile</h1>
  <div class="form">
  <form class="updateprofile" @submit.prevent="update_profile">
    <div class="genderinput"><multiselect
      v-model="selected"
      placeholder="Gender"
                                :options="gender_options">
      </multiselect>
              </div>
    <div class="heightinput"><input type="text"></div>
    <div class="weightinput"><input type="text"></div>

    <div class="birthdateinput"><datepicker></datepicker></div>

    
    <button type="submit">Update</button>
  </form>
  </div>
</div>
</template>


<script>
//import axios from 'axios';
//import store from '@/store';
import Multiselect from 'vue-multiselect'
import Datepicker from 'vuejs-datepicker';

export default {
    components: { Multiselect, Datepicker },
    
    name: "UpdateProfile",
    data() {
        return {
            gender_options: ['Male', 'Female', 'Would rather not say'],
            selected_gender: null,
            profile_data : {
                date_of_birth: "",
                weight_kg: "",
                weight_unit: "",
                height_cm: "",
                height_unit: "",
                gender: "",
            }
        }
        
    }
    }
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style>
  </style>
