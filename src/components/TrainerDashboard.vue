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
  <div class="td_user-activity">
      <div id="td-adduser" v-on:click="goto_add_user">
        <span class="cta">ADD USER</span>
        <span class="arrow">
          <div class="code icon"></div>
        </span>
      </div>
      <div id="td-inviteuser" v-on:click="goto_invite_user">
        <span class="cta">INVITE USER</span>
        <span class="arrow">
          <div class="code icon"></div>
        </span>
      </div>
  </div>


  <div id="td-search">
      <p>Search A User</p>
      <input
        class="text-input text_input-td"
        required 
        v-model="search_param"
        placeholder="start typing to search"
        v-on:keyup.enter="goto_search_user"
        />
        <img class="image search-icon" id="image-waiting" src="@/assets/images/search-icon.svg" />
  </div>
  <div id="td-upload-csv" v-on:click="goto_upload_csv">
    <span> </span>
    <span class="cta">UPLOAD CSV</span>
    <span class="arrow"> + </span>
  </div>

  <div class="last-line flex-spacebetween">
    <section
      class="message-button bg-green fc-white br-50 flex-spacebetween"
      v-on:click="goto_message_list">
      <span class="message-button-span fn-14"> Messages </span>
      <span class="mr-20 mt-10">
        <MessageCountBubble> {{data.messages_count}} </MessageCountBubble>
      </span>
    </section>
  </div>

</div>
</template>

<script>
import MessageCountBubble from '@/components/MessageCountBubble.vue';

export default {
    name: 'TrainerDashboard',
    data() {
        return {
            data:{},
            status_d: {},
            email: null,
            errors: null,
            search_param: "",
        }
    },
    components: {
        MessageCountBubble,
    },
    computed: {
        user: function(){
            var d = Object.assign({}, this.$store.state.auth.user);
            return d;
        },
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
        goto_message_list: function(){
            this.$router.push({name: 'message-list-view'});
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
                        let errors = {}
                        err.response.data['errors'].forEach((element, index, array) =>{
                            errors[element['field']] = element['message']
                        });
                        this.errors = errors;
                    });
            });
        },
        fetch_dashboard_data: function() {
            const url = process.env.VUE_APP_BASE_URL+'/api/dashboard/' + this.user.id;
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.data = resp.data;
                    this.status = "ready";
                })
                .catch(err => {
                    this.status='error';
                });
        },
    },
    mounted() {
        this.invitation_status_count();
        this.fetch_dashboard_data();
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
    section.message-button {
        width: 100%;
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
        font-weight: 600;
        color: $milife-magenta;
        padding: 5px 2px;
        cursor: pointer;
    }


    .td_user-activity {
      display: grid;
      grid-template-columns: repeat(2, 6fr);
      grid-gap: 10px;
      margin: 15px 2px;
      font-size: 11pt;
      font-weight: 600;
    }

    #td-adduser {
      display: grid;
      grid-template-columns: 10fr 2fr;
      background-color: $milife-green;
      line-height: 3rem;
      border-radius: 10px;
      padding: 15px;
    }

    .code.icon {
      color: #fff;
      position: relative;
      margin-left: 0px;
      margin-top: 17px;
    }

    .code.icon:after {
      content: "";
      position: absolute;
      left: 6px;
      width: 10px;
      height: 10px;
      border-bottom: solid 3px currentColor;
      border-right: solid 3px currentColor;
      -webkit-transform: rotate(-45deg);
      transform: rotate(-45deg);
    }


    .code.icon:after {
    content: "";
    position: absolute;
    left: 6px;
    width: 10px;
    height: 10px;
    border-bottom: solid 3px currentColor;
    border-right: solid 3px currentColor;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
  #td-inviteuser {
    display: grid;
    grid-template-columns: 10fr 2fr;
    background-color: $milife-green;
    line-height: 3rem;
    border-radius: 10px;
    padding: 15px;
  }

  #td-upload-csv {
    font-size: 15pt;
    text-align: left;
    background-color: $milife-magenta;
    border-radius: 10px;
    display: grid;
    grid-template-columns: 1fr 10fr 1fr;
    padding: 10px;
    margin: 20px 2px;
    cursor: pointer;
    font-weight: 600;
  }

  #td-search {
    height: 20%;
    background-color: $milife-grey;
    border-radius: 10px;
    padding: 15px 20px 30px 20px;
    font-size: 15pt;
    font-weight: 600;
    cursor: pointer;
  }

  #td-search > p {
    margin: 15px;
  }
  #td-search > a > input {
    margin-top: 5px;
  }
  .user-list-link {
    margin: 10px 1px;
  }

  .text_input-td {
    border: 1px solid #fff;
    width: 100%;

    &::placeholder {
      font-size: 17px;
    }
  }

  .search-icon {
    position: relative;
    float: right;
    width: 20px;
    height: 40px;
    top: -48px;
    right: 16px;
  }

  @media screen and (max-width: 333px) {
    .td_user-activity {
      font-size: 10pt;
    }
  }

}
</style>
