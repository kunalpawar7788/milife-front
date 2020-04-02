<template>

<section class="weight-summary-card bg-darkblue br-20 mt-10" ref="weightSummarySection">
<template v-if="status=='ready'">
    <div class="body">
      <div class="left-half">
        <div class="current_weight heading-1 fc-white">
    <template v-if="current_weight">{{current_weight.weight | round_off(2) }}</template> kg
        </div>
        <div class="target_weight label-1">
          <template v-if="current_target"> Target {{current_target}} </template>
          <template v-else> Target -- </template>

        </div>
      </div>
      <MiniWeightChart
        :height="chart_height"
        :width="chart_width"
        :weight_log="weight_log"
        :target_weights="target_weights"
        ></MiniWeightChart>
    </div>
    <footer v-on:click="goto_detailed_weight_chart">
    View Detailed Chart &gt;
    </footer>
    </template>
  </section>
</template>

<script>
import MiniWeightChart from "@/components/MiniWeightChart.vue";
import moment from 'moment';
export default {
    name: "WeightSummaryCard",
    components: {MiniWeightChart, },
    data() {
        return {
            status: 'initial',
            data: "",
        };
    },
    props: ['fobj_user', ],

    computed: {
        is_admin: function() {
            return this.$store.state.auth.user.is_staff;
        },
        user: function() {return this.fobj_user;},
        chart_height: function() {
            return screen.height * 0.14;
        },
        chart_width: function() {
            return window.innerWidth * 0.50;
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
            return  d[moment().format("YYYY-MM-DD")];
        },

    },
    methods: {
        goto_detailed_weight_chart: function(){

            if (this.is_admin) {
                console.log('detiled weight chart');
                this.$router.push({name: "weight-progress-chart-admin-view", params: ""});

            }
            else {
                this.$router.push({name: "weight-progress-chart-self", params: ""});
            }


        },

        fetch_weight_chart_data: function() {
            console.log("#####################");
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + '/weight-chart';
            this.$http({url: url, params:this.params, method: 'GET'})
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
    created: function() {
        this.fetch_weight_chart_data();
    },
}
</script>

<style lang="scss">
  .left-half{
    margin: auto;
    width: 50%;
}

.weight-summary-card {
    height: 22vh;
    display:flex;
    flex-direction: column;
    padding: 1px 10px 1px 10px;
    .body {
        align-self: stretch;
        height: 80%;
        display: flex;
    }
    .current_weight {
        /* color: white; */
        /* font-size: 35pt; */
    }
    .target_weight {
        color: white;
        font-size: 18pt;
    }

    footer {
        align-self: flex-end;
        border-top: 1px solid white;
        width: 100%;
        padding: 5px;
        color: white;
        cursor: pointer;
    }

    * {
        /* border: 1px solid red; */
    }
}
</style>
