<template>
<section class="weight-log-container">
  <div>
    <datepicker
      wrapper-class="start-datepicker"
      input-class="text-input"
      v-model="measured_on"
      format="yyyy-MM-dd"
      :typeable="true"
      placeholder="Date of measurement"
      >
    </datepicker>
  </div>  
  <WeightInput v-model="weight">  </WeightInput>
  <button v-on:click="add_weight_to_log"> Save </button>
</section>
</template>

<script>
import WeightInput from "@/components/WeightInput";
import Datepicker from 'vuejs-datepicker';
import moment from "moment";

export default {
    name: "WeightLogComponent",
    props: ['fobj_user',],
    components: {Datepicker, WeightInput},
    data() {
        return {
            measured_on: new Date(),
            weight: {
                magnitude_si: 0,
                preferred_unit: 'imperial'
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
                    this.$emit("weight-updated");

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
