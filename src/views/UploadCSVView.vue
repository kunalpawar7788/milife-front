<template>
<section class="upload-csv-container">

  <div class="uploader csv_uploader">
    <p>{{csvfile}}</p>
    <input class="csvfile" ref="csvfile" v-on:change="handleFileSelect()" value="csvfile" id="file-upload" type="file" name="fileUpload" />

    <label for="file-upload" id="file-drag">
        <div id="start">
        <div>Select a file or drag here</div>
        <span id="file-upload-btn" class="btn btn-primary">Select CSV</span>
        </div>
    </label>
  </div>

  <div class="button btn_csv-save" v-on:click="upload_csv"> Save</div>

  <table id="history-table">
    <thead>
      <th>uploaded at</th>
      <th></th>
    </thead>
    <tbody>
      <tr v-for="row in records">
        <td>{{timestamp_to_display(row.created_at)}}</td>
        <td> <div class="button btn_csv-save" v-on:click="patch(row.id)">
            Reprocess
        </div> </td>
      </tr>
    </tbody>

  </table>

</section>
</template>

<script>
import moment from "moment";
export default {
    name: "UploadCSVView",
    data(){
        return {
            errors: "",
            csvfile: '',
            status: '',
            upload_percentage: 0,
            records: {},
        }
    },
    computed: {
        upsert_url: function(){
            return process.env.VUE_APP_BASE_URL+'/api/accuniq-data/';
        },
    },

    methods: {
        timestamp_to_display: function(timestamp){
            return moment(timestamp).format("DD-MM-YYYY HH:mm");
        },
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

        fetch_records: function() {
            this.$http({url: this.upsert_url, data: {}, method: 'GET', params: {ordering: '-created_at'}})
                .then(resp => {
                    console.log(resp);
                    this.records = resp.data.results;
                })
                .catch (err => {console.log('failure', err)})
        },



        patch: function(id) {
            const url = this.upsert_url + id + '/';
            this.$http({url: url, data: {}, method: 'PATCH'})
                .then(resp => {console.log(resp)})
            .catch (err => {console.log('failure', err)})
        }

    },
    mounted() {
        this.fetch_records();
    },

}
</script>

<style lang="scss">
section.upload-csv-container {
    color: black;
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    height: auto;

    #history-table {
        width: 100%;
        border-spacing: 10px 1.5em;
    }

    .csv_uploader {
      display: block;
      clear: both;
      margin: 30px auto;

    label {
      float: left;
      clear: both;
      padding: 2rem 1.5rem;
      text-align: center;
      background: #eee;
      border-radius: 7px;
      border: 3px dotted #dadada;
      transition: all .2s ease;
      user-select: none;
    }

    #start {
      float: left;
      clear: both;
      width: 100%;
      &.hidden {
        display: none;
      }
    }

    input[type="file"] {
      display: none;
    }

    div {
      margin: 0 0 .5rem 0;
      color: $milife-grey;
    }
    .btn {
      display: inline-block;
      margin: 2rem .5rem 0rem .5rem;
      clear: both;
      font-family: inherit;
      font-weight: 400;
      font-size: 15pt;
      text-decoration: none;
      text-transform: initial;
      border: none;
      border-radius: 2rem;
      outline: none;
      padding: 0 1rem;
      line-height: 2.5em;
      color: #fff;
      transition: all 0.2s ease-in-out;
      box-sizing: border-box;
      background: $milife-magenta;
      border-color: $milife-magenta;
      cursor: pointer;
    }
  }
  .btn_csv-save{
    min-width: 50%;
    line-height: 0rem;
    color: #fff;
    font-weight: 300;
  }
}

</style>
