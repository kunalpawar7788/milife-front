<template>
<div class="meal-plan-summary">
  <div class="calorie-banner bg-white fc-blue pd-10 br-20 width-90">
    <h1>{{String(this.data.calorie || '-').toLocaleString('en-uk')}}</h1>
    <p>Target Daily Calorie Intake</p>
  </div>
  <p class="fc-white fn-14">
    Your Meal Grams and Calories
  </p>
  <table class="br-20 fc-black width-90 fn-11 fw-500 responsive-width">
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
      <tr>
        <template v-if="daily_breakup_grams">
            <td class="bg-blue"><button class="info-btn" v-on:click="showMsg">i</button></td>
            <td class="bg-blue fn-12 fw-700" style="color: #FFCD03">{{daily_breakup_grams.fat | round_off(0)}}g</td>
            <td class="bg-blue fn-12 fw-700" style="color: #8AC53F">{{daily_breakup_grams.carbohydrates | round_off(0)}}g</td>
            <td class="bg-blue fn-12 fw-700" style="color: #3FA4F0">{{daily_breakup_grams.protein | round_off(0)}}g</td>
            <td class="bg-blue fn-12 fw-700 fc-white" >{{data.calorie}}</td>
        </template>

        </tr>
    </tbody>
  </table>
  <br>

  <section v-if="false"
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

        showMsg() {
            let msg = "Your total calorie target is the most important number to hit. "
                + "Next, try to hit the totals for protein, carbohydrate and fat. "
                + "After that, try to get 18g or more of protein in each meal or snack. "
                + "The more precisely you match the breakdown, the better chance you'll "
                + "be giving yourself of hitting your goals."

            this.$fire({
                text: msg,
                confirmButtonText: "Close X",
                customClass: {
                    container: "popup-container",
                    popup: "popup",
                    content: "popup-content",
                    actions: "popup-actions",
                    confirmButton: "popup-close-btn"
                }
            })
        }
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

    .calorie-banner {

        border-radius: 0.5em;
        background-color: whitesmoke;

        h1 {
            font-size: 30pt;
            font-weight: 600;
            margin: auto;
        }

        p {
            font-weight: 500;
            margin: 0.8em;
            margin-bottom: 0.2em;
        }
    }

    div {
        display: inline-block;
    }
    table
    {
        display: block;
        border-collapse: collapse;
        border-spacing: 0px;
        max-width: 400px;
        margin: auto;
    }

    th, td {
        padding: 5px;
        padding-top: 10px;
        padding-bottom: 10px;
    }
    table{
        background-color: none;

        th {
            border-bottom: 2px solid $milife-blue;
        }

        th:first-child {
            width: 40%;
            border-top-left-radius: 10px;
        }

        th:not(first-child) {
            width: 15%;
        }

        th:last-child {
            border-top-right-radius: 10px;
        }

        th:nth-child(1), td:nth-child(1) {
            background-color: whitesmoke;
            text-align: left;
            
        }

        th:nth-child(2), td:nth-child(2) {
            background-color: #FFCD03;
        }

        th:nth-child(3), td:nth-child(3) {
            background-color: #8AC53F;
        }

        th:nth-child(4), td:nth-child(4) {
            background-color: #3FA4F0;
        }
        th:nth-child(5), td:nth-child(5) {
            background-color: whitesmoke;
        }

        tr:nth-child(odd) {
            td:nth-child(1) {
                background-color: darken(whitesmoke, 10%);
            }

            td:nth-child(2) {
                background-color: darken(#FFCD03, 5%);
            }

            td:nth-child(3) {
                background-color: darken(#8AC53F, 5%);
            }

            td:nth-child(4) {
                background-color: darken(#3FA4F0, 5%);
            }

            td:nth-child(5) {
                background-color: darken(whitesmoke, 10%);
            }
        }

        tr:nth-last-child(2) {
            td:first-child {
                border-bottom-left-radius: 10px;
            }
            td:last-child {
                border-bottom-right-radius: 10px;
            }
        }

        tr:last-child td {
            background-color: $milife-blue !important;
        }

        tr:last-child td:first-child {
            float: left;
        }

    }

    .info-btn {
        color: white;
        background-color: $milife-green;
        font-weight: 700;
        border-radius: 50%;
        padding: 15%;
        width: 1em;
        text-align: center;
        cursor: pointer;
    }

    .vertical-th  {
        vertical-align: bottom;
        width: 20px;
        height: 60px;

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
    @media only screen and (max-width: 342px){
        .responsive-width{
            width: 98%;
        }
    }

}

.popup-container {
    font-family: 'Montserrat';

    .popup {
        width: 80%;
        border-radius: 0.5em;
        max-width: 500px;
    }

    .popup-content {
        font-weight: 400;
        text-align: left;
        padding-top: 5%;
        
    }

    .popup-content > div {
        color: black;
    }

    .popup-actions {
        margin: 0;
    }

    button.popup-close-btn {
        background: none;
        color: indianred;
        padding-bottom: 0;
        margin-bottom: 0;
    }

    button.popup-close-btn {
        box-shadow: none;
    }
}

.fw-700 {
    font-weight: 700;
}
</style>
