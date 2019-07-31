<template>

<div class="choicefield-container">
  <div class="label"> <label> Weight </label></div>
  <div
    v-if="choice_menu_open"
    :class="[selected=='metric'? 'selected': '', 'choices', 'metric' ]"
    v-on:click="select_choice('metric')"
    >
    Metric
  </div>

  <div
    v-if="choice_menu_open"
    :class="[selected=='imperial'? 'selected': '', 'choices', 'imperial' ]"
    v-on:click="select_choice('imperial')"
    >
    Imperial
  </div>



  <div
    :class="[choice_menu_open? 'hidden' : '', 'menu-button']"
    v-on:click="choice_menu_open=true">
    <p>{{selected}}</p>
  </div>
  <div
    v-if="selected=='imperial' && !choice_menu_open"
    class="stones">

    <input type="number" v-model="stones" placeholder="st" />
  </div>

  <div
    v-if="selected=='imperial' && !choice_menu_open"
    class="pounds">
    <input type="number" v-model="pounds" placeholder="lbs"/>
  </div>

  <div
    v-if="selected=='metric' && !choice_menu_open"
    class="kgs">
    <input type="number" v-model="kgs" placeholder="kgs" />
  </div>
</div>
</template>

<script>
export default {

    name: 'WeightInput',
    components: {},
    props: ['value',],

    data() {
        return {
            choice_menu_open: false,
            choices: ['imperial', 'metric'],
            preferred_unit: "",
            magnitude_si: 0,
            stones2kg: 6.35,
            pounds2kg: 0.45,
        }
    },
    methods: {
        select_choice : function (choice) {
            this.selected = choice;
            this.choice_menu_open=false;
            this.emit_result();

        },

        round_off2: value => Math.round(value*100)/100,

        emit_result: function() {
            this.$emit('input', {
                preferred_unit: this.selected,
                magnitude_si: this.round_off2(this.magnitude_si)

            });
        },

        get_kg_from_stones: function(stones){
            console.log('kg from stones',stones,  stones * this.stones2kg);
            return stones * this.stones2kg;
        },
        get_kg_from_pounds: function(pounds){
            console.log('kg from pounds', pounds,  pounds * this.pounds2kg);
            return pounds * this.pounds2kg;
        },

        get_stones_from_kg: function(kg){
            console.log('get_stones_from_kg', kg, Math.floor(kg / this.stones2kg));
            return Math.floor(kg / this.stones2kg);

        },
        get_pounds_from_kg: function(kg){
            var value = kg / this.pounds2kg;
            if (kg >= this.stones2kg){
                value = kg / this.stones2kg % 1 * 12;
            }
            console.log('get_pounds_from_kg', kg, Math.floor(kg / this.stones2kg));
            return Math.round(value*100)/100
        },
    },

    computed: {
        selected: {
            get(){
                return this.preferred_unit || this.value.preferred_unit;
            },
            set(value) {
                this.preferred_unit = value
            },
        },

        kgs: {
            get() {return this.value.magnitude_si;},
            set(value){
                this.magnitude_si = value || 0;
                this.emit_result();
            },
        },

        pounds: {
            get(){
                return this.get_pounds_from_kg(this.value.magnitude_si);
            },
            set(value){
                this.magnitude_si = this.get_kg_from_stones(this.stones) + this.get_kg_from_pounds(value);
                this.emit_result();
            },
        },

        stones: {
            get() {
                return this.get_stones_from_kg(this.value.magnitude_si);
            },
            set(value){
                console.log('stones', value);
                value = Number(value);

                this.magnitude_si = this.get_kg_from_stones(value) + this.get_kg_from_pounds(this.pounds);
                this.emit_result();
            }
        },
    },
}
</script>

<style lang="scss">

.hidden {
    display: none;
}

div.choicefield-container{
    width: 320px;
    margin: 0 auto;
    border-radius: 50px;
    height: 50px;
    font-size: 15pt;
    font-family: Monteserrat Regular;

    display: grid;
    grid-template-columns: 1fr 10px repeat(4, 1fr);
    grid-gap: 1px;

    div.label{
        grid-column: 1/span 2;
        align-self: center;
        justify-self: left;
    }
    div.stones {
        grid-column: 5 / span 1;
    }
    div.pounds{
        grid-column: 6/ span 1;
        input{
            border-radius: 0px 50px 50px 0px;
        }
    }
    div.kgs{
        grid-column: 5/span 2;
        input {
            border-radius: 0px 50px 50px 0px;
        }

    }

    div.menu-button{
        grid-column:3 / span 2;
        background-color: $milife-green;
        color: white;
        height: inherit;
        border-radius: 50px 0px 0px 50px;


        &:hover{
            background-color: lighten($milife-green, 20%);
        }

        p{
            margin-top: 10px;
        }

    }
    div.metric{
        grid-column: 3 / span 2;
        border-radius: 50px 0px 0px 50px;
    }

    div.imperial {
        grid-column: 5/ span 2;
        border-radius: 0px 50px 50px 0px;
    }

    div.choices{
        background-color: white;
        color: black;
        font-size: 15pt;
        padding: 12px;
        border: none;

        &:hover {
            background-color: lighten($milife-green, 20%);
        }
        &.selected{
            background-color: $milife-green;
        }

    }



    * input {
        text-align: center;
        font-size: 15pt;
        font-family: Monteserrat Regular;
        border: none;
        padding: 0;
        width: 100%;
        height:100%
    }

}

</style>
