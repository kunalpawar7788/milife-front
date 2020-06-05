<template>
<div class="list-holidays-container">
  
  <div v-if="status=='success'">
      <div class="holiday_list-block" v-for="record in holidays">
          <div class="holiday_list-dates">
              <div class="holiday_list-startdate">
                  <p class="margin-0 fnt-bold">Start</p>
                  <p class="margin-0">{{ record.start }}</p>
              </div>
              <div class="holiday_list-enddate">
                  <p class="margin-0 fnt-bold">End</p>
                  <p  class="margin-0">{{ record.end }}</p>
              </div>
          </div>
          <div class="holiday_list-comment">
              <p class="margin-0 fnt-bold">Comment</p>
              <p class="margin-0">{{ record.comment }}</p>
          </div>
      </div>
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

<style lang="scss" scoped>

        .holiday_list-dates{
            padding: 5px 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            p{
                color:  black;
                text-align: left;
            }
        }

        .margin-0{
            margin: 0px 0px;
        }

        .fnt-bold{
            font-weight: bold;
        }

        .holiday_list-comment{
            text-align: left;
            padding: 10px;
            p{
                color: black;
            }

            &:after{
                content: "";
                display: block;
                margin-top: 10px;
                border-top: 1px solid #cacaca;
                padding: 0px 10px;
            }
        }
</style>
