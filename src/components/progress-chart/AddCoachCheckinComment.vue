<template>
<section class="" id="add-coach-comment">
  <div>
    <textarea
      cols="30"
      id=""
      name=""
      rows="10"
      v-model="comment"
      :disabled="!allow_comment"
      class="br-20 width-80 border-box pd-10">
    </textarea>

    <button
      class="button margin-auto pd-10 br-10 width-80"
      v-on:click="submit_comment()" v-if="allow_comment"
      >
      Save
    </button>
  </div>
</section>
</template>

<script>
import store from '@/store';

export default {
    name: "AddCoachCommentComponent",
    props: ['fobj_user', 'kind', 'message_obj'],
    components: {},
    data() {
        return {
            status: 'initial',
            //allow_comment: true,
            message: "",
            comment_: "",
        }
    },
    computed: {
        allow_comment: function(){
            return store.getters['auth/is_staff'];
        },
        user: function() {
            var user = Object.assign({}, this.$store.state.auth.user);
            if(this.$route.params.pk){
                user = Object.assign({}, this.fobj_user);
            }
            return user;
        },
        comment: {
            get(){
                return this.comment_ || this.message_obj.content;
            },
            set(value){
                this.comment_ = value;
            }
        },
        submit_method: function(){
            return 'PATCH';

        },
        submit_url: function(){
            var base_url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + "/message"
            if(this.message_obj && this.message_obj.id){
                return base_url + '/' + this.message_obj.id;
            }
            return base_url;
        },
    },
    methods:  {
        submit_comment: function(){
            return new Promise((resolve, reject) => {
                var data = {
                    content: this.comment_,
                    read: false,
                    deleted: false,
                    kind: 'checkin-commentry'
                }
                
                this.$http({url: this.submit_url, method: this.submit_method, data: data})
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
             
