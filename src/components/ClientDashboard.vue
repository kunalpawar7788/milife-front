<template>
<div class="client-dashboard" ref="clientdashboard" v-if="status=='ready'">
  <WeightSummaryCard :fobj_user="user"> </WeightSummaryCard>

  <section class="calorie-summary bg-green br-20 mt-10">
    <div class="calorie-target">
      {{data.calorie}}
    </div>
    <div class="message">
      Calorie Target
    </div>
    <div class="link" v-on:click="goto_view_meal_breakdown">
      View Breakdown &gt
    </div>
  </section>

  <section class="progress-report-summary ">
    <table class="bg-yellow br-20 mt-10 fc-darkgrey">
      <thead class="fc-black">
        <tr>
          <th> </th>
          <th>{{this.pr[1].month}}</th>
          <th>{{this.pr[0].month}}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td> Body Fat</td>
          <td class="fw-500">{{this.pr[1].body_fat}}</td>
          <td class="fw-500">{{this.pr[0].body_fat}}</td>
        </tr>
        <tr>
          <td> % Body Fat</td>
          <td class="fw-500">{{this.pr[1].percentage_body_fat}}<span class="opacity-34">%</span></td>
          <td class="fw-500">{{this.pr[0].percentage_body_fat}}<span class="opacity-34">%</span></td>
        </tr>
        <tr>
          <td> Muscle Mass</td>
          <td class="fw-500">{{this.pr[1].muscle_mass}}</td>
          <td class="fw-500">{{this.pr[0].muscle_mass}}</td>
        </tr>
        <tr>
          <td> % Muscle Mass</td>
          <td class="fw-500">{{this.pr[1].percentage_muscle_mass}}<span class="opacity-34">%</span> </td>
          <td class="fw-500">{{this.pr[0].percentage_muscle_mass}}<span class="opacity-34">%</span> </td>
        </tr>

        <tr class="fc-black">
          <td class="bg-yellow2">
            <span class="pl-10">Starts from
              <template  v-if="this.data.programme" > {{this.data.programme.start_date}} </template>
            </span>
          </td >
          <td class="bg-yellow2" colspan="2" v-on:click="goto_detailed_report">
            <span class="pr-10">View more &gt</span>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <div class="last-line flex-spacebetween">
    <section
      class="message-button bg-green br-50 mt-10 flex-spacebetween"
      v-on:click="goto_message_list"
      >
      <span class="pd-20"> Messages </span>
      <span class="pd-20"> {{this.data.messages_count}}</span>
    </section>

    <section
      class="log-weight-cta bg-magenta br-10 mt-10 ml-10"
      v-on:click="goto_log_weight"
      >

    </section>
  </div>
</div>
</template>

<script>
import store from '@/store'
import WeightSummaryCard from "@/components/weight/WeightSummaryCard.vue";

export default {
    name: 'ClientDashboard',
    data() {
        return {
            data:{},
            status: 'initial',
        }
    },
    components: {
        WeightSummaryCard,
    },

    computed: {
        user: function(){
            var d = Object.assign({}, this.$store.state.auth.user);
            console.log(d);
            return d;
        },
        pr: function(){
            return this.data.progress_report;
        },
    },

    methods: {
        goto_detailed_weight_chart: function(){
            console.log('detiled weight chart');

        },
        goto_message_list: function(){
            console.log('messages list');
        },
        goto_log_weight: function(){
            console.log('log_weight');

        },
        goto_view_meal_breakdown: function(){
            console.log('meal_breakdown');
        },
        goto_detailed_report: function(){
            console.log('detailed_report');
            this.$router.push({name: 'self-progress-chart'});
        },
        fetch_dashboard_data: function() {
            const url = process.env.VUE_APP_BASE_URL+'/api/dashboard/' + this.user.id;
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
    mounted(){
        console.log(this.chart_width);
    },
    created(){
        this.fetch_dashboard_data();

    },

}
</script>

<style lang="scss">
.left-half{
    margin: auto;
    width: 50%;
}
.client-dashboard{
    padding: 10px;
}
section.weight_summary{
    height: 22vh;
    display:flex;
    flex-direction: column;
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
    }

    * {
        /* border: 1px solid red; */
    }
}

section.calorie-summary{
    margin-top: 10px;
    height: 10vh;
    display: grid;
    grid-template-columns: 2fr 3fr;
    grid-template-rows: 1fr 1fr;

    * {
        color: white;
    }

    .calorie-target {
        grid-column: 1 / 1;
        grid-row: 1/ span 2;
        justify-self: center;
        align-self: center;
        font-size: 34pt;
        letter-spacing: .31px;
    }

    .message {
        align-self: end;
        font-size: 18px;
    }
    .link {
        align-self: start;
        font-size: 14px;
    }
}
section.progress-report-summary{
    /* height: 30vh; */
    table {
        width: 100%;
        border-collapse: collapse;
        * {
            padding: 5px;
        }


        th{
            text-align:left;
        }

        td{
            text-align: left;
            @extend .pd-10;
            padding-left: 20px;
        }
        td:first-child{
            width: 50%;
        }
        td:not(:first-child){
            width: 25%;
        }
        tbody  tr:not(:last-child) {
            border-bottom: 1px solid white;
        }

        tbody tr:last-child{
            td:first-child {
                border-radius: 0px 0px 0px 20px;
            }
            td:last-child{
                border-radius: 0px 0px 20px 0px;
                text-align: right;
            }

        }
    }
}

section.message-button {
    width: 80%;
    div {
        margin: 0 auto;
        span {
            padding-left: 30px;
        }
    }
}

section.log-weight-cta{
    height: 70px;
    width: 70px;
}
div.last-line{
}
</style>
