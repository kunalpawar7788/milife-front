<template>
<div class="manageuser-container ">
  <loading :active.sync="is_loading"
           :can-cancel="false"
           :is-full-page="true"> </loading>

  <div class="cropped-profile-photo">
    <img class="profile-photo" :src="user.image" v-if="user.image!=null"/>
    <img class="profile-photo" src="@/assets/images/placeholder-profile.png" v-else/>
  </div>
  <div class="name"> {{user.first_name}} {{user.last_name}} </div>

  <div
    class="edit-link-container fn-12"
    v-on:click="goto_edit_user"> Edit details <div class="arr-right"> </div>
  </div>
  <div class="link-sink-1">
    <span class="left-link fn-12" v-on:click="invite_user">
      <template v-if="fobj_user.invited"> Resend Invite  </template>
      <template v-else> Send Invite <div class="arr-right"> </div> </template>
    </span>
    <span class="right-link fn-12"
          v-on:click="goto_reset_password"> Reset Password
      <div class="arr-right"> </div>
    </span>
  </div>
  <WeightSummaryCard :fobj_user="user"> </WeightSummaryCard>
  <div class="mu-buttons link-sink-2">
    <div id="mu-3" class="mb mb__full fn-12"><router-link :to="{name: 'programme-list', params:{pk: user.id}}"> Programmes </router-link> </div>
    <div id="mu-5" class="mb mb__full fn-12"><router-link :to="{name: 'progress-chart', params:{pk: user.id}}"> View Stats and Charts </router-link> </div>
    <div id="mu-9" class="mb fn-12"><router-link :to="{name: 'mealplan-edit', params:{pk: user.id}}"> Meal Plan </router-link> </div>
    <div id="mu-1" class="mb fn-12"><router-link :to="{name: 'user-documents', params:{pk: user.id}}"> View Docs </router-link>
    </div>


  </div>

  <div class="mu-buttons link-sink-3">
    <div id="mu-6" class="mb mb__full fn-12"><router-link :to="{name: 'compose-message', params: {pk: user.id}}"> Message </router-link>  </div>
    <div id="mu-7" class="mb mb__full fn-12"><router-link :to="{name: 'add-checkin', params: {pk: user.id}}"> Add Checkin </router-link></div>
    <div id="mu-8" class="mb mb__full fn-12"><router-link :to="{name: 'testview', params: {pk: user.id}}"> Log Schedule Change </router-link> </div>
    <div id="mu-9" class="mb mb__full fn-12 "><router-link :to="{name: 'bulk-weight-update', params:{'pk' : user.id}}"> Update Weight or Target</router-link> </div>
    <div id="mu-10" class="mb mb__full fn-12"><router-link :to="{name: 'checkin-dashboard', params: {pk: user.id}}"> Curate Checkins </router-link> </div>

  </div>

  <div class="link-sink-1">
    <span class="center fn-12 fc-magenta" v-on:click="delete_user">Delete User</span>
  </div>
</div>
</template>

<script>
import Loading from "vue-loading-overlay";
import 'vue-loading-overlay/dist/vue-loading.css';
import WeightSummaryCard from "@/components/weight/WeightSummaryCard.vue";

export default {
    name: "ManageUser",
    props: ['fobj_user', ],
    components: {Loading, WeightSummaryCard},
    computed: {
        user() {return this.fobj_user;},
        is_loading(){
            return this.status=="loading";
        },
    },

    methods: {
        goto_edit_user: function(){
            this.$router.push({name: "user-edit", params:{pk: this.user.id}});
        },

        invite_user: function(){
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

        goto_reset_password: function(){
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

        delete_user: function(){
            this.$confirm("Are you sure?")
            .then(() => {
                this.status="loading";
                const url = process.env.VUE_APP_BASE_URL+'/api/users/'+ this.user.id;
                this.$http({url: url, data:{email: this.user.email}, method: 'DELETE'})
                    .then(resp => {
                        this.$router.push({name: 'user-list'});
                    })
                    .catch(err => {
                        this.status="error";
                    });
                })
            .catch(() => {
                console.log('Prompt dismissed');
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
        cursor: pointer;
    }

    div.link-sink-1 {
        background-color: darken($milife-blue, 10%);
        height: 50px;
        border-radius: 2%;
        color: white;
        display: grid;
        grid-column-layout: 1fr 1fr;
        margin-top: 20px;
        cursor: pointer;

        span {
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
    }


    div.link-sink-3 {
        background-color: darken($milife-blue, 10%);

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
            padding: 20px 0px 10px 1em;
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
