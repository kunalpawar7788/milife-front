<template>
<div class="target-weights-view-container">
  <SelectedUserDisplay class="selected-user" :fobj_user="fobj_user"> </SelectedUserDisplay>
  <h3> Target Weight Log </h3>
  
  <div>
    <datepicker
      wrapper-class="start-datepicker"
      input-class="text-input"
      v-model="start_date"
      format="yyyy-MM-dd"
      :typeable="true"
      placeholder="Start Date"
      >
    </datepicker>
  </div>
  
  <div>
    <datepicker
      wrapper-class="start-datepicker"
      input-class="text-input"
      v-model="target_date"
      format="yyyy-MM-dd"
      :typeable="true"
      placeholder="Target Date"
      >
    </datepicker>
  </div>
  
  <div>
    <input
      type="text"
      class="input text-input"
      v-model="start_weight"
      placeholder="Start Weight"
      >
      </input>
  </div>

  <div>
    <input
      type="text"
      class="input text-input"
      v-model="target_weight"
      placeholder="Target Weight"
      >
      </input>
  </div>

  <div class="button" v-on:click="add_target_weight()">Add</div>
  <div>  </div>
    
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Target Weight</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="tw in target_weights">
        <td class="date">{{tw.set_on}}</td>
        <td class="weight">{{ tw.target_weight}}</td>
      </tr>
    </tbody>
  </table>

  
</div>

</template>

<script>
import moment from "moment";
import Datepicker from 'vuejs-datepicker';
import Multiselect from 'vue-multiselect';
import SelectedUserDisplay from '@/components/SelectedUserDisplay';

export default {
    name: "TargetWeightsView",
    components: {Datepicker, Multiselect, SelectedUserDisplay},
    props: ['fobj_user'],
    computed: {
        user() {return this.fobj_user;},
        full_name() {
            return this.fobj_user.first_name + " " + this.fobj_user.last_name;
        },
        user_pk() {
            return this.$route.params.pk;
        },
        target_weights() {
            return this.target_weights_l;
        },
    },
    
    data() {
        return {
            target_weights_l: [],
            start_date: '',
            target_date: '',
            start_weight: '',
            end_weight: '',
        };
    },
    
    methods: {
        fetch_target_weights: function(){
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk + "/target-weights";
            this.$http({url: url, method: 'GET'})
                .then(resp => {
                    this.status='success';
                    this.error_message="";
                    this.errors={};
                    this.target_weights_l = resp.data.results;
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },
        add_target_weight: function(){
            var data = {
                target_weight: this.weight,
                set_on: moment(this.set_on).format('YYYY-MM-DD'),
            }
            const url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk + "/target-weights";
            this.$http({url: url, data: data, method: 'POST'})
                .then(resp => {
                    this.status='success';
                    this.error_message="";
                    this.errors={};
                    this.fetch_target_weights();
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },
        remove_target_weight: function(target_weight_id){
        },
    },
    created() {
        this.$store.dispatch("theme/set_theme_white");
        this.fetch_target_weights();
    },
    
}
</script>

<style lang="scss">
.target-weights-view-container {
    display: grid;
    grid-template-columns: 1fr 8fr 1fr;
    grid-row-gap: 10px;
    justify-items: center;
    input{
        border: 1px solid lighten(grey, 30%);
        padding:0;
        text-indent: 15px;
    }
    * {
        grid-column: 2;
    }
    .button {
        height: 20px;
        width: 100%;
        padding-left:0;
        padding-right:0;
    }

}
</style>
