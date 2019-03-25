<template>
<div class="add-document">
    <input class="fileupload" id="file" ref="file" type="file" v-on:change="handleFileUpload()"> </input>
    <input class="" id="name" > </input>

  <button v-on:click="submitFile()"> Save </button>
</div>



</template>

<script>
import axios from 'axios';

export default{
    name: 'AddDocument',
    data() {
        return {
            file: '',
            uploadPercentage: 0,
            pk: this.$route.params.pk,
        };
    },
    methods: {
        handleFileUpload(){
            this.file = this.$refs.file.files[0];
        },

        submitFile(){
            let formData = new FormData();
            let url = "/api/users/" + this.pk + "/documents"
            formData.append('document', this.file);
            formData.append('name', 'bleh');

            axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');
            axios.post(
                url,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: function( progressEvent ) {
                        this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) );
                    }.bind(this)
                }
            ).then(function(){
                console.log('SUCCESS!!');
            }).catch(function(){
                console.log('FAILURE!!');
            });

        }},


    }

</script>
