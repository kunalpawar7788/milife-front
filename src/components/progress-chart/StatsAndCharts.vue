<template>
<div class="stats-n-charts-container fc-white">
  <div class="menubar fn-12">
    <div
      :class="['menuitem', category=='body_composition'? 'bg-green':'bg-lightblue']"
      v-on:click="set_category('body_composition'); plot_key+=1"> Body Composition </div>
    <div
      :class="['menuitem', category=='health_marker'? 'bg-green':'bg-lightblue']"
      v-on:click="set_category('health_marker'); plot_key+=1"> Health Markers </div>
    <div
      :class="['menuitem', category=='body_measurement'? 'bg-green':'bg-lightblue']"
      v-on:click="set_category('body_measurement'); plot_key+=1"> Body Measurements </div>
  </div>

  <div class="representation-menu">
    <div
      :class="['representation-menu-item', representation=='stats'? 'fc-white': 'fc-lightblue']"
      v-on:click="representation='stats'">
      Stats
    </div>
    <div
      :class="['representation-menu-item', representation=='charts'? 'fc-white': 'fc-lightblue']"
      v-on:click="representation='charts'">
      Charts
    </div>
  </div>
  <div class="" v-if="representation=='stats'">
    <table>
      <thead>
        <th></th>
        <th>
          <Multiselect
            v-model="compare_checkin_date"
            :options="Object.values(checkin_dates_d)"
            label="label"
            track-by="id"
            :hideSelected="true"
            :searchable="false"
            :show-labels="false"
            >
        </Multiselect></th>
        <th>{{date_repr(_selected_checkin_date)}}</th>

      </thead>
      <tbody>
        <template v-for="record in selected_subset">
          <tr>
            <td class="fn-11">{{record.label}}</td>
            <td class="fn-12" :class="record.compare_class">{{record.compare_value}}</td>
            <td class="fn-12" :class="record.current_class">{{record.current_value}}</td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
  <div class="charts" v-if="representation=='charts'">
    <Multiselect
      class=""
      v-model="field_to_plot"
      :options="fields_options_l"
      label="label"
      value="value"
      :preselectFirst="true "
      :key="plot_key"
      :show-labels="false"
      >
    </Multiselect>
    <GenericChart
      :datapoints="data_to_plot"
      :field="field_to_plot"
      :key="plot_key + 1"
      ></GenericChart>
  </div>
  </div>
</template>

<script>
import Multiselect from 'vue-multiselect';
import GenericChart from '@/components/progress-chart/GenericChart.vue';
import moment from 'moment';
import classify from '@/lib/measurement_range.js';

export default{
    name: "StatsAndCharts",
    components: {Multiselect, GenericChart},
    props: ['progress_report', 'selected_checkin_date', 'checkin_dates', 'fobj_user'],
    data() {
        return {
            category: "body_composition",
            representation: "charts", // or charts
            field_to_plot: "",
            plot_key: 0,

            // compare_checkin_value: {},
            compare_checkin_value: "",

            body_composition_fields: {
                body_fat: 'Body Fat',
                percentage_body_fat: '% Body Fat',
                muscle_mass: 'Muscle Mass',
                percentage_muscle_mass: 'Muscle Mass',
                visceral_fat_mass: 'Visceral Fat Mass',
                body_type: 'Body Type',
                biological_age: 'Biological Age',
            },
            health_marker_fields: {
                body_mass_index: 'Body Mass Index',
                waist_hip_ratio: 'Waist/Hip Ratio',
                systolic_blood_pressure: 'Systolic Blood Pressure',
                diastolic_blood_pressure: 'Diastolic Blood Pressure',
                blood_sugar: 'Blood Sugar',
                vo2max: 'VO2Max',
                resting_heart_rate: 'Resting Heart Rate',
            },
            body_measurement_fields: {
                waist: 'Waist (inches)',
                hips: 'Hips (inches)',
                chest: 'Chest (inches)',
                shoulders: 'Shoulders (inches)',
                left_arm: 'Left Arm (inches)',
                right_arm: 'Right Arm (inches)',
                left_leg: 'Left Leg (inches)',
                right_leg: 'Right Leg (inches)',
            },
        };
    },
    computed: {
        checkin_dates_d: function(){
            var d = {};
            this.$_.forEach(this.checkin_dates, function(o){
                o.label = this.repr_date_obj(o);
                d[o.id] = o;
            }.bind(this));
            return d;
        },
        compare_checkin_date: {
            get() {
                var date = this.compare_checkin_value || this.checkin_dates.slice(-2)[0].id;
                return this.checkin_dates_d[date];
            },
            set(value) {
                var d = Object.assign({}, value)
                this.compare_checkin_value = d.id;
            },
        },

        _selected_checkin_date: function(){
            return this.selected_checkin_date;
        },

        fields: function() {
            if (this.category == 'body_composition'){
                return this.body_composition_fields;
            }
            if (this.category == 'health_marker'){
                return this.health_marker_fields;
            }
            if (this.category == 'body_measurement'){
                return this.body_measurement_fields;
            }
        },
        fields_options_d: function(){
            var d = {}
            this.$_.forEach(this.fields, function(value, key){
                d[key]={label: value, value: key};
            });
            return d;
        },
        fields_options_l: function(){
            var l = [];
            this.$_.forEach(this.fields, function(value, key){
                l.push({label: value, value: key});
            });
            return l;
        },

        selected_subset: function(){
            var l = [];
            if (this._selected_checkin_date == null || this.compare_checkin_date==null){
                return l;
            }
            Object.keys(this.fields).forEach(function(key){
                let current_value = this.progress_report[this._selected_checkin_date][key]
                let compare_value = this.progress_report[this.compare_checkin_date.id][key]
                var d = {
                    label : this.fields[key],
                    current_value : current_value,
                    compare_value : compare_value,
                    compare_class : classify(key, compare_value, this.age_years, this.user.gender),
                    current_class : classify(key, current_value, this.age_years, this.user.gender)
                }
                l.push(d);
            }.bind(this))

            return l;
        },
        data_to_plot: function(){
            var l = [];
            if (this.field_to_plot == null){
                return l;
            }
            this.$_.forEach(this.progress_report, function(obj, date){
                l.push({
                    date: moment(date, 'YYYY-MM-DD'),
                    value: obj[this.field_to_plot.value],

                });
            }.bind(this));
            l = this.$_.sortBy(l, 'date')
            this.plot_key += 1;
            return l;
        },
        user: function() {
            var user = Object.assign({}, this.$store.state.auth.user);
            if(this.$route.params.pk){
                user = Object.assign({}, this.fobj_user);
            }
            return user;
        },
        age_years: function() {
            return moment().diff(this.user.date_of_birth, 'years');
        },


    },
    methods: {
        set_category: function(value){
            this.category = value;
            this.plot_key += 1;
            this.field_to_plot=this.fields_options_l[0];

        },

        repr_date_obj: function(o){
            if (o.frequency > 1){
                return o.mobj.format("DD MMM YY")
            }
            else {
                return o.mobj.format("MMM YY")
            }
        },
        date_repr: function(date){
            console.log(date, this.checkin_dates_d[date]);
            var o = this.checkin_dates_d[date];
            return this.repr_date_obj(o);
        },

    },
}
</script>

<style lang="scss">
.stats-n-charts-container {
    .representation-menu {
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: space-between;
        padding: 15px 5px 15px 5px;
    }
    .menubar{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: center;
        /* grid-template-columns: 2fr 1fr 2fr; */

        .menuitem{
            padding: 15px 5px 15px 5px;
            margin-left: 1px;
        }

        .menuitem:first-child{
            border-radius: 10px 0 0 10px;
        }
        .menuitem:last-child{
            border-radius: 0 10px 10px 0;

        }
    }
    table{
        width: 100%;
        border-collapse: collapse;
        td{
            padding: 10px 0 10px 0;
        }
        tr:nth-child(odd){
            background-color: lighten($milife-blue, 3%);
        }
        td:first-child {
            width: 50%;
        }
        
        .healthy, .desirable, .normal, .essential-fat, .athelete,
        .fitness, .ideal, .excellent, .good, .above-average {
            color: greenyellow;
        }

        .above-ideal, .borderline, .average, .pre-high, .below-average {
            color: yellow;
        }

        .underweight, .obese, .high, .overweight, .poor, .very-poor {
            color: red;
        }
    }
}
.redborder {
    border: 1px solid red;
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
