<template>
<form>
  <div class="container-userdetail">
    
    <input id="first_name" class="input text-input" v-model="data.first_name"></input>
    <input class="input text-input" v-model="data.last_name"></input>
    
    <input class="input text-input" v-model="data.email"></input>
    <div class="input genderselect">
      <multiselect
        v-model="data.gender"
        placeholder="Gender"
        :options="gender_options">
      </multiselect>
    </div>
    
    <input class="input text-input" v-model="data.number"></input>
    <button class="input milife-button milife-button__fullsize" @click.prevent="update_user()">Save</button>
    
  </div>
</form>
</template>

<script>
import axios from 'axios';
import Multiselect from 'vue-multiselect';

export default {
    name: "UserDetail",
    components:{Multiselect,},
    data() {
        return {
            gender_options: ['Male', 'Female', 'Would rather not say'],
            pk:  this.$route.params.pk,
            data: {
            },
        }
    },
    
    methods: {
        update_user: function(){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.pk; 
            axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
            
            axios({url: url, data:this.data, method: 'PATCH'})
                .then(resp => {
                    this.error_message="";
                    this.errors={};
                    console.log(resp.data);
                })
                .catch(err => {
                    err.response.data['errors'].forEach((element, index, array) =>{
                        errors[element['field']] = element['message']
                    });
                    this.errors = errors;
                });
            
        },
        fetch_user: function(pk){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.pk; 
            axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
            
            axios({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.error_message="";
                    this.errors={};
                    this.data = resp.data;
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
        this.fetch_user();
    },
}
</script>

<style>
  .input {
  grid-column-start: 2;
  grid-column-end: 2;
  border: 1px solid red;
  margin: 10px
  }

  #first_name {
  
  }

  .container-userdetail{
  display: grid;
  /*grid-template-columns: 40px 50px auto 50px 40px;*/
  grid-template-columns: 1fr 10fr 1fr;
  justify-items: center;


  }
  
</style>


