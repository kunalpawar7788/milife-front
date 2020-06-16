<template>

<section class="weight-summary-card bg-darkblue br-20 mt-10" ref="weightSummarySection">
<template v-if="status=='ready'">
    <div class="body">
      <div class="left-half">
        <div class="current_weight fc-white">
    <template v-if="current_weight">{{current_weight.weight | round_off(2) }}</template> kg
        </div>
        <div class="target_weight fc-white">
          <template v-if="current_target"> Target {{current_target.target_weight | round_off(2) }} kg</template>
          <template v-else> Target -- </template>

        </div>
      </div>
      <div class="right-half">
        <MiniWeightChart
        :height="chart_height"
        :width="chart_width"
        :weight_log="weight_log"
        :target_weights="target_weights"
        ></MiniWeightChart>
      </div>
    </div>
    <footer v-on:click="goto_detailed_weight_chart">
      <span>View Detailed Chart</span>
      <img src="@/assets/images/next-arrow.svg" />
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
    props: ['fobj_user', 'data_dashboard'],
    // weight_list_dashboard is the weight log fetched from the ClientDashboard.vue 

    computed: {
        is_admin: function() {
            return this.$store.state.auth.user.is_staff;
        },
        user: function() {return this.fobj_user;},
        chart_height: function() {
            return window.innerHeight * 0.22 * 0.65 ;
        },
        chart_width: function() {
            if (window.innerWidth > 600)
                return  600 * 0.95 * 0.45;
            return window.innerWidth * 0.95 * 0.45;
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
            return this.$_.last(this.target_weights);
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

        set_weight_chart_data: function() {
            this.data = this.data_dashboard;
            this.status = "ready";
        },

    },
    created: function() {
        this.set_weight_chart_data();
    },
}
</script>

<style lang="scss">
  .left-half{
    margin: auto;
    width: 50%;
}
  .right-half {
    margin: auto;
  }

.weight-summary-card {
    height: 22vh;
    width: 95%;
    margin-right: auto;
    margin-left: auto;
    display:flex;
    flex-direction: column;
    padding: 1px 10px 1px 10px;
    .body {
        align-self: stretch;
        height: 80%;
        display: flex;
    }
    .current_weight {
        line-height: 9vh;
        font-size: calc(1em + 2.3vw);
    }
    .target_weight {
        line-height: 4vh;
        font-size: calc(0.6em + 1vw);
    }

    footer {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        align-self: center;
        border-top: 1px solid whitesmoke;
        width: 100%;
        padding: 5px 10px;
        color: white;
        cursor: pointer;
        font-size: calc(10pt + 0.5vmin);

        img {
          margin-left: 0.5em;
          max-width: 100%;
          height: 60%;
        }
    }

    * {
        /* border: 1px solid red; */
    }
}
</style>
