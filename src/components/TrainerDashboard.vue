<template>
<div class="trainer-dashboard">
  <div class="slab1">
    <div class="usercounts">
      <img class="image" id="icon-active" src="@/assets/images/activated-users.svg"/>
      <div class="count" id="count-active">{{status_d.active}}</div>
      <div class="label" id="label-active">ACTIVE <br/> USERS</div>
      
      <img class="image" id="image-waiting" src="@/assets/images/invitation-waiting.svg"/>
      <div class="count" id="count-waiting">{{status_d.waiting}}</div>
      <div class="label" id="label-waiting">WATING <br/> CONFIRMATION</div>
    </div>
    <div class="user-list-link">
      <router-link :to="{name: 'user-list'}">View All Users ></router-link>
    </div>
  </div>
  <div id="td-inviteuser">
    <span> </span>
    <span class="cta"> <router-link :to="{ name: 'invite'}">INVITE A USER </router-link></span>
    <span class="arrow"> > </span>
  </div>

  <div id="td-search">
     <router-link :to="{ name: 'user-list'}">
    <p>Search A User</p>
    <input class="text-input" required v-model="email" type="email" placeholder="start typing to search"/>
    </router-link>
  </div>
  <div id="td-upload-csv">
    <span> </span>
    <span class="cta"> <router-link :to="{ name: 'invite'}"> UPLOAD CSV</router-link></span>
    <span class="arrow"> + </span>

  </div>

</div>  
</template>

<script>
import store from '@/store'
import axios from 'axios';

export default {
    name: 'TrainerDashboard',
    data() {
        return {
            status_d: {},
            email: null,
        }
    },
    components: {
    },
    methods: {
        invitation_status_count: function(){
            const url = process.env.VUE_APP_BASE_URL+'/api/counts/email_verification_status';
            axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
            axios({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.errors={};
                    this.step=2;
                    this.status_d = resp.data
                    console.log(resp.data);
                })
                .catch(err => {
                    err.response.data['errors'].forEach((element, index, array) =>{
                        errors[element['field']] = element['message']   
                    });
                    this.errors = errors;
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
    
}
.slab1 {
    border: 1px solid white;
    padding: 10px;
}
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

</style>
