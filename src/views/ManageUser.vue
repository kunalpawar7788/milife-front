<template>
<div class="manageuser-container">
  <img class="profile-photo" src="user.image" v-if="user.image!=null"/>
  <img class="profile-photo" src="@/assets/images/placeholder-profile.png"/>
  <div class="name"> {{user.first_name}} {{user.last_name}} </div>
  <div class="mu-buttons">
    <div id="mu-1" class="mb"><router-link :to="{name: 'user-documents', params:{'pk': user.id}}"> View Docs </router-link> </div>
    <div id="mu-2" class="mb"><router-link :to="{name: 'user-document-add', params:{'pk': user.id}}"> Add Docs </router-link> </div>
    <div id="mu-3" class="mb mb__full"><router-link :to="{name: 'testview', params:{'pk': user.id}}"> Programme </router-link> </div>
    <div id="mu-4" class="mb"><router-link :to="{name: 'testview', params:{'pk': user.id}}"> Body Stats </router-link> </div>
    <div id="mu-5" class="mb"><router-link :to="{name: 'testview', params:{'pk': user.id}}"> Progress Chart </router-link> </div>
    <div id="mu-6" class="mb"><router-link :to="{name: 'testview', params:{'pk': user.id}}"> Message </router-link>  </div>
    <div id="mu-7" class="mb"><router-link :to="{name: 'testview', params:{'pk': user.id}}"> Add Checkin </router-link> </div>
    <div id="mu-8" class="mb mb__full"><router-link :to="{name: 'testview', params:{'pk': user.id}}"> Log Schedule Change </router-link> </div>
    <div id="mu-9" class="mb mb__full"><router-link :to="{name: 'testview', params:{'pk': user.id}}"> Meal Plan </router-link> </div>
  </div>
</div>
</template>

<script>
import axios from 'axios';
export default {
    name: "ManageUser",
    components: {},
    data() {
        return {
            user: {},
            pk:  this.$route.params.pk,
        }
    },
    
    methods: {
        fetch_user: function(pk){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.pk; 
            axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
            
            axios({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.error_message="";
                    this.errors={};
                    this.user= resp.data;
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

<style lang="scss">
.manageuser-container {

    img.profile-photo{
        height: 100px;
    }
    
}

.mu-buttons{
    display: grid;
    grid-template-columns: 1fr 1fr;
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
