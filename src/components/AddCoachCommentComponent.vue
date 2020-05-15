<template>
<section class="" id="add-coach-comment">
  <div v-if="allow_comment">
    <textarea
      cols="30"
      id=""
      name=""
      rows="10"
      v-model="message"
      class="br-20 width-80 border-box pd-10">
    </textarea>

    <div class="button margin-auto pd-10 br-10 width-80" v-on:click="submit_comment()"> Save </div>
  </div>
</section>
</template>

<script name='js'>

export default {
    name: "AddCoachCommentComponent",
    props: ['fobj_user', 'kind'],
    components: {},
    data() {
        return {
            status: 'initial',
            //allow_comment: true,
            message: "",
            comments: {},
        }
    },
    computed: {
        allow_comment: function(){
            return this.$store.getters['auth/is_staff']
        },
        user: function() {
            var user = Object.assign({}, this.$store.state.auth.user);
            if(this.$route.params.pk){
                user = Object.assign({}, this.fobj_user);
            }
            return user;
        },
    },
    methods:  {
        submit_comment: function(){
            return new Promise((resolve, reject) => {
                const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + "/message";
                var data = {
                    content: this.message,
                    kind: this.kind,
                }
                
                this.$http({url: url, method: "POST", data: data})
                    .then(resp => {
                        resolve(resp);
                        this.$router.go('-1');
                    })
                    .catch(err => {
                        this.status='error';
                        console.log(err);
                        reject(err);
                    });
            });

        },

    },

    mounted() {
    },

    created() {
    },

}
</script>

<style lang="scss">

</style>
             
