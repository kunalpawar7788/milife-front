<template>
<section class="upload-csv-container">

  <p>{{csvfile}}</p>

  <input
    class="csvfile"
    type="file"
    ref="csvfile"
    id="csvfile"
    value="csvfile"
    v-on:change="handleFileSelect()"
    >  </input>

  <div class="button" v-on:click="upload_csv"> Upload selected file </div>


  {{status}}




</section>
</template>

<script>
export default {
    name: "UploadCSVView",
    data(){
        return {
            errors: "",
            csvfile: '',
            status: '',
            upload_percentage: 0,
        }
    },
    computed: {
        upsert_url: function(){
            return process.env.VUE_APP_BASE_URL+'/api/accuniq-data/';
        },
    },

    methods: {
        handleFileSelect: function(){
            this.csvfile = this.$refs.csvfile.files[0]
        },

        upload_csv: function(){
            this.upload_percentage = 0
            let formData = new FormData()
            formData.append('csvfile', this.csvfile)

            return new Promise((resolve, reject) => {
                this.$http({
                    url: this.upsert_url,
                    data: formData,
                    method: "POST",
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: function( progressEvent ) {
                        this.uploadPercentage = parseInt( Math.round( ( progressEvent.loaded * 100 ) / progressEvent.total ) )
                    }.bind(this)
                })
                    .then(resp => {
                        resolve(resp)
                        this.$router.go('-1')
                    }).catch(err => {
                        console.log('failure', err)
                        reject(err)
                    })
            })
        },

    },

}
</script>

<style lang="scss">
section.upload-csv-container {
    color: black;
}
</style>
