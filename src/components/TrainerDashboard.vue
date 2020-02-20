<template>
<div class="trainer-dashboard">
  <section class="slab1">
    <div class="slab1">
      <div class="usercounts">
        <img class="image" id="icon-active" src="@/assets/images/activated-users.svg"/>
        <div class="count" id="count-active">{{status_d.active}}</div>
        <div class="label" id="label-active" v-on:click="goto_active_users">ACTIVE <br/> USERS</div>

        <img class="image" id="image-waiting" src="@/assets/images/invitation-waiting.svg"/>
        <div class="count" id="count-waiting">{{status_d.waiting}}</div>
        <div class="label" id="label-waiting" v-on:click="goto_waiting_users">WATING <br/> CONFIRMATION</div>
      </div>
      <div class="user-list-link">
        <router-link :to="{name: 'user-list'}">View All Users ></router-link>
      </div>
    </div>
  </section>
  <div id="td-adduser" v-on:click="goto_add_user">
    <span> </span>
    <span class="cta">ADD USER</span>
    <span class="arrow"> > </span>
  </div>
  <div id="td-inviteuser" v-on:click="goto_invite_user">
    <span> </span>
    <span class="cta"> SEND INVITATION</span>
    <span class="arrow"> > </span>
  </div>

  <div id="td-search">
      <p>Search A User</p>
      <input
        class="text-input"
        required v-model="search_param"
        placeholder="start typing to search"
        v-on:keyup.enter="goto_search_user"
        />
  </div>
  <div id="td-upload-csv" v-on:click="goto_upload_csv">
    <span> </span>
    <span class="cta">UPLOAD CSV</span>
    <span class="arrow"> + </span>
  </div>

</div>
</template>

<script>
export default {
    name: 'TrainerDashboard',
    data() {
        return {
            status_d: {},
            email: null,
            errors: null,
            search_param: "",
        }
    },
    components: {
    },
    methods: {
        goto_upload_csv: function(){
            this.$router.push({name: 'upload-csv'});
        },
        goto_add_user: function(){
            this.$router.push({name: 'add-user'});
        },
        goto_invite_user: function(){
            this.$router.push({name: 'pending-invitations'});
        },
        goto_search_user: function(){
            this.$store.dispatch('temps/set_user_search_param', this.search_param);
            this.$router.push({name: 'user-list'});
        },
        goto_waiting_users: function(){
            this.$router.push({name: 'waiting-users'});
        },
        goto_active_users: function(){
            this.$router.push({name: 'active-users'});
        },
        invitation_status_count: function(){
            const url = process.env.VUE_APP_BASE_URL+'/api/counts/email_verification_status';
            return new Promise((resolve, reject) => {
                this.$http({url: url, params:this.params, method: 'GET'})
                    .then(resp => {
                        this.errors={};
                        this.step=2;
                        this.status_d = resp.data;
                    })
                    .catch(err => {
                        err.response.data['errors'].forEach((element, index, array) =>{
                            errors[element['field']] = element['message']
                        });
                        this.errors = errors;
                    });
            });
        }
    },
    mounted() {
        this.invitation_status_count();
    }
}
</script>

<style lang="scss">

.trainer-dashboard {
    * {
        color: white;
    }
    section.slab1{
        background-color: $milife-blue;
        border-radius: 20px;
        padding: 10px;
    }

    /* .slab1 { */
    /*     border: 1px solid white; */
    /*     padding: 10px; */
    /* } */
    .usercounts {
        display: grid;
        grid-template-columns: 2fr 1fr 5fr;
        background-color: $milife-blue;
        padding-top: 20px;
        padding-bottom: 20px;
        border-radius: 20px;
        height: 20%;
    }
    .usercounts>.count{
        font-size: 30pt;
        justify-self: center;
        align-self: center;
        padding: 5px 2px;
        font-weight: bold;
    }
    .usercounts>.image {
        justify-self: end;
        align-self: center;
        padding: 5px 2px;
    }
    .usercounts>.label {
        justify-self: start;
        text-align: left;
        align-self: center;
        font-size: 10pt;
        color: $milife-magenta;
        padding: 5px 2px;
    }
    #td-adduser {
        font-size: 20pt;
        text-align: left;
        background-color: $milife-green;
        border-radius: 10px;
        display: grid;
        grid-template-columns: 1fr 10fr 1fr;
        padding: 10px;
        margin: 20px 2px;
    }

    #td-inviteuser {
        font-size: 20pt;
        text-align: left;
        background-color: $milife-green;
        border-radius: 10px;
        display: grid;
        grid-template-columns: 1fr 10fr 1fr;
        padding: 10px;
        margin: 20px 2px;

    }

    #td-upload-csv {
        font-size: 20pt;
        text-align: left;
        background-color: $milife-magenta;
        border-radius: 10px;
        display: grid;
        grid-template-columns: 1fr 10fr 1fr;
        padding: 10px;
        margin: 20px 2px;
    }

    #td-search {
        height: 20%;
        background-color: $milife-grey;
        border-radius:10px;
        padding: 10px;
        font-size: 20pt;
    }
    #td-search>a>input{
        margin-top: 5px;
    }
    .user-list-link{
        margin: 10px 1px;
    }
}
</style>
