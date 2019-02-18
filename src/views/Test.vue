
<template>
    <div class="container">
    <WeightChart> </WeightChart>
  </div>
</template>

<script>

import axios from 'axios';

import HeightInput from '@/components/HeightInput';
import WeightChart from '@/components/WeightChart';
export default {
    components: {
        WeightChart,
    },

    name: "Test",

    data(){
        return {

            file: '',
            uploadPercentage: 0,
            height: {
                magnitude_si: 160,
                preferred_unit: 'imperial'},
        }
    },

    methods: {

        handleFileUpload(){
            this.file = this.$refs.file.files[0];
        },
        submitFile(){
  let formData = new FormData();

  /*
    Add the form data we need to submit
  */
        formData.append('file', this.file);
        formData.append('blah', 'bleh');

  /*
    Make the request to the POST /single-file URL
  */

        axios.defaults.headers.common['Authorization'] = "Token " + localStorage.getItem('token');

        axios.post( '/api/users/7733be10-001f-4ead-bbab-d2c3bd7f4e58/documents',
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
  })
  .catch(function(){
    console.log('FAILURE!!');
  });
        }},

    created:  function() {
        console.log('hlehbleh');
        console.log(this.$http.get('http://httpbin.org/get'));
    },

}




</script>

    <style>


</style>
e
