<template>
<div v-if="status=='success'">
  <router-view v-bind:fobj_user="fobj_user"> </router-view>
</div>
<div v-else-if="status=='error'" class="fc-white">
  Oops, looks like we encountered an error, please reload the page
</div>
<div v-else class="fc-white">
  {{status}}
</div>
</template>

<script>
export default {
    name: "UserView",
    data () {
        return {
            status: null,
            pk:  this.$route.params.pk,
        }
    },
    computed: {
        fobj_user: function() {
            return Object.assign({},this.$store.state.user.user);
        },
    },

    mounted() {
        if(this.$store.state.user.user.id != this.pk) {
            this.status="loading"
            this.$store.dispatch("user/fetch_user", this.pk).then(()=>{
                this.status="success";
            }).catch(()=>{
                this.status="error";
            });
        }
        else{
            this.status="success";
        }

        this.$store.dispatch("theme/set_theme_blue");
    },
}
</script>
