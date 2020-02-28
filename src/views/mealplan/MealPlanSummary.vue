<template>
<div class="meal-plan-summary">
  <div class="calorie-banner bg-white fc-blue pd-10 br-20 width-90">
    <h1>{{String(this.data.calorie).toLocaleString('en-uk')}}</h1>
    <p>Assigned Daily Calorie Intake</p>
  </div>
  <p>
    _
  </p>
  <p>
    Your meal grammes and calories
  </p>
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
        <template v-if="daily_breakup_grams">
            <td class="bg-blue"></td>
            <td class="bg-blue fw-600" style="color: #FFCD03">{{daily_breakup_grams.fat | round_off(0)}}g</td>
            <td class="bg-blue fw-600" style="color: #8AC53F">{{daily_breakup_grams.carbohydrates | round_off(0)}}g</td>
            <td class="bg-blue fw-600" style="color: #3FA4F0">{{daily_breakup_grams.protein | round_off(0)}}g</td>
            <td class="bg-blue fw-600 fc-white" >{{data.calorie}}</td>
        </template>

        </tr>
    </tbody>
  </table>
  <br>
  <section
      class="margin-zero-auto bg-green br-50 mt-20 flex-spacebetween height-100 width-80"
      v-on:click="goto_view_latest_mealplan_document">
      <span class="ml-20 pd-20">View meal ideas </span>
      <span class="mr-20 pd-20">
        <img src="@/assets/images/next-arrow.svg"/>
      </span>
  </section>
</div>
</template>

<script>
export default {
    name: "MealPlanSummary",
    components: {},
    props: ['fobj_user', ],
    data() {
        return {
            data: {},
        }
    },
    computed: {
        user: function() {
            var user = Object.assign({}, this.$store.state.auth.user);
            if(this.$route.params.pk){
                user = Object.assign({}, this.fobj_user);
            }
            return user;
        },

        user_pk: function(){
            if (this.$route.params.pk) {
                return this.$route.params.pk;
            }
            else {
                return this.$store.state.auth.user.id;
            }
        },
        is_admin: function() {
            return this.$store.state.auth.user.is_staff;
        },
        mealplan_url: function() {
            return process.env.VUE_APP_BASE_URL+'/api/users/' + this.user_pk + "/mealplan";
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
            if (this.data.calorie){
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
            }
        },
    },
    methods: {

        fetch_mealplan: function(){
            this.$http({url: this.mealplan_url, method: 'GET'})
                .then(resp => {
                    if(resp.data.results.length == 1){
                        this.data = Object.assign({}, resp.data.results[0]);
                    }
                    this.status="success";
                })
                .catch(err => {
                    this.status='error';
                    console.log(err);
                });
        },

        fetch_latest_meal_plan: function() {
            const url = process.env.VUE_APP_BASE_URL + '/api/users/' + this.user_pk + '/documents?kind=MEALPLAN';
            return new Promise((resolve, reject) => {
                this.$http({url: url, params: this.params, method: 'GET'})
                    .then(resp => {
                        this.error_message = "";
                        this.errors = {};
                        this.latest_meal_plan = resp.data.results[0];
                        console.log(this.latest_meal_plan);
                    })
                    .catch(err => {
                        err.response.data['errors'].forEach((element, index, array) => {
                            errors[element['field']] = element['message']
                        });
                        this.errors = errors;
                    });
            });
        },


        goto_view_latest_mealplan_document: function(){
            if (this.latest_meal_plan) {
                let doc_pk = this.latest_meal_plan['id'];

                let view = 'my-document-view';
                let params = {doc_pk: doc_pk};

                this.$router.push({name: view, params: params});
            }
            else {
                this.$alert('', 'No Meal Ideas Found!', 'error');
            }
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
    mounted() {
        this.$store.dispatch("theme/set_theme_blue");
        this.fetch_mealplan();
    },
    created() {
        this.fetch_latest_meal_plan()
    },
}
</script>

<style lang="scss">
.meal-plan-summary{

    div {
        display: inline-block;
    }
    table
    {
        display: inline-block;
        border-collapse: collapse;
        border-spacing: 0px;
        max-width: 400px;
    }
    table, th, td
    {
        /* padding: 5px; */
        border: 1px solid $milife-blue;
    }
    th, td {
        padding: 5px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    table{

        th:first-child {
            width: 40%;
        }
        th:not(first-child) {
            width: 15%;
        }

    }
    .vertical-th  {
        vertical-align: bottom;
        width: 20px;
        height: 100px;

        span{
            display: inline-block;
            bottom: -10px;
            padding: 0;
            width: 30px;
            height: 20px;
            transform: rotate(-90deg);
            transform-origin: left;
            text-align: left;
            white-space: nowrap;
            margin-left: 20px;
            position: relative;
        }
    }

}
</style>