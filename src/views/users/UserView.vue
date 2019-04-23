<template>
  <div>

<router-view v-bind:fobj_user="user"> </router-view>
</div>
</template>

<script>
export default {
    name: "UserView",
    data () {
        return {
            pk:  this.$route.params.pk,
        }
    },
    methods: {
        fetch_user: function(pk){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.pk;
            this.$http.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');

            return new Promise((resolve, reject) => {
                this.$http({url: url, params:this.params, method: 'GET'})
                    .then(resp => {
                        resolve(resp.data);
                    }).catch(err => {
                        reject(err);
                    });
            });
        },
    },

    asyncComputed: {
        user:{
            get () {
                return  this.fetch_user();
            },
            default: {}
        },
    },
    mounted() {
        this.$store.dispatch("theme/set_theme_blue");
    },
}
</script>
