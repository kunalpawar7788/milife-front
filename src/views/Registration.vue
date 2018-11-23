<template>

<div id="registration">
  <form>
    <div v-if="step === 1">
      
      <h1>Tell us about yourself.</h1>
      <p><input id="first_name" name="first_name" v-model="registration.first_name" placeholder="First Name"></p>
      
      <p>
        <input id="last_name" name="last_name" v-model="registration.last_name" placeholder="Surname">
      </p>
      
      <button @click.prevent="next()">Next</button>
      
    </div>
    
    <div v-if="step === 2">
      <h1>Please set a password to protect your account</h1>
      
      <p>
        <input id="password" name="password" type="password" v-model="registration.password" placeholder="Password">
      </p>
      
      <p>
        <input id="confirmpassword" name="confirmpassword" type="password" v-model="registration.confirmpassword" placeholder="Confirm Password">
      </p>
      
      <button @click.prevent="prev()">Previous</button>
      <button @click.prevent="next()">Next</button>
      
    </div>
    
    <div v-if="step === 3">
      <h1>How can we contact you?</h1>
      
      <p><input id="email" name="email" type="email" v-model="registration.email" placeholder="Email"></p>
      <p><input id="number" name="number" type="text" v-model="registration.number" placeholder="Number"></p>
      
      
      <button @click.prevent="prev()">Previous</button>
      <button @click.prevent="submit()">Register</button>
      
    </div>
  </form>
  
  <br/><br/>Debug: {{registration}}
</div>
</template>

<script>
export default {
    name: "Registration",
    data() {
        return {
            step:1,
            registration:{
                first_name:null,
                last_name:null,
                password:null,
                confirmpassword:null,
                email:null,
                number:null,
            }
        }
    },
    methods: {
        prev() {
            this.step--;
        },
        next() {
            this.step++;
        },
        submit() {
            let userdata = {
                first_name: this.registration.first_name,
                last_name: this.registration.last_name,
                password: this.registration.password,
                email: this.registration.email,
                number: this.registration.number
            }
            this.$store.dispatch('auth/register', userdata)
                .then(() => this.$router.push('confirm-email'))
                .catch(err => console.log(err))
        }
    },
//     created: function(){
//     //beforeRouteUpdate (to, from, next) {
//         if (this.$store.getters['auth/isLoggedIn']) {
//             this.$router.push('/')
//         }
//     }
}
</script>

<style>
</style>
