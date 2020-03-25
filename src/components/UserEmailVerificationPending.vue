<template>
<div class="container">
  <div class="logo">
    <img src="@/assets/images/confirm-email-icon.svg">
  </div>

  <div>
    <h1>Confirm your email address</h1>
    <p>We sent a confirmation email to <strong> {{this.email}}</strong></p>
    <p>Check your email and click on the continuation link to continue</p>
    <div v-if="this.email_sent"> One more mail sent, please check your inbox again.</div>
    <div v-else>
      <button class="milife-button milife-button__fullsize" @click.prevent="resend_email()">Resend Email</button>
    </div>
  </div>
</div>
</template>

<script>
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
            const url = process.env.VUE_APP_BASE_URL+'/api/auth/resend_user_email_verification_mail/';
            return new Promise((resolve, reject) => {
                this.$http({url: url, data:{email: this.email}, method: 'POST'})
                    .then(resp => {
                        //commit('email_verified');
                        this.email_sent = true;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            });
        }
    },
}
</script>

<style lang="scss">
    div {
        color: black;
    }
    .milife-button{
        color : white;
        padding: 15px 30px;
    }

</style>
