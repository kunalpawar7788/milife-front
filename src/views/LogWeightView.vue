<template>
<section class="log-weight-view-container">
  <header><h3 class="fc-white"> Log Weight </h3></header>
  <center>
    <LogWeightComponent
      :fobj_user="user"
      v-on:weight-updated="fetch_weight_log"
      ></LogWeightComponent>

    <table class="weight-table" v-if="false">
      <thead>
        <tr>
          <th>Date</th>
          <th>Weight</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="wl in weight_logs">
          <td style="border-right: 2px solid grey">{{wl.measured_on}}</td>
          <td>{{wl.weight}}</td>
        </tr>
      </tbody>
    </table>
  </center>

  <WeightSummaryCard :fobj_user="user" v-if="false"></WeightSummaryCard>
</section>
</template>

<script>
import LogWeightComponent from "@/components/LogWeightComponent";
import WeightChart from "@/components/WeightChart";
import WeightSummaryCard from "@/components/weight/WeightSummaryCard";

export default {
    name: "LogWeightView",
    props: ['fobj_user', ],
    components: {
        LogWeightComponent,
        WeightChart,
        WeightSummaryCard,
    },
    computed: {
        user() {

            if(this.$route.params.pk){
                var d = Object.assign({}, this.fobj_user);
            }
            else {
                var d = Object.assign({}, this.$store.state.auth.user);
            }
            console.log(d);
            return d;
        },
    },
    watch: {

    },

    data() {
        return {
            status: "initiated",
            error_message: "",
            errors: {},
            weight_logs: [],
        };
    },

    methods: {
        fetch_weight_log: function() {
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + "/weight";
            this.$http({url: url, method: 'GET'})
                .then(resp => {
                    this.status='success';
                    this.error_message="";
                    this.errors={};
                    this.weight_logs = resp.data.results;
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });

        },
    },
    mounted() {
        this.$store.dispatch("auth/fetch_profile");
        console.log(this.fobj_user);
        this.fetch_weight_log();
        this.$store.dispatch("theme/set_theme_blue");

    }
}
</script>

<style lang="scss">
.log-weight-view-container {
    color: black;
    input {
        border: 1px solid lighten(grey, 20%);
    }

    .weight-table{
        padding-top: 20px;

    }
}
</style>
