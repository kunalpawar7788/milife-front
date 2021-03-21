<template>
<section class="filtered-checkin-list">
   <h3 class="middle-column"> Check in details for {{fobj_user.first_name}}</h3>
    <div class="userinfo"
      v-for="(checkin, index) of checkins"
      :key="index"
      :id="checkin.id"
      v-on:click="manage_checkin(checkin.id, !checkin.deleted)"
      >
      <div class="checkininfo-grid">
        <span> {{checkin.date_of_checkin}}</span>
        <button class="button hide-button" v-if="!checkin.deleted"> Hide </button>
        <button class="button show-button" v-else> Show </button>
      </div>
    </div>

</section>
</template>


<script>
export default {
    name: "CheckinList",
    props: ['fobj_user', ],
    data(){
        return {
            _keyword: "",  
            errors: {},
            checkins: [],
        };
    },
    methods: {
        manage_checkin(checkin_id, is_deleted){
            var user_id = this.$route.params.pk;
        const url = process.env.VUE_APP_BASE_URL+'/api/users/'+ user_id +'/checkin-dash/'+ checkin_id;
        this.$http.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
        this.$http({url: url, data:{'deleted': is_deleted }, headers: {'Content-Type': 'application/json'}, method: 'PATCH'})
                .then(resp => {
                    this.error_message="";
                    this.errors={};
                    this.fetch_users();
                })
                .catch(err => {
                    err.response.data['errors'].forEach((element, index, array) =>{
                        errors[element['field']] = element['message']
                    });
                    this.errors = errors;
                });

        },
        
        fetch_users: function(){
            var user_id = this.$route.params.pk;
            const url = process.env.VUE_APP_BASE_URL+'/api/users/'+ user_id + '/checkin-dash';
            this.$http.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
            this.checkins = [];
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.error_message="";
                    this.errors={};
                    this.checkins= resp.data.results;
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

section.filtered-checkin-list {
    h3{
        color: white;
    }
    color: black;
    
    .checkininfo-grid{
        display: grid;
        grid-template-columns: 5fr 1fr;
        background-color: white;
        border-radius: 20px;
        margin: 10px;
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
        .button{
            padding: 10px;
            color: black;
        }
        .hide-button, .show-button {
            min-height: 2em;
            margin: 0 30px;
            padding: 5px 0px;
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

