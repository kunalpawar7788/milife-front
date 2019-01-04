<template>
<div class="containter">
  <h1> Invite a new trainee </h1>
  <div id="step1" v-if="step===1">
    <div class="invitation">
      <form @submit.prevent="send_invitation">
        <p><input class="text-input" v-model="invite_data.first_name" placeholder="First Name"/></p>
        <p><input class="text-input" v-model="invite_data.last_name" placeholder="Last Name"/></p>
        <p><input v-bind:class="{'text-input': true, 'has-error': errors.email}" id="email" name="email" type="email" v-model="invite_data.email" placeholder="Email"></p>
        <form-error v-if="errors.email" :errors="errors">
          {{ errors.email }}
        </form-error>
        <button id="invitation-submit" class="milife-button milife-button__fullsize" type="submit"> Invite </button>        
      </form>
      
    </div>
  </div>
  <div id="step2" v-else-if="step===2">
    An invitation email has been sent to {{invite_data.first_name}} on {{invite_data.email}}.
  </div>
  
</div>

</template>

<script>
  import axios from 'axios';
import FormError from '@/components/FormError.vue';
export default {
    name: "Invitation",
    components: {
        'FormError': FormError
    },
    data() {
        return {
            invite_data: {
                first_name: '',
                last_name: '',
                email: '',
            },
            errors:{},
            step: 1,
        }
    },
    methods: {
        send_invitation(){
            let errors = {};
            const url = process.env.VUE_APP_BASE_URL+'/api/auth/invite_user/';
            axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
            axios({url: url, data:this.invite_data, method: 'POST'})
                .then(resp => {
                    this.error_message="";
                    this.errors={};
                    this.step=2;
                })
                .catch(err => {
                    
                    err.response.data['errors'].forEach((element, index, array) =>{
                        errors[element['field']] = element['message']   
                    });
                    this.errors = errors;
                    
                });
        }
    }
}

</script>

<style> </style>

