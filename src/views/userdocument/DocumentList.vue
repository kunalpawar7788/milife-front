<template>
<div>
    <SelectedUserDisplay class="middle-column" :fobj_user="fobj_user"> </SelectedUserDisplay>
  <div class="searchbox">
    <input class="text-input" v-model="params.search" placeholder="Start typing to search" v-on:keyup="fetch_documents">
  </div>

  <div class="documentlist" v-for="document in documents">
    <div class="document">
      <p>{{document.name}}</p>
      <router-link :to="{name: 'user-document-edit', params: {pk: fobj_user.id, doc_pk: document.id}}"> <img src="@/assets/images/edit.svg" /> </router-link>
      <div @click="showalert('not implemented')"> <img src="@/assets/images/look-open.svg" /></div>
      <div @click="download_document(document)"> <img src="@/assets/images/download.svg" /></div>
    </div>
  </div>
  <router-link tag="button" class="milife-button milife-button__fullsize" :to="{name:'user-document-add', params:{'pk': this.pk}}"> Add Document </router-link>


</div>
</template>

<script>
import SelectedUserDisplay from '@/components/SelectedUserDisplay';

export default {
    name: 'DocumentList',
    components: {SelectedUserDisplay,},
    props: ['fobj_user', ],
    computed: {
        user() {return this.fobj_user;},
    },
    data() {
        return {
            params: {'search': ''},
            pk: this.$route.params.pk,
            documents: {},
        }
    },
    methods: {
        showalert(msg) {
            alert(msg);
        },

        download_document: function(d){
            return new Promise((resolve, reject) => {
                this.$http({
                    url: d.document,
                    method: 'GET',
                    responseType: 'blob', // important
                }).then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    console.log(document);
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', d.document.split('/').slice(-1)[0]);
                    document.body.appendChild(link);
                    link.click();
                });
            });

        },
        fetch_documents: function() {
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.pk + '/documents';
            this.users = {};
            return new Promise((resolve, reject) => {
                this.$http({url: url, params:this.params, method: 'GET'})
                    .then(resp => {
                        this.error_message="";
                        this.errors={};
                        this.documents= resp.data.results;
                        console.log(resp.data);
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
    border-radius: 5px;
    padding: 10px;
    margin: 10px;
    display: grid;
    grid-template-columns: 5fr 1fr 1fr 1fr;
    padding-left: 20px;
    align-items: center;
    justify-items: center;
    grid-column-gap: 5px;
    p {
        justify-self: left;
    }
}
</style>
