<template>
<div id="login-container" class="width-100 height-100">
  <div class="logo">
    <img src="@/assets/images/milife-icon-white.svg">
  </div>

  <input class="width-80 text-input" required v-model="email" type="email" placeholder="your.name@example.com"/>

  <input class="width-80 password-input text-input" required v-model="password" type="password" placeholder="P@55W0r|)"/>

  <ErrorMessage v-bind:error_message="error_message"/>

  <div class="width-100">
    <button class="milife-button width-80 " v-on:click="login">Log In</button>

    <div class="anchors mt-10">
      <router-link :to="{ name: 'sign-up'}">Sign Up</router-link>
      <span class="separator-pipe"> | </span>
      <router-link :to="{ name: 'reset-password-request'}">Reset Password</router-link>
    </div>
  </div>
</div>
</template>

<script>
import store from '@/store';
import ErrorMessage from '@/components/ErrorMessage.vue'

export default {
    components: {
        ErrorMessage,
    },
    name: "Authentication",
    data() {
        return {
            email: "",
            password: "",
            error_message: "",
            error: null,
        }
    },

    methods: {
        login: function () {
            let email = this.email
            let password = this.password
            this.$store.dispatch('auth/login', { email, password })
                .then(() => this.$router.push('/'))
                .catch(err =>{
                    this.error = err;
                    console.log(err)
                    this.error_message = err.response.data['errors'][0]['message'];
                    console.log(this.error_message);
                })
        }
    },
    created: function(){
        if(store.getters['auth/isAuthenticated']){
            this.$router.push('/')
        }
    }
}
</script>

<style lang="scss">

#login-container {
    display: grid;
    justify-items: center;
    grid-gap: 10px;
    grid-template-rows: 5fr 1fr 1fr 1fr 2fr;
    align-items: center;
}

</style>
