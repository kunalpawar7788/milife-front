<template>
<section class="weight-progress-chart">
  <h3> Weight Progress Chart </h3>

  <div class="weight-chart-container" v-if="status=='ready'">
    <MiniWeightChart
      :height="chart_height"
      :width="chart_width"
      :weight_log="weight_log"
      :target_weights="target_weights"
      :show_axes="true"
      ></MiniWeightChart>
  </div>
  <div class="weight-chart-container" v-else> loading</div>

  <p class="pd-10 bg-darkblue">
    You have
    <template v-if="weight_delta>0">lost {{weight_delta}} kg.</template>
    <template v-else>gained {{-weight_delta}} kg</template><br>

    You have
    <template v-if="left_to_lose>0">{{left_to_lose}}kg left to lose.</template>
    <template v-else> {{-left_to_lose}} left to gain. </template>
    <br>

    To achieve that, you need to
    <template v-if="weekly_loss_target>0">lose {{weekly_loss_target}}kg per week.</template>
    <template v-else>gain {{-weekly_loss_target}} kg per week.</template>

  </p>

  <span class=" ml-10 fc-green fn-14 fw-600" >Coach's Commentry</span>

  <p class="pd-10 bg-darkblue fn-11 fc-grey" v-if="comments[0]"> Latest Comment Dated: <strong>{{comments[0].modified_at | moment("Do MMMM YY")}} </strong> <br> <br>
    <span class="fn-12 bg-darkblue fc-white">{{comments[0].content}}</span>

  </p>

  <AddCoachCommentComponent
    :fobj_user="fobj_user"
    kind="weekly-commentry"
    ></AddCoachCommentComponent>

</section>

</template>

<script>
import WeightChart from "@/components/WeightChart.vue";
import MiniWeightChart from "@/components/MiniWeightChart.vue";
import AddCoachCommentComponent from "@/components/AddCoachCommentComponent.vue";

import moment from 'moment';
export default {
    // weekly commentry screen.
    name: "WeightProgressChart",
    components: {
        AddCoachCommentComponent,
        MiniWeightChart,
    },

    props: ['fobj_user', ],
    data() {
        return {
            status: 'initial',
            data: "",
            comments: {},
        };
    },

    computed: {
        is_admin: function() {
            return this.$store.state.auth.user.is_staff;
        },

        user: function() {
            if (this.fobj_user && this.is_admin) {
                return this.fobj_user;
            }
            else {
                console.log( 'userid', this.$store.state.auth.user.id);
                return this.$store.state.auth.user;
            }
        },
        user_pk: function(){
        },
        chart_height: function() {
            return screen.height * 0.40;
        },
        chart_width: function() {
            return window.innerWidth * 0.80;
        },
        weight_log: function(){
            return this.$_.orderBy(this.data.weight_log, 'measured_on');
        },
        current_weight: function(){
            return this.$_.last(this.weight_log);
        },

        target_weights: function(){
            return this.$_.orderBy(this.data.target_weight, 'target_date');
        },

        current_target: function(){
            var d = {};
            for(var i=0; i<this.target_weights.length; i++){
                d[this.target_weights[i].target_date] = this.target_weights[i].target_weight;
            }
            return  d[new Date()];
        },

        weight_delta: function(){
            //change in weight
            return this.round_off2(this.weight_log[0].weight - this.current_weight.weight);
        },

        left_to_lose: function(){
            var val = this.current_weight.weight - this.$_.last(this.target_weights).target_weight;
            return this.round_off2(val);
        },

        weekly_loss_target: function(){
            var today = moment();
            var target_date = moment(this.$_.last(this.target_weights).target_date, 'YYYY-MM-DD');
            var days_left = target_date.diff(today, 'days')
            if (days_left <=0) {
                days_left = 1;
            }

            var val = 7*this.left_to_lose / days_left;
            return this.round_off2(val);
        }


    },
    methods: {
        round_off2: value => Math.round(value*100)/100,

        fetch_previous_comment: function(){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + '/message';
            var params = {
                kind: 'weekly-commentry',
                ordering: '-created_at',
            };

            this.$http({url: url, params: params, method: 'GET'})
                .then(resp => {
                    this.comments = resp.data.results;
                    //this.status = "ready";
                })
                .catch(err => {
                    //this.status='error';
                    console.log(err);
                });

        },
        fetch_weight_chart_data: function() {
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + '/weight-chart';
            this.$http({url: url, method: 'GET'})
                .then(resp => {
                    this.data = resp.data;
                    this.status = "ready";
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },

    },
    created() {
        this.fetch_weight_chart_data();
        this.fetch_previous_comment();
        this.$store.dispatch("theme/set_theme_blue");
    },
    mounted() {},


}
</script>


<style lang="scss">
.weight-chart-container{
    height: 50vh;
    display: flex;
    justify-content: center;
    div.weight-chart{
        display: block;
    }


}

</style>
