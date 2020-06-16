<template>
<div class="target-weights-view-container">
  <h3> Bulk update weight log </h3>
  <SelectedUserDisplay class="selected-user" :fobj_user="fobj_user"> </SelectedUserDisplay>
  
  <section class="tab-menu-container">
    <div :class="['tab', mode=='weight'? 'bg-green': 'bg-white']"
         v-on:click="mode='weight'"> Weight Log </div>
    <div :class="['tab', mode=='target'? 'bg-green': 'bg-white']"
         v-on:click="mode='target'"> Target Weight </div>
  </section>    
  <textarea
    rows=15
    v-model="textbox_content"
    placeholder="date as YYYY-MM-DD,weight in kg, eg
2018-01-10,64.30
2018-01-11,64.20"
    > </textarea>
  <p>Warning: This will overwrite data for conflicting dates. </p>  
  <div class="button" v-on:click="bulk_upsert_weights">
    <template v-if="mode=='target'">Update Weight Target</template>
    <template v-else>Update Weight Log</template>
  </div>

</div>

</template>

<script>
import moment from "moment";
import Datepicker from 'vuejs-datepicker';
import Multiselect from 'vue-multiselect';
import SelectedUserDisplay from '@/components/SelectedUserDisplay';

export default {
    name: "BulkWeightUpdateView",
    components: {Datepicker, Multiselect, SelectedUserDisplay},
    props: ['fobj_user'],
    data() {
        return {
            textbox_content: "",
            mode: 'weight' //'target',
        };
    },
    
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

        submit_url: function() {
            const base_url = process.env.VUE_APP_BASE_URL + '/api/';
            if (this.mode=="target"){
                return base_url + "bulk-target-weights/";
            }
            return base_url + "bulk-weights/";
            
        },

        submit_payload: function(){
            if (this.mode=='target'){
                return this.date_target_weight_l;
            }
            return this.date_weight_l;
        },
        date_weight_l: function() {
            var data = [];
            this.$_.forEach(this.textbox_content.split('\n'), function(item){
                const tuple = item.split(',')
                if (tuple.length !=2){
                    return;
                }
                const date = tuple[0],
                      weight = tuple[1];
                if (date !=null && !moment(date, "YYYY-MM-DD").isValid()){
                    return;
                }
                
                data.push({
                    user: this.user_pk,
                    weight: tuple[1],
                    measured_on : tuple[0],
                });
                
            }.bind(this));
            return data;
        },
        date_target_weight_l: function(){
            var data = [];
            this.$_.forEach(this.textbox_content.split('\n'), function(item){
                const tuple = item.split(',')
                if (tuple.length !=2){
                    return;
                }
                const date = tuple[0],
                      weight = tuple[1];
                if (date !=null && !moment(date, "YYYY-MM-DD").isValid()){
                    return;
                }
                
                data.push({
                    user: this.user_pk,
                    target_weight: tuple[1],
                    target_date : tuple[0],
                });                
            }.bind(this));
            return data;
        },
        
    },
    
    methods: {
        
        bulk_upsert_weights: function(){
            this.$http({url: this.submit_url, data: this.submit_payload, method: 'POST'})
                .then(resp => {
                    this.$router.go(-1);
                })
                .catch(err=>{
                    //TODO: show error message via toast?
                })
        },
    },
    created() {
        this.$store.dispatch("theme/set_theme_white");
        //this.fetch_target_weights();
    },
}
</script>

<style lang="scss">
.target-weights-view-container {
    display: grid;
    grid-template-columns: 1fr 8fr 1fr;
    grid-row-gap: 10px;
    justify-items: center;
    padding-bottom: 30px;

    * {
        color: black;
    }
    input{
        padding:0;
        text-indent: 15px;
    }
    * {
        grid-column: 2;
    }
    .button {
        height: 0px;
        width: 100%;
        max-width: 280px;
        padding-left:0;
        padding-right:0;
        line-height: 0;
    }


    .tab-menu-container {
        display: flex;
        flex-direction: row,
    }
    .tab{
        padding: 20px;
        border-radius: 20px;

        
    }
    textarea {
        width: 90%;
    }

}
</style>
