<template>
<div>
  <h1> Change Password </h1>
  
  <form class="changepassword" @submit.prevent="change_password">
    <p> <input name="current_password" v-model="current_password" id="current_password" type="password" placeholder="Current Password"/></p>
    <NewPassword v-model="new_password"></NewPassword>
    <button class="milife-button milife-button__fullsize" type="submit">Change Password</button>
  </form>
</div>
</template>

<script>
import NewPassword from '@/components/NewPassword.vue';
import axios from 'axios';
import store from '@/store';

export default {
    name: "ChangePassword",
    data() {
        return {
            current_password: '',
            new_password: '',
            
        }
    },
    methods: {
        change_password(){
            const data = {current_password: this.current_password, new_password: this.new_password}
            store.dispatch('auth/change_password', data);
            this.$router.push('/');
            
        }
    },
    
    components: {
        NewPassword,
    }
}
</script>

<style> </style>
