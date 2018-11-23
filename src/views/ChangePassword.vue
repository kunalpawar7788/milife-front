<template>
  <div>
    <h1> Change Password </h1>
       <form class="changepassword" @submit.prevent="changepassword">
    <p> <input name="currentpassword" v-model="currentpassword" id="currentpassword" type="password" placeholder="Current Password"/></p>
    <p> <input name="newpassword" v-model="newpassword"  id="newpassword" type="password" placeholder="New Password" /></p>
    <p> <input name="confirmpassword" v-model="confirmpassword"  id="confirmpassword" type="password" placeholder="Confirm Password" /></p>
    <button type="submit">Change Password</button>
    </form>
  </div>
</template>

<script>
export default {
    name: "ChangePassword",
    data() {
        return {
            currentpassword: '',
            newpassword: '',
            confirmpassword: '',
        }
    },
}
</script>

<style> </style>
