<template>
<div id="login-container" class="width-100 height-100" v-on:keyup.enter="login">
  <div class="logo">
    <img src="@/assets/images/milife-icon-white.svg">
  </div>

  <input class="width-80 text-input" required v-model="email" type="email" placeholder="Email"/>

  <input class="width-80 mt-10 password-input text-input" required v-model="password" type="password" placeholder="Password" />

  <ErrorMessage v-bind:error_message="error_message"/>

  <div class="width-100">
    <button class="milife-button width-80 login-button" v-on:click="login">
      <span class="ml-20">Login</span>
      <img class="mr-20" src="@/assets/images/next-arrow.svg">
    </button>

    <div class="anchors mt-20">
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
                    console.log(err);
                    if(err.response.status >= 500){
                        this.error = err;
                        this.error_message = "Something went wrong !! Please try after sometime."
                    }
                    else {
                        this.error = err;
                        this.error_message = err.response.data['errors'][0]['message'];
                        console.log(this.error_message);
                    }

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
    grid-template-rows: 4.5fr 1fr 1fr 1fr 2fr;
    align-items: center;
}

.login-button {
    display: inline-flex;
    justify-content: space-between;
}

.password-input {
    background: url($milife-pwd-key) no-repeat scroll 90% 50%;
    background-color: white;
}

.text-input {
    border: none;
    font-family: "Montserrat";
    font-size: 13pt;
    background-color: whitesmoke;
}

.text-input::placeholder {
    color: dimgray;
    opacity: 0.6;
}

</style>
