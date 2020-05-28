<template>
<div>
  <SelectedUserDisplay
    class="middle-column"
    v-if="is_admin"
    :fobj_user="fobj_user">
  </SelectedUserDisplay>

  <div class="searchbox">
    <input class="text-input search-input" v-model="params.search" placeholder="Start typing to search" v-on:keyup="fetch_documents">
  </div>

  <div class="documentlist" v-for="document in documents">
    <div class="document fw-500 fn-16">
      <p>{{document.name}}</p>
      <router-link
        v-if="is_admin"
        :to="{name: 'user-document-edit', params: {pk: user_pk, doc_pk: document.id}}">
        <img src="@/assets/images/edit.svg" />
      </router-link>
      <div v-else></div>
      <div @click="goto_view_document(document.id)"> <img src="@/assets/images/look-open.svg" /></div>
      <div @click="download_document(document)"> <img src="@/assets/images/download.svg" /></div>
    </div>
  </div>
  <router-link
    tag="button"
    v-if="is_admin"
    class="milife-button milife-button__fullsize"
    :to="{name:'user-document-add', params:{'pk': user_pk}}"> Add Document
  </router-link>


</div>
</template>

<script>
import SelectedUserDisplay from '@/components/SelectedUserDisplay';

export default {
    name: 'DocumentList',
    components: {SelectedUserDisplay,},
    props: ['fobj_user', ],

    data() {
        return {
            params: {'search': ''},
            pk: this.$route.params.pk,
            documents: {},
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
            if (this.$route.params.pk) {
                return this.$route.params.pk;
            }
            else {
                return this.$store.state.auth.user.id;
            }
        },
        is_admin: function() {
            return this.$store.state.auth.user.is_staff;
        },

    },

    methods: {
        showalert(msg) {
            alert(msg);
        },
        goto_view_document: function(document_pk){
            var params= {doc_pk: document_pk};
            var view = "my-document-view";
            if (this.is_admin){
                params['pk'] = this.user_pk;
                view = 'user-document-view';
            }
            this.$router.push({name: view , params: params});
        },
        download_document: function(d){
            return new Promise((resolve, reject) => {
                this.$http({
                    url: d.document,
                    method: 'GET',
                    responseType: 'blob', // important
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', d.document.split('/').slice(-1)[0]);
                    document.body.appendChild(link);
                    link.click();
                });
            });

        },
        fetch_documents: function() {
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk + '/documents';
            return new Promise((resolve, reject) => {
                this.$http({url: url, params:this.params, method: 'GET'})
                    .then(resp => {
                        this.error_message="";
                        this.errors={};
                        this.documents= resp.data.results;
                    })
                    .catch(err => {
                        err.response.data['errors'].forEach((element, index, array) =>{
                            errors[element['field']] = element['message']
                        });
                        this.errors = errors;
                    });
            });

        },
    },

    mounted() {
        this.fetch_documents();
        this.$store.dispatch("theme/set_theme_blue");
    },

}
</script>

<style lang="scss">
.document {
    background: white;
    color: black;
    border-radius: 20px;
    padding: 10px;
    margin: 5%;
    display: grid;
    grid-template-columns: 5fr 1fr 1fr 1fr;
    padding-left: 20px;
    align-items: center;
    justify-items: center;
    grid-column-gap: 5px;
    min-height: 60px;

    p {
        margin: 0;
        justify-self: left;
        text-align: left;
    }
}

.text-input {
    border: none;
    font-family: "Montserrat";
    font-size: 13pt;
    background-color: whitesmoke;
}

.text-input::placeholder {
    color: dimgray;
}

.search-input {
    background: url("../../assets/images/search-icon.svg") no-repeat scroll 90% 50%;
    background-color: whitesmoke;
}
</style>
