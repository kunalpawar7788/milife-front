<template>
<section class="filtered-user-list">
  <header>
    <input class="text-input" v-model="search_keyword" placeholder="Start typing to search" v-on:keyup="fetch_users">
  </header>
  <div class="user-list-container">
    <div
      class="userinfo"
      v-for="user of users"
      :id="user.id"
      v-on:click="goto_manage_user(user.id)">

      <div class="userinfo-grid">
        <img :src="user.image" v-if="user.image!==null"/>
        <img v-else src="@/assets/images/placeholder-profile.png"/>
        <span> {{user.first_name}} {{user.last_name}}</span>
      </div>
    </div>
  </div>
</section>
</template>


<script>
export default {
    name: "FilteredUserList",
    props: {
        email_verified: {
            required: false,
            type: Boolean,
        },

        invited: {
            required: false,
            type: Boolean,

        },
    },
    data(){
        return {
            _keyword: "",
            errors: {},
            users: [],
        };
    },
    computed: {
        search_keyword: {
            get() {
                return this.$store.getters['temps/user_search_param'];
            },
            set(value){
                this.$store.dispatch('temps/set_user_search_param', value);
            },
        },
        params: function() {
            var d = {};
            if (this.search_keyword){
                d["search"] = this.search_keyword;
            }
            if (this.email_verified !== null ){
                d["email_verified"] = this.email_verified;
            }
            if (this.invited !== null){
                d["invited"] = this.invited;
            }
            return d;
        },
    },
    methods: {
        goto_manage_user: function(user_id){
            this.$router.push({name: 'user-manage', params:{'pk': user_id}});
        },
        
        fetch_users: function(){
            const url = process.env.VUE_APP_BASE_URL+'/api/users';
            this.$http.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
            this.users = [];
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.error_message="";
                    this.errors={};
                    this.users= resp.data.results;
                })
                .catch(err => {
                    err.response.data['errors'].forEach((element, index, array) =>{
                        errors[element['field']] = element['message']
                    });
                    this.errors = errors;
                });

        },
    },

    mounted() {
        this.fetch_users();
        this.$store.dispatch("theme/set_theme_blue");
    },
}
</script>

<style lang="scss">

section.filtered-user-list {
    color: black;
    cursor: pointer;
    
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
        
        &:active{
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
}
</style>

