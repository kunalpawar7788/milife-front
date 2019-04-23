<template>
<div class="manageuser-container">
  <loading :active.sync="is_loading"
           :can-cancel="false"
           :is-full-page="true"> </loading>

  <div class="cropped-profile-photo">
    <img class="profile-photo" :src="user.image" v-if="user.image!=null"/>
    <img class="profile-photo" src="@/assets/images/placeholder-profile.png" v-else/>
  </div>
  <div class="name"> {{user.first_name}} {{user.last_name}} </div>
  <div class="edit-link-container" v-on:click="goto_edit_user"> Edit details &nbsp &gt </div>
  <div class="link-sink-1">
    <span class="left-link" v-on:click="invite_user">
      <template v-if="fobj_user.invited"> Resend Invite &gt </template>
      <template v-else> Send Invite &gt</template>
    </span>
    <span class="right-link" v-on:click="goto_reset_password"> Reset Password &gt </span>
  </div>
  <div class="mu-buttons link-sink-2">
    <div id="mu-3" class="mb mb__full"><router-link :to="{name: 'programme-list', params:{pk: user.id}}"> Programmes </router-link> </div>
    <div id="mu-5" class="mb mb__full"><router-link :to="{name: 'progress-chart', params:{pk: user.id}}"> View Stats and Charts </router-link> </div>
    <div id="mu-9" class="mb"><router-link :to="{name: 'testview', params:{pk: user.id}}"> Meal Plan </router-link> </div>
    <div id="mu-1" class="mb"><router-link :to="{name: 'user-documents', params:{pk: user.id}}"> View Docs </router-link> </div>

  </div>

  <div class="mu-buttons link-sink-3">


    <div id="mu-6" class="mb mb__full"><router-link :to="{name: 'compose-message', params: {pk: user.id}}"> Message </router-link>  </div>
    <div id="mu-7" class="mb mb__full"><router-link :to="{name: 'add-checkin', params: {pk: user.id}}"> Add Checkin </router-link></div>
    <div id="mu-8" class="mb mb__full"><router-link :to="{name: 'testview', params: {pk: user.id}}"> Log Schedule Change </router-link> </div>

    <div id="mu-9" class="mb mb__full"><router-link :to="{name: 'target-weights', params:{'pk' : user.id}}"> Adjust Target Weights</router-link> </div>

  </div>
  <div class="link-sink-1">
    <span class="center">Delete User</span>

  </div>
</div>
</template>

<script>
import axios from 'axios';
import Loading from "vue-loading-overlay";
import 'vue-loading-overlay/dist/vue-loading.css';

export default {
    name: "ManageUser",
    props: ['fobj_user', ],
    components: {Loading, },
    computed: {
        user() {return this.fobj_user;},
        is_loading(){
            return this.status=="loading";
        },
    },

    methods: {
        goto_edit_user(){
            this.$router.push({name: "user-edit", params:{pk: this.user.id}});
        },

        invite_user(){
            this.status="loading"
            let errors = {};

            const url = process.env.VUE_APP_BASE_URL+'/api/auth/invite_user/';
            this.$http({url: url, data:{email: this.user.email}, method: 'POST'})
                .then(resp => {
                    this.status="ready"
                    this.error_message="";
                    this.errors={};

                })
                .catch(err => {
                    this.status="error"
                    err.response.data['errors'].forEach((element, index, array) =>{
                        errors[element['field']] = element['message']
                    });
                    this.errors = errors;
                });
        },

        goto_reset_password(){
            this.status="loading";
            const url = process.env.VUE_APP_BASE_URL+'/api/auth/password_reset/';
            this.$http({url: url, data:{email: this.user.email}, method: 'POST'})
                .then(resp => {
                    //commit('email_verified');
                    this.status="ready";
                    console.log("password reset mail sent")
                })
                .catch(err => {
                    this.status="error";
                    console.log(err.response);
                });
        },

    },
    data() {
        return {
            status: "",
            pk:  this.$route.params.pk,
        }
    },
    mounted() {
        console.log(this.user.id);
        this.$store.dispatch("theme/set_theme_blue");
    },
}
</script>

<style lang="scss">
.manageuser-container {
    img.profile-photo {
        display: inline;
        height: auto;
        /* max-width: 200px; */
        max-height: 200px;
        width: auto;
        margin: auto;
    }
    div.cropped-profile-photo {
        width: 200px;
        max-height: 200px;
        margin: auto;
        /* position: relative; */
        overflow: hidden;
        border-radius: 50%;
        background-color: black;
    }

    div.name {
        color: white;
        font-weight: 600;
        font-size: 25pt;
    }

    div.edit-link-container{
        color: white;
        margin-top: 20px;
        font-weight: normal;
        font-size: 16pt;
    }

    div.link-sink-1 {
        background-color: darken($milife-blue, 10%);
        height: 50px;
        border-radius: 2%;
        color: white;
        display: grid;
        grid-column-layout: 1fr 1fr;
        margin-top: 20px;

        font-size: 15pt;

        span {
            font-weight: 500;
            font-size: 16pt;
            place-self: center;
        }
        .left-link {
            grid-column: 1;
            color: $milife-green;
        }

        .right-link{
            grid-column: 2;
        }
    }

    div.link-sink-2 {
        padding-top: 10px;
        padding-bottom: 10px;

        font-size: 15pt;
    }


    div.link-sink-3 {
        background-color: darken($milife-blue, 10%);
        font-size: 15pt;
    }
}

.mu-buttons{
    display: grid;
    grid-template-columns: 1fr 1fr;
    padding-left: 30px;
    padding-right: 30px;
    border-radius: 20px;
    .mb {
        a {
            height: 30px;
            background-color: $milife-green;
            color: white;
            border-radius: 10px;
            margin: 10px;
            text-align: left;
            padding: 15px 0px 10px 1em;
            display: block;
        }

        a:hover {
            background-color: lighten($milife-green, 10%);
            color: darken(white, 10%);
        }
        a:active{
            background-color: darken($milife-green, 20%);
            color: lighten(white, 10%)
        }
    }

    .mb__full{
        grid-column: 1 / span 2;
    }

}

</style>
