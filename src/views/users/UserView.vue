<template>
  <div v-if="status=='success'">

<router-view v-bind:fobj_user="fobj_user"> </router-view>
</div>
</template>

<script>
export default {
    name: "UserView",
    data () {
        return {
            status: null,
            pk:  this.$route.params.pk,
            user: {},
        }
    },
    methods: {
        fetch_user: function(pk){
            this.status=null;
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.pk;
            this.$http.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');

            return new Promise((resolve, reject) => {
                this.$http({url: url, params:this.params, method: 'GET'})
                    .then(resp => {
                        this.status='success';
                        this.user = resp.data;
                        resolve(resp.data);
                    }).catch(err => {
                        reject(err);
                    });
            });
        },
    },

    computed: {
        fobj_user: function() {
            return Object.assign({},this.$store.state.user.user);

        },
    },
    asyncComputed: {
        user1:{
            get () {
                return  this.fetch_user();
            },
            default: {}
        },
    },
    mounted() {
        this.$store.dispatch("user/fetch_user", this.pk);
        this.$store.dispatch("theme/set_theme_blue");
    },
    created() {
        this.fetch_user();
    },
}
</script>
