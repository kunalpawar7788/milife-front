<template>
<div>
  <p>
    <input class="text-input" id="password" type="password" :value="password" placeholder="Password" @input="update_password($event.target.value)" ref="password">
  </p>
  
  <p>
    <input class="text-input" id="confirmpassword" type="password" :value="confirmpassword" placeholder="Confirm Password" @input="update_password($event.target.value)" ref="confirmpassword">
  </p>
  <p v-if="!this.passwordsMatch"> Passwords don't match !</p>

</div>

</template>

<script>

export default {
    name: 'NewPassword',
    data() {
        return {
            password: null,
            confirmpassword: null
            
        }
    },
    methods: {
        update_password(value){
            var password = this.$refs.password.value;
            var confirmpassword = this.$refs.confirmpassword.value;

            if (password != confirmpassword){
                password = ''
            }
            this.$emit('input', password);
        }
    },

    computed: {
        passwordsMatch: function(){
            return this.password === this.confirmpassword;
        },
    }
}
</script>
