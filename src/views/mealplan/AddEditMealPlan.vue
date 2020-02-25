<template>
<section class="add-edit-meal-plan-container">
  <SelectedUserDisplay class="middle-column" :fobj_user="fobj_user"> </SelectedUserDisplay>
  <div>
    <input class="text-input" type="text" v-model="calorie"> </input>
  </div>

  <div v-if="status=='success'">
    <h3>Macronutrient Breakdown</h3>
    <table class="macronutrient fc-black">
      <thead>
        <th>
        </th>
        <th>Fat</th>
        <th>Carb</th>
        <th>Protein</th>

      </thead>
      <tbody>
        <tr>
          <td>% of calories</td>
          <td :class="[is_daily_breakup_valid? 'green-border': 'red-border']">
            <NumberInput
              name="fat"
              v-on:input="update_daily_breakup(Number($event),'fat') "
              :value="daily_breakup.fat"
              placeholder="" :min="1" :max="100">
          </NumberInput></td>
          <td :class="[is_daily_breakup_valid? 'green-border': 'red-border']">
            <NumberInput
              name="carbohydrates"
              v-on:input="update_daily_breakup(Number($event),'carbohydrates') "
              :value="daily_breakup.carbohydrates"
              placeholder="" :min="1" :max="100">
          </NumberInput></td>
          <td :class="[is_daily_breakup_valid? 'green-border': 'red-border']">
            <NumberInput
              name="protein"
              v-on:input="update_daily_breakup(Number($event),'protein')"
              :value="daily_breakup.protein"
              placeholder="" :min="1" :max="100">
          </NumberInput></td>
        </tr>
        <tr>
          <td>Calories</td>
          <td>{{data.calorie * data.daily_breakup.fat / 100}}</td>
          <td>{{data.calorie * data.daily_breakup.carbohydrates / 100}}</td>
          <td>{{data.calorie * data.daily_breakup.protein / 100}}</td>
        </tr>
        <tr>
          <td>Grams</td>
          <td>{{round_off2(data.calorie * data.daily_breakup.fat / 100 / 9)}}</td>
          <td>{{round_off2(data.calorie * data.daily_breakup.carbohydrates / 100 / 4)}}</td>
          <td>{{round_off2(data.calorie * data.daily_breakup.protein / 100 / 4)}}</td>
        </tr>
      </tbody>
    </table>
    <label> Update values in "% of calories row" </label>

    <h3>Meal Percentages</h3>

    <table class="meal-percentages fc-black">
      <thead>
        <th>Meal Name</th>
        <th>Fat</th>
        <th>Carb</th>
        <th>Protein</th>
      </thead

      <tbody v-if="status!='loading'">
        <tr v-for="(mb, index) in meal_breakup">
          <td><input
                type="text"
                v-on:input="update_meal_breakup($event.target.value, 'name', index)"
                v-bind:value="meal_breakup[index].name"
                /></td>
          <td><NumberInput
                placeholder=""
                :min="1"
                :max="100"
                v-on:input="update_meal_breakup(Number($event),'fat', index)"
                v-bind:value="meal_breakup[index].fat" >
          </NumberInput></td>
          <td><NumberInput
                placeholder=""
                :min="1" :max="100"
                v-on:input="update_meal_breakup(Number($event),'carbohydrates', index)"
                v-bind:value="meal_breakup[index].carbohydrates" >
          </NumberInput></td>
          <td><NumberInput
                placeholder=""
                :min="1" :max="100"
                v-on:input="update_meal_breakup(Number($event),'protein', index)"
                v-bind:value="meal_breakup[index].protein">
          </NumberInput></td>
        </tr>

        <tr>
          <td><strong>Total</strong></td>
          <td :class="[total.fat==100? 'green-border': 'red-border']">{{total.fat}}</td>
          <td :class="[total.carbohydrates==100? 'green-border': 'red-border']">{{total.carbohydrates}}</td>
          <td :class="[total.protein==100? 'green-border': 'red-border']">{{total.protein}}</td>
        </tr>
      </tbody>
    </table>

    <h3> Meal Grammes and calaories</h3>
    <table class="mt-10 bg-white br-20 fc-black width-90 fn-11 fw-500">
        <colgroup>
          <col style="column-width: 10px" />
          <col style="background-color: #FFCD03"> </col>
          <col style="background-color: #8AC53F "> </col>
          <col style="background-color: #3FA4F0 "> </col>
        </colgroup>
        <thead>
          <th ></th>
          <th class="vertical-th fn-11"><span> Fat </span></th>
          <th class="vertical-th fn-11"><span> Carb </span></th>
          <th class="vertical-th fn-11"><span> Protein</span></th>
          <th class="vertical-th fn-11"><span> Calories</span></th>
        </thead>
        <tbody>
          <tr v-for="meal in meals">
            <td class="fn-11">{{meal.name}}</td>
            <td class="fn-11">{{meal.fat  | round_off(0)}}</td>
            <td class="fn-11">{{meal.carbohydrates  | round_off(0)}}</td>
            <td class="fn-11">{{meal.protein  | round_off(0)}}</td>
            <td class="fn-11">{{meal.calories  | round_off(0)}}</td>
          </tr>
          <tr >
            <td class="bg-blue" colspan=5></td>
          </tr>
          <tr>
            <td class="bg-blue"></td>
            <td class="bg-blue fw-600" style="color: #FFCD03">{{daily_breakup_grams.fat | round_off(0)}}g</td>
            <td class="bg-blue fw-600" style="color: #8AC53F">{{daily_breakup_grams.carbohydrates | round_off(0)}}g</td>
            <td class="bg-blue fw-600" style="color: #3FA4F0">{{daily_breakup_grams.protein | round_off(0)}}g</td>
            <td class="bg-blue fw-600 fc-white" >{{data.calorie}}</td>

            </tr>
        </tbody>
    </table>

  </div>
<div class="button" v-on:click="submit_mealplan">Save</div>
</section>
</template>

<script>
import SelectedUserDisplay from '@/components/SelectedUserDisplay';
import NumberInput from "vue-number-input";
export default {
    name: "AddEditMealPlan",

    components: {
        SelectedUserDisplay,
        NumberInput,
    },

    props: ['fobj_user', ],
    computed: {
        total: function(){
            var d={
                fat: 0,
                carbohydrates: 0,
                protein:0,
            };
            for(var i=0; i<this.data.meal_breakup.length; i++){
                d.fat += Number(this.data.meal_breakup[i].fat);
                d.carbohydrates += Number(this.data.meal_breakup[i].carbohydrates);
                d.protein += Number(this.data.meal_breakup[i].protein);
            }
            return d;
        },

        user_pk() {
            return this.$route.params.pk;
        },

        mealplan_url() {
            var base_url = process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk + "/mealplan";
            return  this.data.id? base_url+ '/' +this.data.id : base_url;
        },

        meal_breakup() {
            var x = Object.assign({}, this.data.meal_breakup);
            console.log('meal breakup', x[0].name);
            return x
            // return this.data.meal_breakup;
        },

        upsert_method(){
            return this.data.id? "PATCH" : "POST";
        },

        daily_breakup() {
            var x = Object.assign({}, this.data.daily_breakup);
            return x
        },

        calorie: {
            set(value){this.data.calorie=Number(value)},
            get(){return this.data.calorie},
        },
        is_daily_breakup_valid() {
            return (this.data.daily_breakup.fat + this.data.daily_breakup.carbohydrates + this.data.daily_breakup.protein == 100);
        },

        meals: function() {
            var meals = [];
            if (this.data == {} || this.data.calorie == undefined) {
                return [];
            }
            this.$_.forEach(this.data.meal_breakup, function(o){
                if (o.name == ""){
                    return
                }

                console.log(o.fat, o.carbohydrates, o.protein, this.data.daily_breakup);
                const calorie = this.data.calorie;

                var fat = calorie * this.data.daily_breakup.fat * o.fat * 0.0001/9;
                var carbohydrates = calorie * this.data.daily_breakup.carbohydrates * o.carbohydrates * 0.0001/4;
                var protein = calorie * this.data.daily_breakup.protein * o.protein * 0.0001/4;

                var total_calories =
                    calorie * this.data.daily_breakup.fat * o.fat * 0.0001 +
                    calorie * this.data.daily_breakup.carbohydrates * o.carbohydrates * 0.0001 +
                    calorie * this.data.daily_breakup.protein * o.protein * 0.0001;

                meals.push({
                    name: o.name,
                    fat: fat,
                    carbohydrates: carbohydrates,
                    protein: protein,
                    calories: total_calories
                });
            }.bind(this))
            return meals;
        },


        daily_breakup_grams: function(){
            const calorie = this.data.calorie;
            const fat = calorie * this.data.daily_breakup.fat * 0.01 / 9;
            const carbohydrates = calorie * this.data.daily_breakup.carbohydrates * 0.01 / 4;
            const protein = calorie * this.data.daily_breakup.protein * 0.01 / 4;

            return {
                fat: fat,
                carbohydrates: carbohydrates,
                protein: protein,
                total: fat + carbohydrates + protein
            }
        },
    },
    data() {
        return {
            status: "loading",
            data: {
                id: '',
                calorie: 0,

                daily_breakup: {
                    fat: 0,
                    carbohydrates: 0,
                    protein: 0,
                },

                meal_breakup: [
                    {name: "", fat: 0, carbohydrates: 0, protein: 0,},
                    {name: "", fat: 0, carbohydrates: 0, protein: 0,},
                    {name: "", fat: 0, carbohydrates: 0, protein: 0,},
                    {name: "", fat: 0, carbohydrates: 0, protein: 0,},
                    {name: "", fat: 0, carbohydrates: 0, protein: 0,},
                    {name: "", fat: 0, carbohydrates: 0, protein: 0,},
                    {name: "", fat: 0, carbohydrates: 0, protein: 0,},
                ],
            }
        };
    },
    methods: {
        round_off2: value => Math.round(value*100)/100,

        fetch_mealplan: function(){
            this.$http({url: this.mealplan_url, method: 'GET'})
                .then(resp => {

                    console.log(resp.data.results, '<<<here');
                    if(resp.data.results.length == 1){
                        this.data = Object.assign({}, resp.data.results[0]);
                        console.log(this.data, '<<<here');
                    }
                    this.status="success";
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });

        },

        submit_mealplan: function(){
            this.$http({url: this.mealplan_url, method: this.upsert_method, data:this.data})
                .then(resp => {
                    this.$router.go(-1);
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);

                });
        },

        log_this: function(e){
            console.log('heeh, here', e);
        },

        update_meal_breakup: function(value, field, index){
            this.data.meal_breakup[index][field] = value;
        },

        update_daily_breakup: function(value, field){
            this.data.daily_breakup[field] = value;
        },
    },

    filters: {
        round_off: function(value, precision) {
            if (precision > 0){
                let factor = 10 ^ precision;
                return Math.round(value * factor) / factor;
            }
            return Math.round(value);
        },
    },
    
    created() {
        this.fetch_mealplan();
    },
}
</script>

<style lang="scss">
.add-edit-meal-plan-container{
    h3,label {
        color: white;
    }
    .red-border {
        border: 3px solid red;
        /* background-color: lighten(red, 30%); */
    }
    .green-border {
        border: 3px solid $milife-green;
        /* background-color: lighten($milife-green, 30%); */
    }
    table {
        border-radius: 10px;
        background: white;
        input {
            width: 100%;
            text-align: center;
            border: 0px;
            height: 100%;
            padding: 0px;
            margin: 0px;
        }
        tr td {
            height: 30px;
            padding: 0;
            border-color: $milife-blue;
            border-style: solid;
            border-width: 1px 0px 0px 0px;
        }

        tr td:first-child{
            width: 100px;
        }
    }
    table.macronutrient{
        tr:not(:nth-child(1)) td:nth-child(even){
            background-color: lighten(grey, 40%);
            input {
                background-color: lighten(grey, 40%);
            }
        }
        thead th:nth-child(even){
            background-color: lighten(grey, 40%);
        }

    }
    table.meal-percentages{
        tr:not(:last-child) td:nth-child(even){
            background-color: lighten(grey, 40%);
            input {
                background-color: lighten(grey, 40%);
            }
        }
        thead th:nth-child(even){
            background-color: lighten(grey, 40%);
        }

    }
}
</style>
