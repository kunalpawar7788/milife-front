<template>
<section class="weight-log-container">
  <div>
    <LogWeightInput v-model="weight.magnitude_si" :unit="user.weight_unit" />
    <datepicker
      wrapper-class="start-datepicker"
      input-class="text-input"
      v-model="measured_on"
      format="dd/MM/yyyy"
      :typeable="false"
      placeholder="Date of measurement"
      >
    </datepicker>
  </div>
  <button v-on:click="add_weight_to_log"> Save </button>
</section>
</template>

<script>
import LogWeightInput from "@/components/LogWeightInput"
import Datepicker from 'vuejs-datepicker';
import moment from "moment";

export default {
    name: "WeightLogComponent",
    props: ['fobj_user',],
    components: {Datepicker, LogWeightInput},
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
    data() {
        return {
            measured_on: new Date(),
            weight: {
                magnitude_si: parseFloat(this.fobj_user.weight_kg),
                preferred_unit: this.fobj_user.weight_unit,
            },
        }
    },
    methods: {
        add_weight_to_log: function(){
            var data = {
                measured_on: moment(this.measured_on).format('YYYY-MM-DD'),
                weight: this.weight.magnitude_si,
            };
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.fobj_user.id + "/weight";
            this.$http({url: url, data: data, method: 'POST'})
                .then(resp => {
                    this.status='success';
                    this.error_message="";
                    this.errors={};
                    this.$router.push('/');
                    // this.$emit("weight-updated");
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },
    }
}
</script>

<style lang="scss">
section.weight-log-container {
    width: 80%;
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: 10px;

    button {
        background-color: $milife-green;

        padding: 20px;
        border-radius: 20px;

    }
}
</style>
