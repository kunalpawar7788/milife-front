    <template>
    <div class="container">
    <div v-if="!!token">
    <div class="logo">
    <img src="@/assets/images/milife-icon-white.svg">
    </div>

    <div v-if="!password_changed">
    <h1> Please choose your new password</h1>
    <form class="resetpassword" @submit.prevent="reset_password">
    <NewPassword v-model="newpassword"></NewPassword>
    <p>{{error_message}}</p>
    <button class="milife-button milife-button__fullsize" type="submit">Change Password</button>
    </form>
    </div>
    <div v-else>
    <h1>Password Changed Successfully</h1>
    Please <router-link :to="{ name: 'login'}">click here</router-link> to login with your new password.
    </div>
    </div>
    
    <div v-else>
    <div class="logo"> <img src="@/assets/images/confirm-email-icon.svg"></div>
    <div v-if="!email_sent">
    <h1> Reset Your Password?</h1>
    <p> You can reset your password by providing your registered email address below: </p>
    <form class="sendresetpasswordmail" @submit.prevent="send_reset_password_mail">
    <p><input class="text-input" id="email" name="email" type="email" v-model="email" placeholder="Email"></p>
    <button class="milife-button milife-button__fullsize" type="submit">Change Password</button>
    </form>
    </div>
    <div v-else>      
    <h1> Email Sent</h1>
    <h2> Please check your inbox </h2>
    </div>    
    </div>
    </div>
    </template>

    <script>
    import axios from 'axios';
import store from '@/store';
import NewPassword from '@/components/NewPassword.vue';

export default {
    name: "ResetPassword",
    data() {
        return {
            // state -> start, emailsent, linkclicked, passwordchanged
            email: '',
            email_sent : false,
            password_changed: false,
            token: this.$route.params.token,
            newpassword: '',
            error_message: '',
        }
    },
    methods: {
        send_reset_password_mail() {
            const url = process.env.VUE_APP_BASE_URL+'/api/auth/password_reset';
            axios({url: url, data:{email: this.email}, method: 'POST'})
                .then(resp => {
                    //commit('email_verified');
                    this.email_sent = true;
                    console.log("password reset mail sent")
                })
                .catch(err => {
                    console.log(err.response);
                });
        },
        reset_password(){
            const url = process.env.VUE_APP_BASE_URL+'/api/auth/password_reset_confirm';
            const data = {token: this.token, new_password: this.newpassword}
            axios({url: url, data:data, method: 'POST'})
                .then(resp => {
                    //commit('email_verified');
                    console.log("password changed")
                    this.password_changed = true;
                })
                .catch(err => {
                    console.log(err);
                    this.error_message = err.response.data['errors'][0]['message'];

                });
        }
    },
    components: {NewPassword}
}
</script>

    <style> </style>

