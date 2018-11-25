<template>
<div>
  <h1>Confirm your email address</h1>
  <h3>We sent a confirmation email to {{this.email}}</h3>
  <h3>Check your email and click on the confirmation link to continue</h3>
  <div v-if="this.email_sent"> One more mail sent, please check your inbox again. </div>
  <div v-else> 
    <button @click.prevent="resend_email()">Resend Email</button>
  </div>
</div>
</template>

<script>
import axios from 'axios';
import store from '@/store';
export default {
    name: "UserEmailVerificationPending",
    data() {
        return {
            email: store.getters['auth/email'],
            email_sent : false,
        }
    },
    methods: {
        resend_email() {
            console.log(store.getters['auth/email']);
            const url = process.env.VUE_APP_BASE_URL+'/api/auth/resend_user_email_verification_mail';
            axios({url: url, data:{email: this.email}, method: 'POST'})
                .then(resp => {
                    //commit('email_verified');
                    this.email_sent = true;
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
}
</script>

<style> </style>
