<template>
<section class="weight-progress-chart">
  <h3> Weight Progress Chart </h3>

  <div v-if="status == 'ready'">
    <div class="dates fc-white">
      <span class="dates_begin fw-600">{{ first_date | moment('MMM YY') | uppercase }}</span>
      <span>to</span>
      <span class="dates_end fw-600">{{ last_date | moment('MMM YY') | uppercase }}</span>
    </div>
    <div class="weight-chart-container" :style="css_vars">
      <MiniWeightChart
        :height="chart_height"
        :width="chart_width"
        :weight_log="weight_log"
        :target_weights="target_weights"
        :show_axes="true"
        ></MiniWeightChart>
    </div>
    <div class="legend">
      <div class="legend_boxT"></div>
      <div class="legend_labelT fc-white">Target</div>
      <div class="legend_boxP"></div>
      <div class="legend_labelP fc-white">Progress</div>
    </div>

    <div class="pd-10">
      <p class="pd-10 fn-12 fc-white fw-500">
        You have
        <template v-if="weight_delta>0">lost {{weight_delta}} kg</template>
        <template v-else>gained {{-weight_delta}} kg</template><br>

        You have
        <template v-if="left_to_lose>0">{{left_to_lose}} kg left to lose</template>
        <template v-else> {{-left_to_lose}} left to gain </template>
        <br>

        To achieve that, you need to
        <template v-if="weekly_loss_target>0">lose {{weekly_loss_target}} kg per week</template>
        <template v-else>gain {{-weekly_loss_target}} kg per week</template>
      </p>

      <div class="comment">
        <p class="comment_heading pd-10 fc-green fn-14 fw-500" >Coach's Commentary</p>
        <div v-if="comments">
          <div
            v-for="(comment, index) in comments"
            :key="index"
            class="comment_content pd-10 fc-white fn-12"
          >
            <p>{{ comment.content }}</p>
            <p class="align-left">
              By <strong>{{ comment.sender.first_name + ' ' + comment.sender.last_name }}</strong>
            </p>
            <p class="align-right">
              On <strong>{{ comment.created_at | display_date }}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>

    <AddCoachCommentComponent
      :fobj_user="fobj_user"
      kind="weekly-commentry"
      ></AddCoachCommentComponent>
  </div>
  <div class="fc-white" v-else-if="status == 'error'">Error: {{ error_msg }}</div>
  <div class="fc-white" v-else>Loading</div>

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
            error_msg: "",
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
            return screen.height * 0.38;
        },
        chart_width: function() {
            let width = window.innerWidth * 0.80;
            return width < 600 ? width : 600;
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
                days_left = 7;
            }

            var val = 7 * this.left_to_lose / days_left;
            return this.round_off2(val);
        },

        first_date: function() {
          return this.$_.first(this.weight_log).measured_on;
        },

        last_date: function() {
          return this.$_.last(this.weight_log).measured_on;
        },
        css_vars: function() {
            return {
                "--weight-chart-container-height": (this.chart_height + 30) + 'px',
            }
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
                    console.log("cc", this.comments)
                    //this.status = "ready";
                })
                .catch(err => {
                    //this.status='error';
                    console.log(err);
                });

        },
        fetch_weight_chart_data: function() {
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + '/weight-chart';
            console.log("hduwhwkhdkw");
            this.$http({url: url, method: 'GET'})
                .then(resp => {
                    this.data = resp.data;
                    this.status = "ready";
                })
                .then(this.verify_data)
                .catch(err => {
                    this.status='error';
                    this.error_msg = "Couldn't fetch weight data"
                    console.log(err);
                });
        },

        verify_data: function() {
          if (this.data.weight_log.length == 0) {
            this.status = 'error';
            this.error_msg = 'No weight entries exist';
          } else if (this.data.target_weight.length == 0) {
            this.status = 'error';
            this.error_msg = 'No target weight entries exist';
          }
        }
    },
    filters: {
        uppercase: function(v) {
          return v.toUpperCase();
        }
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
.weight-progress-chart {
    color: white;

    p {
        margin-bottom: auto;
        text-align: left;
        line-height: 1.5em;
    }

    .comment {
        .comment_heading {
            margin-top: 0;
        }

        .comment_content {
            color: white;
            background-color: darken($milife-blue, 5%);
            padding-top: 0.1em;
            padding-bottom: 3em;
            padding-left: 15px;
            padding-right: 15px;
            border-radius: 10px;
            margin: 10px 0px;

            .align-left {
                font-size: 10pt;
                margin-left: 0;
                padding-right: 15px;
                float: left;

                strong {
                    font-weight: 600;
                }
            }

            .align-right{
                font-size: 10pt;
                margin-right: 0;
                padding-left: 15px;
                float: right;
                margin-bottom: 14px;

                strong {
                    font-weight: 600;
                }
            }
        }
    }
}

.weight-chart-container{
    // height is set dynamically based on
    // the computed property `chart_height`
    height: var(--weight-chart-container-height);
    display: flex;
    justify-content: center;
    background-color: darken($milife-blue, 5%);

    div.weight-chart{
        display: block;
        color: white;
    }

    svg {
        background-color: darken($milife-blue, 5%) !important;
    }

}

.dates {
    background-color: darken($milife-blue, 5%);
    margin-top: 1.5em;
    padding-top: 1em;
    padding-bottom: 0.5em;

    .dates_begin {
      padding-right: 1em;
    }

    .dates_end {
      padding-left: 1em;
    }
}

.legend {
    display: flex;
    align-items: center;
    padding-bottom: 1em;
    padding-left: 4em;
    font-size: small;
    background-color: darken($milife-blue, 5%);

    .legend_boxT {
        width: 10px;
        height: 10px;
        margin-right: 0.5em;
        background-color: $milife-darkgreen;
    }

    .legend_labelT {
        margin-right: 1em;
    }

    .legend_boxP {
        width: 10px;
        height: 10px;
        margin-right: 0.5em;
        background-color: $milife-orange;
    }

    .legend_labelP {
        margin-right: 1em;
    }
}

</style>
