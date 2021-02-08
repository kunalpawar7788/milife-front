<template>
<section class="weight-log-container">
  <div>
    <LogWeightInput class="m-30p" v-model="weight.magnitude_si" :unit="user.weight_unit" />
    <datepicker
      wrapper-class="datepicker-container"
      input-class="datepicker-input"
      calendar-class="datepicker-calendar"
      v-model="measured_on"
      format="dd/MM/yyyy"
      :typeable="false"
      placeholder="Date of measurement"
      >
    </datepicker>
  </div>
  <p class="warning-text">Warning: This will overwrite data for conflicting dates.</p>  
  <button class="br-50" v-on:click="add_weight_to_log"> Log Weight </button>
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
    
    display: block;
    

    .m-30p {
        margin-top: 20%;
    }

    .datepicker-container {
        margin-top: 10%;
        text-align: center;
    }

    .datepicker-input {
        @extend .text-input;
        border: none;
        font-family: "Montserrat";
        background: url($milife-dropdown-icon) 92% no-repeat, linear-gradient($milife-green) right no-repeat;
        background-size: 6%, 20%;
        background-color: white;
        cursor: pointer;
    }

    .datepicker-calendar {
        right: 0;
        left: 0;
        margin-right: auto;
        margin-left: auto;
        text-align: initial;
    }
    .warning-text {
        color: white;
        margin-top: 20%;
        font-size: calc(14px + 0.5vmin);
    }
    button {
        background-color: $milife-green;
        color: white;
        padding: 20px;
        width: 240px;
    }
}
</style>
