<template>
  <div>

    <div class="unitchoice">
    </div>
  <div class="feetin">
  </div>

  <div class="inches">
  </div>

  <div class="cm">
  </div>

  
    <input> <input>
    <input id="password" type="password" :value="password" placeholder="Password" @input="update_password($event.target.value)" ref="password">
  </p>
  
  <p>
    <input id="confirmpassword" type="password" :value="confirmpassword" placeholder="Confirm Password" @input="update_password($event.target.value)" ref="confirmpassword">
  </p>
  <p v-if="!this.passwordsMatch"> Passwords don't match !</p>

</div>

</template>

<script>

export default {
    name: 'HeightInput',
    data() {
        return {
            
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
