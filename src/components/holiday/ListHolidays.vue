<template>
<div class="list-holidays-container">
  
  <div v-if="status=='success'">
    <table>
      
      <tr>
        <th>start</th>
        <th>end</th>
        <th>comment</th>
      </tr>
      <tr v-for="record in holidays">
        <td>{{record.start}}</td>
        <td>{{record.end}}</td>
        <td>{{record.comment}}</td>
      </tr>
    </table>
  </div>
</div>
</template>

<script lang="js">

export default {
    name:"ListHolidays",
    data(){
        return {
            status: '',
            holidays: '',
        };
    },
    components: {
        
    },
    props: {
    },
    computed: {
        user_pk: function() {
            return this.$route.params.pk;
        },
        programme_pk: function() {
            return this.$route.params.programme_pk;
        },
        url: function(){
            return `${process.env.VUE_APP_BASE_URL}/api/users/${this.user_pk}/programmes/${this.programme_pk}/holiday`;
        },
    },
    methods: {
        fetch_holidays: function(){
            this.$http({url: this.url, params: {}, method: 'GET'})
                .then(resp => {
                    this.status='success';
                    this.error_message="";
                    this.errors={};
                    this.holidays = resp.data['results'];
                })
                .catch(err => {
                    this.status="error";
                    console.log(err);
                });
        }
    },
    mounted(){
        this.fetch_holidays();
        this.$store.dispatch("theme/set_theme_white");
    },

}
</script>

<style lang="scss">
.list-holidays-container {

}
</style>
