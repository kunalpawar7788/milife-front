<template>
  <div class="edit-document">
    <p class="username">{{user_name}}</p>
    <p class="docname">{{document_name}}</p>
    <div><input type="text" v-model="doc.name" /></div>
    <div><textarea v-model="doc.notes"/></div>
    
    <button @click.prevent="update_document()"> update </button>
  </div>
</template>

<script>
export default{
    name: "EditDocument",
    data() {
        return {
            user: {},
            doc: {document:'',},
            errors: {},
            
        }
    },
    computed: {
        document_name: function() {
            return this.doc.document.split('/').slice(-1)[0];
        },
        user_name: function(){
            return this.user.first_name + " " + this.user.last_name;
        }
    },

    methods: {
        fetch_user: function(user_id){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + user_id;
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {this.user = resp.data})
                .catch(err => {console.log(err)});
        },
        fetch_document: function(user_pk, doc_pk){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + user_pk + "/documents/" + doc_pk;
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.error_message="";
                    this.errors={};
                    this.doc = resp.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        update_document: function(){
            const user_pk = this.$route.params.pk;
            const doc_pk = this.$route.params.doc_pk;
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + user_pk + "/documents/" + doc_pk;
            const data = {
                notes: this.doc.notes,
                name: this.doc.name,
            };
            this.$http({url: url, data: data, method: 'PATCH'})
                .then(resp => {
                    this.error_message="";
                    this.errors={};
                    this.doc = resp.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        
    },
    mounted() {
        this.fetch_user(this.$route.params.pk);
        this.fetch_document(this.$route.params.pk, this.$route.params.doc_pk);
        
    }
}
</script>

<style lang="scss">
.edit-document {    
    p {
        
    }
    div{
        display: block;
        padding: 10px;

        input{
            color: black;
            background-color: white;
            border-radius: 10px;
            display: block;
            width: 65%;
            margin-left: 15%;
            padding: 5px 10px;

        }
        textarea {
            border-radius: 10px;
            height: 100px;
            width: 80%;
            padding: 5px 10px;
        }
    }
    button {
        background-color: $milife-green;
        color: white;
        width: 70%;
        text-align: center;
        border-radius: 20px;
        height: 30px;
    }
}
</style>
