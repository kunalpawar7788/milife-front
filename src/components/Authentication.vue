<template>
 <div>
   <form class="login" @submit.prevent="login">
     <h1>Sign in</h1>
     <input required v-model="email" type="email" placeholder="your.name@example.com"/>
     <input required v-model="password" type="password" placeholder="P@55W0r|)"/>
     <hr/>
     <button type="submit">Login</button>
   </form>
   <router-link :to="{ name: 'sign-up'}">Click here to sign-up instead.</router-link>
 </div>
</template>

<script>
  import store from '@/store';
  export default {
  name: "Authentication",
      data() {
          return {
              email: "",
              password: ""
          }
      },
      
      components: {},
      
      methods: {
          login: function () {
              let email = this.email 
              let password = this.password
              this.$store.dispatch('auth/login', { email, password })
                  .then(() => this.$router.push('/'))
                  .catch(err => console.log(err))
              this.$router.push('/')
          }
      },
      created: function(){
          if(store.getters['auth/isAuthenticated']){
              this.$router.push('/')
          }
    }
  }
</script>

<style>

</style>
