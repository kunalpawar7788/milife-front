<template>
<div class="add-document-container" v-if="status=='success'">

    <SelectedUserDisplay :fobj_user="fobj_user"> </SelectedUserDisplay>

    <div>
    <div v-if="file">
    <p>{{file}}</p>

      </div>
      <input v-else
             class="file"
             type="file"
             ref="file"
             id="file"
             value="file"
             v-on:change="handleFileSelect()"
             >  </input>
    </div>

    <div>
      <input
        type="text"
        class="input text-input"
        v-model="name"
        placeholder="Document Name"
        />
    </div>

    <div>
      <textarea
        v-model="notes"
        class="input"
        placeholder="Notes"
        rows="10"
        />
    </div>

    <div class="choicefield">
      <p> Document Type</p>
      <multiselect
        v-model="kind"
        placeholder="Docoument type"
        :options="kind_options"
        label="label"
        track-by="value"
        >
      </multiselect>
    </div>

    <div>
      <button class="button" @click="upsert_document()"> Save </button>
    </div>
    <div v-on:click="goto_document_list"> Cancel </div>
  </div>
  <div v-else>
    {{status}}
  </div>



</template>

<script>
import store from '@/store';
import axios from 'axios';
import Multiselect from 'vue-multiselect';
import SelectedUserDisplay from '@/components/SelectedUserDisplay';

export default {
    name: "AddDocument",
    props: ['fobj_user', ],
    components: {Multiselect, SelectedUserDisplay},
    computed: {
        user() {return this.fobj_user;},
        full_name() {
            return this.user.first_name + " " + this.user.last_name;
        },
        document_id() {
            // if document_id exists, edit the document or add it.
            return this.$route.params.doc_pk || '';
        },
        user_id() {
            return this.$route.params.pk;
        },
        upsert_method() {
            return this.document_id? 'PATCH' : 'POST';
        },
        upsert_url() {
            var base_url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_id + "/documents";
            return this.document_id?  base_url + "/" + this.document_id: base_url;
        },

        name: {
            get() {
                return this.doc.name;
            },
            set(value) {
                this.doc.name = value;
            },
        },
        notes: {
            get() {
                return this.doc.notes;
            },
            set(value) {
                this.doc.notes = value;
            },
        },
        file: {
            get() {
                console.log('reading from here, ', this.doc.document);
                return this.doc.document;
            },
            set(value) {
                this.doc.file = value;
            },
        },
        kind: {
            get() {
                var d = {
                    MEALPLAN: {label: 'MEAL PLAN', value: 'MEALPLAN'},
                    CLIENTAGREEMENT: {label: 'CLIENT AGREEMENT', value: 'CLIENTAGREEMENT'},
                    PARQ: {label: 'PARQ', value: 'PARQ'},
                    GUARANTEE: {label: 'GUARANTEE', value: 'GUARANTEE'},
                    MISC: {label: 'MISC', value: 'MISC'},
                };
                return d[this.doc.kind] || {};

            },
            set(value) {
                var value = Object.assign({}, value)
                this.doc.kind = value['value'];
            },
        }
    },

    data() {
        return {
            kind_options: [
                {label: 'MEAL PLAN', value: 'MEALPLAN'},
                {label: 'CLIENT AGREEMENT', value: 'CLIENTAGREEMENT'},
                {label: 'PARQ', value: 'PARQ'},
                {label: 'GUARANTEE', value: 'GUARANTEE'},
                {label: 'MISC', value: 'MISC'},
            ],
            // status -> start, loading, error, success,
            status: 'start',


            doc: {
                name: '',
                notes: '',
                kind: '',
                file: '',
            },
        }
    },

    created() {
        this.$store.dispatch("theme/set_theme_white");
        if (this.document_id) {
            console.log('did I fetch data?');
            this.status='loading';
            this.fetch_document(this.$route.params.pk, this.$route.params.doc_pk);
        }
        else{
            this.status = 'success';
        }
    },

    watch: {
        // call again the method if the route changes
        '$route': 'fetch_document'
    },


    methods: {
        goto_document_list(){
            this.$router.push({name: "user-documents", params:{pk: this.user_id}})
        },
        handleFileSelect: function(){
            this.doc.file = this.$refs.file.files[0];
        },

        fetch_document: function(user_pk, doc_pk){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + user_pk + "/documents/" + doc_pk;
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.status='success';
                    this.error_message="";
                    this.errors={};
                    this.doc = resp.data;
                    this.file = resp.data.document;
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },

        upsert_document: function() {
            axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');

            let formData = new FormData();
            if (! this.document_id){
                formData.append('document', this.doc.file);
            }
            formData.append('notes', this.doc.notes);
            formData.append('name', this.doc.name);
            formData.append('kind', this.doc.kind);

            new Promise((resolve, reject) => {
                axios({
                    url: this.upsert_url,
                    data: formData,
                    method: this.upsert_method,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: function( progressEvent ) {
                        this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
                    }.bind(this)
                })
                    .then(resp => {
                        resolve(resp);
                        this.$router.go('-1');
                    }).catch(err => {
                        console.log('failure', err)
                        reject(err);
                    });
            });
        },
    },
}

</script>


<style lang='scss'>

.add-document-container {
        display: grid;
        grid-template-columns: 1fr 5fr 1fr;
        grid-row-gap: 5px;
        justify-items: center;
        width: 100%;

        .choicefield{
            display: inline-grid;
            grid-template-columns: 1fr 2fr;
            grid-column-gap: 10px;
        }
    div{
        grid-column: 2;
        width: 100%;
        padding-top: 10px;

    }
    * p{
        color: black;
    }
    .input{
        background-color: lighten(grey, 40%);
    }
    * textarea {
        width: 80%;
        border-radius:20px;
        padding: 10px;
    }

    button {
        width: 80%;

    }

}
</style>
