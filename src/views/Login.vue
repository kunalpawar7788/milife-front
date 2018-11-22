<template>
 <div>
   <form class="login" @submit.prevent="login">
     <h1>Sign in</h1>
     <label>Email</label>
     <input required v-model="email" type="email" placeholder="your.name@example.com"/>
     <label>Password</label>
     <input required v-model="password" type="password" placeholder="P@55W0r|)"/>
     <hr/>
     <button type="submit">Login</button>
   </form>
 </div>
</template>

<script>
export default {
    name: "Login",
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
      }
    }
  }
</script>

<style>

</style>
