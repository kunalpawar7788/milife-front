<template>
<div class="container" v-on:click="toggle_menu(null)">
  <div class="searchbox">
    <input class="text-input" v-model="params.search" placeholder="Start typing to search" v-on:keyup="fetch_users">
  </div>
  <div class="userlist-container">
    <div class="userinfo" v-for="user of users" :id="user.id">
      <div v-bind:class="[user.id==selected_user_id? 'user-selected':'', 'userinfo-grid']">
        <img src="user.image" v-if="user.image!=null"/>
        <img src="@/assets/images/placeholder-profile.png"/>
        <span> {{user.first_name}} {{user.last_name}}</span>
        <p v-on:click.stop="toggle_menu(user.id)"> ... </p>
      </div>
      
      <div class="context-menu" v-if="selected_user_id==user.id" >
        <ul>
          <li><router-link :to="{name: 'user-message', params:{'pk': user.id}}"> Message {{user.first_name}}</router-link></li>
          <li><router-link :to="{name: 'user-manage', params:{'pk': user.id}}"> Manage </router-link></li>

          <li>Remove</li>
        </ul>
      </div>
    </div>
    
  </div>
</div>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: "UserList",
    components: {},
    
    data() {
        return{
            params: {search: ''},
            users: [],
            selected_user_id: null,
        }
    },
    methods: {
        fetch_users: function() {
            const url = process.env.VUE_APP_BASE_URL+'/api/users';
            axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
            this.users = {};
            axios({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.error_message="";
                    this.errors={};
                    this.users= resp.data.results;
                    console.log(resp.data);
                })
                .catch(err => {
                    err.response.data['errors'].forEach((element, index, array) =>{
                        errors[element['field']] = element['message']   
                    });
                    this.errors = errors;
                    
                });            
        },
        toggle_menu: function(_id){
            this.selected_user_id= this.selected_user_id==_id ? null : _id
        }

    },
    mounted() {
        this.fetch_users();
    },
}
</script>

<style lang="scss">
.user {
    border: 1px solid red;
    color: black;
    background: white;
    height: 64px;
    
    border-radius: 20px;
    margin: 5px;
    padding: 15px;
    font-size: 15pt;
    font-family: Monteserrat Regular;
}
.userinfo-grid{
    display: grid;
    grid-template-columns: 1fr 5fr 1fr;
    background-color: white;
    border-radius: 20px;
    margin: 5px;
    padding: 5px;
    color: black;
    
    img {
        height:60px;
        padding: 5px;
    }
    
    span{
        font-size: 15pt;
        align-self: center;
        justify-self: left;
        padding-left: 20px;
    }

    :focus{
        background-color:$milife-green;
    }
}
.userinfo{
    .context-menu {
        //height: 150px;
        width: 200px;

        border: 1px solid red;
        position: relative;
        top: -114px;
        left: 144px;

        z-index: 999;
        color: black;
        background-color: white;
        margin-bottom: -105px;

        ul {
            list-style: none;
            padding: 1px;
            margin-block-start: 0;
            margin-block-end: 0;

            li {
                padding: 5px;

                a {
                    text-decoration: none !important;
                    color: inherit;
                    width: 100%;
                    height: 100%;
                    display: block;
                             
                }

                &:hover {
                    cursor: pointer;
                    background: black;
                    color: white;
                }
            }
        }
    }
}

.user-selected{
    background-color: $milife-green;

}
</style>
