<template>
<div id="view-document-container" v-if="status=='success'">
	<div class="width-90">
		<div v-if="loadedRatio > 0 && loadedRatio < 1" style="background-color: green; color: white; text-align: center" :style="{ width: loadedRatio * 100 + '%' }">{{ Math.floor(loadedRatio * 100) }}%</div>
    <pdf v-if="show" ref="pdf"  :src="src" :page="page" :rotate="rotate" @password="password" @progress="loadedRatio = $event" @error="error" @num-pages="numPages = $event" @link-clicked="page = $event"></pdf>
    </div>

    <div v-if="numPages > 0" class="width-90">
      <pdf v-for="page in numPages-1"
           v-if="show"
           ref="pdf"
           :src="src"
           :page="page +1">
      </pdf>
    </div>

	</div>
</div>
</template>

<script>
import pdf from 'vue-pdf'

export default {
	  components: {
		    pdf: pdf
	  },
    props: ['fobj_user', ],
	  data () {
		    return {
			      show: true,
			      loadedRatio: 0,
			      page: 1,
			      numPages: undefined,
			      rotate: 0,
            document: {},
            error_message: "",
            errors: {},
            status: null,
		    }
	  },
    computed: {
        user: function() {
            var user = Object.assign({}, this.$store.state.auth.user);
            if(this.$route.params.pk){
                user = Object.assign({}, this.fobj_user);
            }
            return user;
        },

        user_pk: function(){
            if (this.is_admin) {
                return this.$route.params.pk;
            }
            else {
                return this.$store.state.auth.user.id;
            }
        },
        is_admin: function() {
            return this.$store.state.auth.user.is_staff;
        },
        // src: function(){
        //     return this.document.document || '';
        // },

    },
	  methods: {
		    password: function(updatePassword, reason) {

			      updatePassword(prompt('password is "test"'));
		    },
		    error: function(err) {

			      console.log(err);
		    },
        fetch_document: function() {
            console.log('reached', this.$route.params.doc_pk);
            var pk = this.$route.params.doc_pk;
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk + '/documents/'+ pk ;
            return new Promise((resolve, reject) => {
                this.$http({url: url, params:this.params, method: 'GET'})
                    .then(resp => {
                        this.error_message="";
                        this.errors={};
                        this.document= resp.data;
                        console.log(resp.data);
                        this.status='success';
                        this.src = this.document.document;
                    })
                    .catch(err => {
                        var errors = {};
                        err.response.data['errors'].forEach((element, index, array) =>{
                            errors[element['field']] = element['message']
                        });
                        this.errors = errors;
                    });
            });

        },

	  },
    created() {
        this.fetch_document();
    },

    mounted() {

	  }
}
</script>

<style lang="scss">
#view-document-container{
    display: grid;
    align-items: center;
    justify-items: center;
    grid-gap: 10px;
}
</style>
