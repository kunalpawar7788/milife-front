<template>
<div class="container">
  <h1>User List</h1>
  <div class="userlist" v-for="user of users">
    <div class="user" :id ="user.id">
      {{user.first_name}} | {{user.email}}
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
            users: null,
            }
    },
    methods: {
        fetch_users: function() {
            const url = process.env.VUE_APP_BASE_URL+'/api/users';
            axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
            axios({url: url, data:this.params, method: 'GET'})
                .then(resp => {
                    this.error_message="";
                    this.errors={};
                    this.step=2;
                    this.users= resp.data.results;
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
        this.fetch_users();
    },
}

</script>

<style>
  .user {
  border: 1px solid red;
  color: black;
  background: white;
  height: 50px;
  border-radius: 20px;
  margin: 5px;
  padding: 5px;
 
  }
</style>
