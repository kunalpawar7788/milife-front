<template>
  <div>
    <h1>Confirm your email address</h1>
    <h3>We sent a confirmation email to {{}}</h3>
    <h3>Check your email and click on the confirmation link to continue</h3>
    <button>Resend Email</button>
  </div>
  
</template>

<script>
export default {
    name: "ConfirmEmail",
    data() {
        return {
            first_name: '',
            last_name: '',
            email: '',
        }
    },
    created: function(){
    }
}
</script>

<style> </style>
