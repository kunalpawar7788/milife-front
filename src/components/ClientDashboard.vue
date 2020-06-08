<template>
<div class="client-dashboard" ref="clientdashboard" v-if="status=='ready'">
  <WeightSummaryCard 
    :fobj_user="user"
    :weight_list_dashboard="this.data.weight_log"
  > </WeightSummaryCard>

  <section class="calorie-summary bg-green br-20 mt-10">
    <div class="calorie-target">
      {{data.calorie}}
    </div>
    <div class="message">
      Calorie Target
    </div>
    <div class="link" v-on:click="goto_view_meal_breakdown">
      View breakdown &gt
    </div>
  </section>

  <section class="progress-report-summary ">
    <table class="bg-yellow br-20 mt-10 fc-darkgrey">
      <thead class="fc-black">
        <tr>
          <th> </th>
          <th v-if="this.pr[1]">{{this.pr[1].month}}</th>
          <th v-if="this.pr[0]">{{this.pr[0].month}}</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td> Body Fat</td>
          <td class="fw-500" v-if="this.pr[1]">{{this.pr[1].body_fat}}</td>
          <td v-else> -- </td>
          <td class="fw-500"v-if="this.pr[0]">{{this.pr[0].body_fat}}</td>
          <td v-else> -- </td>
        </tr>
        <tr>
          <td> % Body Fat</td>
          <td class="fw-500" v-if="this.pr[1]">{{this.pr[1].percentage_body_fat}}<span class="opacity-34">%</span></td>
          <td v-else> -- </td>
          <td class="fw-500" v-if="this.pr[0]">{{this.pr[0].percentage_body_fat}}<span class="opacity-34">%</span></td>
          <td v-else> -- </td>
        </tr>
        <tr>
          <td> Muscle Mass</td>
          <td class="fw-500" v-if="this.pr[1]">{{this.pr[1].muscle_mass}}</td>
          <td v-else> -- </td>
          <td class="fw-500" v-if="this.pr[0]">{{this.pr[0].muscle_mass}}</td>
          <td v-else> -- </td>
        </tr>
        <tr>
          <td> % Muscle Mass</td>
          <td class="fw-500" v-if="this.pr[1]">{{this.pr[1].percentage_muscle_mass}}<span class="opacity-34">%</span> </td>
          <td v-else> -- </td>
          <td class="fw-500" v-if="this.pr[0]">{{this.pr[0].percentage_muscle_mass}}<span class="opacity-34">%</span> </td>
          <td v-else> -- </td>
        </tr>

        <tr class="fc-black">
          <td class="bg-yellow2" colspan="3">
            <div>
              <span class="">Stats from
                <template  v-if="this.data.first_checkin" > {{this.data.first_checkin.date_of_checkin | moment("DD.MM.YYYY")}} </template>
              </span>
              <span class="pr-10" v-on:click="goto_detailed_report">View More &gt</span>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </section>

  <div class="last-line flex-spacebetween">
    <section
      class="message-button bg-green fc-white br-50 mt-10 flex-spacebetween"
      v-on:click="goto_message_list">
      <span class="message-button-span fn-14"> Messages </span>
      <span class="mr-20 mt-15">
        <MessageCountBubble> {{data.messages_count}} </MessageCountBubble>
      </span>
    </section>

    <section
      class="log-weight-cta bg-magenta br-10 mt-10 ml-10"
      v-on:click="goto_log_weight"
      >
      <img src="@/assets/images/weight-log.svg"/>
    </section>
  </div>
</div>
</template>

<script>
import store from '@/store'
import WeightSummaryCard from "@/components/weight/WeightSummaryCard.vue";
import MessageCountBubble from '@/components/MessageCountBubble.vue';

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
        MessageCountBubble,
    },

    computed: {
        user: function(){
            var d = Object.assign({}, this.$store.state.auth.user);
            return d;
        },
        pr: function(){
            return this.data.progress_report;
        },
    },

    methods: {
        goto_message_list: function(){
            this.$router.push({name: 'message-list-view'});
        },
        goto_log_weight: function(){
            this.$router.push({name: 'log-weight-view-self'});
        },
        goto_view_meal_breakdown: function(){
            this.$router.push({name: 'my-mealplan-summary'});
        },
        goto_detailed_report: function(){
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
                });
        },
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
        font-weight: 600;
    }

    .link {
        align-self: start;
        font-size: 14px;
        margin-top: 1%;
    }
}
section.progress-report-summary{
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

            td:last-child{
                border-radius: 0px 0px 20px 20px;

                div {
                  display: flex;
                  justify-content: space-between;
                  padding: 0 3% 0 0;
                }
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

    img {
        width: 100%;
    }
}

section.weight-summary-card {
    background-color: $milife-blue !important;
}

.message-button-span {
    margin-top: auto;
    margin-bottom: auto;
    margin-left: 10%;
}

</style>
