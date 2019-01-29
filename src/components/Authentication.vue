<template>
<div class="container">
  <div class="logo">
    <img src="@/assets/images/milife-icon-white.svg">
  </div>

   <form class="loginform" @submit.prevent="login">
     <input class="text-input" required v-model="email" type="email" placeholder="your.name@example.com"/>
     <br>
     <input class="password-input text-input" required v-model="password" type="password" placeholder="P@55W0r|)"/>
     <br>
     <ErrorMessage v-bind:error_message="error_message"/>
  <button class="milife-button milife-button__fullsize" type="submit">Log In</button>
   </form>
   <div class="anchors">
     <router-link :to="{ name: 'sign-up'}">Sign Up</router-link>
     <span class="separator-pipe"> | </span>
     <router-link :to="{ name: 'reset-password-request'}">Reset Password</router-link>
   </div>

 </div>
</template>

<script>
import store from '@/store';
import MilifeButton from '@/components/Button.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

export default {
    components: {
        MilifeButton,
        ErrorMessage,
    },
    name: "Authentication",
    data() {
        return {
            email: "",
            password: "",
            error_message: "",
        }
    },

    methods: {
        login: function () {
            let email = this.email 
            let password = this.password
            this.$store.dispatch('auth/login', { email, password })
                .then(() => this.$router.push('/'))
                .catch(err =>{
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
.container{
    height: 100%;
    width: 100%;
    text-align: center;
    display: flex;
    align-item: center;
    justify-content: center;
    flex-direction: column;
    .loginform {
        margin-top: 150px;
        @media (max-height: 568px){
            margin-top: 50px;
        }
        .password-input {
            background-image: url($milife-pwd-key);
            background-repeat: no-repeat;
            background-position: 95% 50%;
            outline: none;
        }
    }
    .anchors {
        a {
        list-style-type: none;
        text-decoration: none;
        color: white;
        }
        .separator-pipe{
            margin: 0px 20px 0px 20px;

        }
    }
    
    @media screen and (max-width: 340px) {
        .login-btn, .password-input, .email-input{
            width: 273px !important;
            font-size: 12pt !important;
        }
    }
}



</style>
