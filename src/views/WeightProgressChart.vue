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

  <p class="pd-10 bg-darkblue" v-if="comments[0]"> <strong> Last comment: </strong>
    {{comments[0].content}} <br>

  </p>

  <div v-if="allow_comment">
    <textarea
      cols="30"
      id=""
      name=""
      rows="10"
      v-model="message"
      class="br-20 width-80 border-box pd-10">
    </textarea>

    <div class="button margin-auto pd-10 br-10 width-80" v-on:click="submit_comment()"> Save </div>
  </div>

</section>

</template>

<script>
import WeightChart from "@/components/WeightChart.vue";
import MiniWeightChart from "@/components/MiniWeightChart.vue";
import moment from 'moment';
export default {
    // weekly commentry screen.
    name: "WeightProgressChart",
    components: {
        MiniWeightChart,
    },

    props: ['fobj_user', ],
    data() {
        return {
            status: 'initial',
            data: "",
            allow_comment: true,
            message: "",
            comments: {},
        };
    },

    computed: {
        user: function() {return this.fobj_user;},
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

            var val = 7*this.left_to_lose / days_left;
            return this.round_off2(val);
        }


    },
    methods: {
        round_off2: value => Math.round(value*100)/100,

        submit_comment: function(){
            return new Promise((resolve, reject) => {
                const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + "/message";
                var data = {
                    content: this.message,
                    kind: "weekly-commentry"
                }

                this.$http({url: url, method: "POST", data: data})
                    .then(resp => {
                        resolve(resp);
                        this.$router.go('-1');
                    })
                    .catch(err => {
                        this.status='error';
                        console.log(err);
                        reject(err);
                    });
            });

        },
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
