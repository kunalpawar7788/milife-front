<template>
<div class="container">
  <div class="logo">
    <img src="@/assets/images/milife-icon-white.svg">
  </div>

   <form class="loginform" @submit.prevent="login">
     <input class="email-input" required v-model="email" type="email" placeholder="your.name@example.com"/>
     <br>
     <input class="password-input" required v-model="password" type="password" placeholder="P@55W0r|)"/>
  <br>
  <MilifeButton type="submit">Log In</MilifeButton>
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
export default {
    components: {
        MilifeButton,
    },
  name: "Authentication",
      data() {
          return {
              email: "",
              password: ""
          }
      },
      
      
      methods: {
          login: function () {
              let email = this.email 
              let password = this.password
              this.$store.dispatch('auth/login', { email, password })
                  .then(() => this.$router.push('/'))
                  .catch(err => console.log(err))
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
        .email-input {
            border: none;
            border-radius: 50px;
            color: grey;
            height: 50px;
            padding-left: 20px;
            font-size: 15pt;
            font-family: Monteserrat Regular;
            width: 300px;
        }
        .password-input {
            border: none;
            border-radius: 50px;
            color: grey;
            margin-top: 20px;
            height: 50px;
            padding-left: 20px;
            font-size: 15pt;
            width: 300px;
            background-image: url($milife-pwd-key);
            background-repeat: no-repeat;
            background-position: 95% 50%;
            padding-right: 10px;
 
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
