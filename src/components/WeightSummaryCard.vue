<template>
<section class="weight-summary-card-container">
  {{ready}} {{user}}
  <div v-if="ready==true">
    <WeightChart
      :data="weight_logs"
      :target_weights="target_weights"
      height="400"
      width="600"
      ></WeightChart>
  </div>
</section>
</template>

<script>
import WeightChart from "@/components/WeightChart";
import moment from "moment";

export default {
    name: "WeightSummaryCard",
    props: ['fobj_user', ],
    components: {WeightChart, },
    data() {
        return {
            weight_logs: [],
            target_weights: [],
            programmes: [],
            
            weight_fetch_status: false,
            target_fetch_status: false,
        };
    },
    computed: {
        user() {return Object.assign({}, this.fobj_user);},
        ready() {
            var data = this.weight_fetch_status && this.target_fetch_status;
            console.log(this.weight_fetch_status, this.target_fetch_status);
            return data
        },
    },
    methods: {
        get_target_weight_plot_points: function(target_weights) {
            var d = [];
            
            var target_weights_l = this.$_.orderBy(target_weights, 'start_date');
            var first_start_date = target_weights_l[0].start_date;
            
            for(var i=0; i < target_weights_l.length; i++){
                var tw = target_weights_l[i];
                
                if(i==0){
                    d.push({x: tw.start_date, y: tw.start_weight});
                    continue
                }
                var pw = target_weights_l[i-1];
                var days =
                    moment(pw.target_date, "YYYY-MM-DD").diff(moment(pw.start_date, "YYYY-MM-DD"), 'days');
                var slope = ((pw.target_weight - pw.start_weight) / days);
                var days_passed =  moment(tw.start_date, "YYYY-MM-DD").diff(moment(pw.start_date, "YYYY-MM-DD"), 'days');
                var total_days = moment(tw.start_date, "YYYY-MM-DD").diff(moment(first_start_date, "YYYY-MM-DD"), 'days');
                
                var c = pw.start_weight - slope*total_days;
                console.log('here -> ', pw.target_weight, pw.start_weight, days, slope, slope*days_passed +c, c)
                
                d.push({x: tw.start_date, y: slope * days_passed +c});
            };
            var tw = target_weights_l[target_weights_l.length-1];
            d.push({x: tw.target_date, y: tw.target_weight});
            return d;
        },
        
        fetch_programmes: function(){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + "/programmes";
            this.$http({url: url, params:this.params, method: 'GET'})
                .then(resp => {
                    this.programmes = resp.data.results;
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },
        
        fetch_weight_log: function() {
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + "/weight";
            this.$http({url: url, method: 'GET'})
                .then(resp => {
                    this.weight_fetch_status=true;
                    this.weight_logs = resp.data.results;
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },
        
        
        fetch_target_weights: function(){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user.id + "/target-weights";
            this.$http({url: url, method: 'GET'})
                .then(resp => {
                    this.target_weights = this.get_target_weight_plot_points(resp.data.results);
                    this.target_fetch_status = true;
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },
    },
    mounted() {
        console.log(this.fobj_user, this.fobj_user.id);
        if (this.fobj_user.id){

            this.fetch_programmes();
            this.fetch_weight_log();
            this.fetch_target_weights();
        }
    }
}

</script>


<style lang="scss">
.weight-summary-card-container{

}
</style>
