<template>
<div v-if="step === 1"> verifying ... </div>
<div v-else-if="step === 2">
  <h1>Thank You</h1>
  <h3>Your Email is confirmed</h3>
  <router-link :to="{ name: 'home'}" class="button">Set me up for success</router-link>w3
</div>

<div v-else-if="step === 3"> oops something went wrong, try again? </div>

</template>

<script>
import store from '@/store';
export default {
    name: "VerifyUserEmail",
    data() {
        return {
            // 1: mail sent, 2: verifying, 3: verified.
            step: 1,
        }
    },
    created: function(){
        const url = process.env.VUE_APP_BASE_URL+'/api/auth/verify_user_email';
        const token = this.$route.params.token;
        this.$http({url: url, data:{token: token}, method: 'POST'})
            .then(resp => {
                //commit('email_verified');
                this.step=2;
                //this.$router.push('/')
            })
            .catch(err => {
                this.step=4;
            });
        if (store.getters['auth/fetch_profile_flag']){
            console.log('dispatching fetch profile');
            store.dispatch("auth/fetch_profile");
        }
    },
    mounted() {
        this.$store.dispatch("theme/set_theme_blue");
    },

}

</script>

<style> </style>
