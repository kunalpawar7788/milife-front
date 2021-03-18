<template>
<div class="progresschart-container pl-10 pr-10" v-if="status=='ready'">
  <div class="menu">
    <SliderMenu
      v-bind:checkin_dates="checkin_dates"
      v-model="selected_checkin_date"
      ></SliderMenu>
  </div>
  <PictureSlider
    v-bind:pictures="pictures"
    ></PictureSlider>
  <BodyTypeProgressionChart
    v-if="body_type_progression_data.length > 0"
    :datapoints="body_type_progression_data"
    :gender="user.gender"
    :chartWidth="chart_width"
    :chartHeight="chart_height"
    >
  </BodyTypeProgressionChart>

  <AddCoachCheckinComment
    v-if="checkin_comment!={}"
    :fobj_user="fobj_user"
    :message_obj="checkin_comment"
    >
  </AddCoachCheckinComment>

  <h3> Charts & Stats </h3>
  <StatsAndCharts
    :fobj_user="fobj_user"
    :progress_report="progress_report_by_date"
    :selected_checkin_date="selected_checkin_date"
    :checkin_dates="checkin_dates"
    v-if="selected_checkin_date!=null"
    >
  </StatsAndCharts>
  <div class="button" v-if="false" v-on:click="download_report">
    Download Report
  </div>
</div>
</template>

<script>
import moment from 'moment';
import SliderMenu from "@/components/progress-chart/SliderMenu.vue";
import BodyTypeProgressionChart from "@/components/progress-chart/BodyTypeProgressionChart.vue";
import StatsAndCharts from "@/components/progress-chart/StatsAndCharts.vue";
import PictureSlider from "@/components/progress-chart/PictureSlider.vue";
//import AddCoachCommentComponent from "@/components/AddCoachCommentComponent.vue";
import AddCoachCheckinComment from "@/components/progress-chart/AddCoachCheckinComment.vue";

export default {
    name:"ProgressChart",
    props: ["fobj_user",],
    components: {
        SliderMenu,
        BodyTypeProgressionChart,
        StatsAndCharts,
        PictureSlider,
        AddCoachCheckinComment,
    },
    data() {
        return {
            errors: {},
            progress_report: {},
            selected_checkin_date: null,
            status: "waiting"
        }
    },

    computed: {
        checkin_comment: function(){
            var selected_progress_report = this.progress_report_by_date[this.selected_checkin_date]
            if (selected_progress_report) {
                return selected_progress_report.comment;
            }
            else {
                return {};
            }
        },
        pictures: function(){
            if (this.progress_report.length>0 && this.selected_checkin_date !=null){
                var first_checkin_date = this.checkin_dates[0].id;
                console.log(this.progress_report, this.progress_report_by_date, this.selected_checkin_date, first_checkin_date);

                return {
                    original_front_profile: this.progress_report_by_date[first_checkin_date].photo_front_profile,
                    original_side_profile: this.progress_report_by_date[first_checkin_date].photo_side_profile,
                    current_side_profile: this.progress_report_by_date[this.selected_checkin_date].photo_side_profile,
                    current_front_profile: this.progress_report_by_date[this.selected_checkin_date].photo_front_profile,
                };
            }
            return {};

        },
        checkin_dates_frequency_d: function(){
            var counts = {}
            this.$_.forEach(this.progress_report, function(o){
                var month_year = moment(o.date_of_checkin, "DD-MM-YYYY").format("MM-YYYY");
                if (counts[month_year] == null){
                    counts[month_year] = 1;
                }
                else {
                    counts[month_year] += 1;
                }
            })
            return counts;
        },
        checkin_dates: function(){
            var d = []
            this.$_.forEach(this.progress_report, function(o){
                var mobj = moment(o.date_of_checkin, "DD-MM-YYYY"),
                    month_year = mobj.format("MM-YYYY");
                d.push({
                    mobj: mobj,
                    frequency: this.checkin_dates_frequency_d[month_year],
                    id: mobj.format("DD-MM-YYYY"),
                })
            }.bind(this))

            return this.$_.sortBy(d, function(o){return o.mobj})
        },

        user: function() {
            var user = Object.assign({}, this.$store.state.auth.user);
            if(this.$route.params.pk){
                user = Object.assign({}, this.fobj_user);
            }
            return user;
        },
        body_type_progression_data: function(){
            var l = [];
            this.$_.forEach(this.progress_report, function(value){
                l.push({
                    'date': value.date_of_checkin,
                    'bmi': parseFloat(value.body_mass_index),
                    'bfp': parseFloat(value.percentage_body_fat),
                });
            }.bind(this));
            return l;
        },
        progress_report_by_date: function() {
            var d = {};
            this.$_.forEach(this.progress_report, function(value){
                d[value.date_of_checkin] = value;
            }.bind(this));
            return d;
        },
        chart_width: function() {
            let width = window.innerWidth * 0.85;
            return  width > 500 ? 500 : width;
        },
        chart_height: function() {
            let height = window.innerHeight * 0.60;
            return height > 500 ? 500 : height;
        }
    },

    methods: {
        goto_commentry: function(){
            console.log('Implement this> view commentry');
            //this.$router.push({name: 'upload-csv'});
        },
        download_report:function(){
            alert('not implemented');
        },
        date_sort_asc: function (date1, date2) {
            // This is a comparison function that will result in dates being sorted in
            // ASCENDING order. As you can see, JavaScript's native comparison operators
            // can be used to compare dates. This was news to me.
            if (date1 > date2) return 1;
            if (date1 < date2) return -1;
            return 0;
        },
        date_sort_desc: function (date1, date2) {
            // This is a comparison function that will result in dates being sorted in
            // DESCENDING order.
            if (date1 > date2) return -1;
            if (date1 < date2) return 1;
            return 0;
        },
        fetch_progress_report: function(){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + "/progress-report";
            this.status = "initial"
            this.$http({url: url, method: 'GET', params: {deleted: false}})
                .then(resp => {
                    this.error_message="";
                    this.errors={};
                    this.progress_report= resp.data.results;
                    this.status="ready"
                })
                .catch(err => {
                    this.errors = errors;
                    this.status="error";
                });
        }
    },
    mounted() {
        this.$store.dispatch("theme/set_theme_blue");
        this.fetch_progress_report();
    },
    created() {},
}


</script>

<style lang="scss">
.progresschart-container{
    overflow: hidden;
    /* display: grid; */
    grid-template-columns: 1fr 80% 1fr;

    .menu{
        grid-column: 2;
    }
    .debug {
        padding-top: 100px;
        grid-column: 2;
    }
    div{
        grid-column: 2;
    }
    svg {
        grid-column: 1 3;
    }
}
</style>
