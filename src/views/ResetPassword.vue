<template>
<div>
  <div v-if="!!token">
    <h1> Set New Password </h1>
    <form class="resetpassword" @submit.prevent="reset_password">
      <NewPassword v-model="newpassword"></NewPassword>
      <button type="submit">Change Password</button>
    </form>
  </div>
  <div v-else>
    <div v-if="!email_sent">
      <h1> Raise Password Change Request</h1>
      <form class="sendresetpasswordmail" @submit.prevent="send_reset_password_mail">
        <p><input id="email" name="email" type="email" v-model="email" placeholder="Email"></p>
        <button type="submit">Change Password</button>
      </form>
    </div>
    <div v-else>
      <h1> Email Sent</h1>
      <h2> Please check your inbox </h2>
    </div>
    <br/><br/>Debug: {{token}}, {{email_sent}}
  </div>
</div>
</template>

<script>
import axios from 'axios';
import store from '@/store';
import NewPassword from '@/components/NewPassword.vue';

export default {
    name: "ResetPassword",
    data() {
        return {
            email: '',
            email_sent : false,
            token: this.$route.params.token,
            newpassword: '',
        }
    },
    methods: {
        send_reset_password_mail() {
            const url = process.env.VUE_APP_BASE_URL+'/api/auth/password_reset';
            axios({url: url, data:{email: this.email}, method: 'POST'})
                .then(resp => {
                    //commit('email_verified');
                    this.email_sent = true;
                    console.log("password reset mail sent")
                })
                .catch(err => {
                    console.log(err);
                });
        },
        reset_password(){
            const url = process.env.VUE_APP_BASE_URL+'/api/auth/password_reset_confirm';
            const data = {token: this.token, new_password: this.newpassword}
            axios({url: url, data:data, method: 'POST'})
                .then(resp => {
                    //commit('email_verified');
                    console.log("password changed")
                    this.$router.push('/login')
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    components: {NewPassword}
}
</script>

<style> </style>

