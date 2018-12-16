<template>
<div class="container">
  <div class="logo">
    <img src="@/assets/images/milife-icon-white.svg">
  </div>
  
  <div id="registration">
    <form>
      <ErrorMessage v-bind:error_message="error_message"/>
      <div v-if="step === 1">
        
        <h3>Tell us about yourself.</h3>
        <p><input class="text-input" id="first_name" name="first_name" v-model="registration.first_name" placeholder="First Name"></p>
        
        <p>
          <input class="text-input" id="last_name" name="last_name" v-model="registration.last_name" placeholder="Surname">
        </p>
        
        <button id="step1next" class="milife-button milife-button__next milife-button__fullsize" @click.prevent="next()">Next</button>
        
      </div>
      
      <div v-if="step === 2">
        <h3>Please set a password to protect your account</h3>
        
        <p>
          <input class="text-input" id="password" name="password" type="password" v-model="registration.password" placeholder="Password">
        </p>
        
        <p>
          <input class="text-input" id="confirmpassword" name="confirmpassword" type="password" v-model="registration.confirmpassword" placeholder="Confirm Password">
        </p>
        <p v-if="!this.passwordsMatch"> Passwords don't match !</p>
        <button id="step2prev" class="milife-button milife-button__prev milife-button__halfsize" @click.prevent="prev()">Previous</button>
        <button id="step2next" class="milife-button milife-button__next milife-button__halfsize" @click.prevent="next()">Next</button>
        
      </div>
      
      <div v-if="step === 3">
        <h3>How can we contact you?</h3>
        
        <p><input v-bind:class="{'text-input': true, 'has-error': errors.email}" id="email" name="email" type="email" v-model="registration.email" placeholder="Email"></p>
        <form-error v-if="errors.email" :errors="errors">
                        {{ errors.email }}
                    </form-error>
        <p><input class="text-input" id="number" name="number" type="text" v-model="registration.number" placeholder="Number"></p>
                <form-error v-if="errors.number" :errors="errors">
                        {{ errors.number }}
                    </form-error>

        
        
        <button id="step3prev" class="milife-button milife-button__prev milife-button__halfsize" @click.prevent="prev()">Previous</button>
        <button id="step3next" class="milife-button milife-button__next milife-button__halfsize" @click.prevent="submit()">Register</button>
        
      </div>
    </form>  
  </div>
</div>
</template>

<script>
  import ErrorMessage from '@/components/ErrorMessage.vue'
  import FormError from '@/components/FormError.vue'

export default {
    name: "Registration",
    components: {
        'ErrorMessage': ErrorMessage,
        'FormError': FormError
    },
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
            },
            error_message: "",
            errors: {},
        }
    },
    computed: {
        passwordsMatch: function(){
            return this.registration.password === this.registration.confirmpassword;
        },
    },
    methods: {
        prev() {
            this.step--;
        },
        next() {
            if (this.passwordsMatch){
                this.step++;
            }
        },
        submit() {
            let userdata = {
                first_name: this.registration.first_name,
                last_name: this.registration.last_name,
                password: this.registration.password,
                email: this.registration.email,
                number: this.registration.number
            }
            console.log
            this.$store.dispatch('auth/register', userdata)
                .then(resp => {
                    this.$router.push('/');
                    this.error_message = "";
                    this.errors = {};

                })
                .catch(err => {
                    console.log(err.response.data);
                    this.error_message = err.response.data['errors'][0]['message'];
                    //this.$set('errors', err.response.data);
                    this.errors = err.response.data
                    var errors = {}
                    err.response.data['errors'].forEach((element, index, array) =>{
                        errors[element['field']] = element['message']   
                    });
                    this.errors = errors;
                    
                });
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

<style lang="scss">
  .has-error{
  border: 3px solid $milife-magenta;
  }
</style>
