<template>
<div class="choicefield-container weight">
  <div class="label"><label> Weight </label></div>
  <div class="weightselect">
    <multiselect
      v-model="weight"
      placeholder="Weight"
      :options="weight_options"
      :allow-empty="false"
      selectLabel=""
      selectedLabel=""
      deselectLabel=""
      @input="emit_result"
      > </multiselect>
  </div>
  <div v-show="weight==='imperial'" class="stones">
    <input type="number" v-model="stones" placeholder="st" /><p> st </p>
  </div>
  <div v-show="weight==='imperial'" class="pounds">
    <input type="number" v-model="pounds" placeholder="lbs"/><p> lb </p>
  </div>
  <div  v-show="weight==='metric'" class="kgs">
    <input type="number" v-model="kgs" placeholder="kgs" /><p> kg </p>
  </div>
</div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {

    name: 'WeightInput',
    components: {Multiselect},
    props: ['weight_retrieved_from_User',],

    data() {
        return {
            weight_options: [ 'metric', 'imperial' ],
            magnitude_si: 0,
            stones2kg: 6.35,
            pounds2kg: 0.45,
        }
    },
    computed: {
        kgs: {
            get() {
                return this.weight_retrieved_from_User.magnitude_si;
            },
            set(value){
                this.magnitude_si = value || 0;
                this.emit_result();
            },
        },

        pounds: {
            get(){
                return this.get_pounds_from_kg(this.weight_retrieved_from_User.magnitude_si);
            },
            set(value){
                this.magnitude_si = this.get_kg_from_stones(this.stones) + this.get_kg_from_pounds(value);
                this.emit_result();
            },
        },

        stones: {
            get() {
                return this.get_stones_from_kg(this.weight_retrieved_from_User.magnitude_si);
            },
            set(value){
                value = Number(value);

                this.magnitude_si = this.get_kg_from_stones(value) + this.get_kg_from_pounds(this.pounds);
                this.emit_result();
            }
        },
    },
    methods: {
        round_off2: weight_retrieved_from_User => Math.round(weight_retrieved_from_User*100)/100,

        emit_result: function() {
            this.$emit('input', {
                preferred_unit: this.weight,
                magnitude_si: this.round_off2(this.magnitude_si),
            });
        },

        get_kg_from_stones: function(stones){
            return stones * this.stones2kg;
        },
        get_kg_from_pounds: function(pounds){
            return pounds * this.pounds2kg;
        },

        get_stones_from_kg: function(kg){
            return Math.floor(kg / this.stones2kg);
        },
        get_pounds_from_kg: function(kg){
            var value = kg / this.pounds2kg;
            if (kg >= this.stones2kg){
                value = kg / this.stones2kg % 1 * 12;
            }
            return Math.round(value*100)/100
        },
        set_weight_data: function(weight_retrieved_from_User) {
            this.weight = this.weight_retrieved_from_User.preferred_unit;
            this.magnitude_si = this.weight_retrieved_from_User.magnitude_si;
        },
    },
    created () {
        this.set_weight_data(this.weight_retrieved_from_User);
    }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">

div.choicefield-container{
    width: 320px;
    margin: 0 auto;
    border-radius: 50px;
    height: 50px;
    font-size: 15pt;
    font-family: Montserrat;
    padding: 10px;
    justify-content: center;
    display: inline-flex;
    width: inherit;

    div.label{
        align-self: center;
        justify-self: left;
        margin: 0;
        padding: 0 10px;

        label {
            font-size: 13px;
            color: #fff;
            font-family: Montserrat;
            margin: 0;
        }
    }
    div.weightselect{
        margin: 0;

        div.multiselect {
            margin: 0;
        }

        .multiselect--active .multiselect__select{
            transform:none!important;
        }
        .multiselect__select {
            background: $milife_green;
            color: #fff;
            z-index: 3;
            content: url($milife-dropdown-icon);
            margin-right: -5px;
            padding: 10px;
        }
        div.multiselect__tags {
            background: $milife_green;
            color: #fff;
            width: 119px;
            height: 50px;
            border: none;
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;
            margin-right: -6px;

            .multiselect__single {
                background: $milife_green;
                color: #fff;
                line-height: 30px;
            }
            span.multiselect__placeholder,
            span.multiselect__single {
                background: $milife_green;
                color: #fff;
                font-size: 15px;
                font-family: Montserrat;
                margin-left: 0;
                margin-right: 0;
            }
            input.multiselect__input {
                background: $milife_green;
                color: #fff;
                display: none;
            }
        }
        div.multiselect__content-wrapper {
            min-width: 120px;
        }
    }
    div.stones {
        width: 50px;

        input {
            margin: 0;
        }
        p {
            padding: 0px 10px 0 0px;
        }
    }
    div.pounds {
        width: 75px;
        margin-left: -4px;
        border-radius: 0px 50px 50px 0px;

        p {
            padding: 0px 10px 0 0px;
        }
    }
    div.kgs {
        width: 120px;
        border-radius: 0px 50px 50px 0px;

        input {
            padding-left: 5px;
        }
        p {
            padding: 0px 22px 0 0px;
        }
    }
    div.stones, div.pounds, div.kgs {
        height: 50px;
        display: inline-flex;
        background: #fff;

        input {
            height: 50px;
            margin: 0;
        }
        p {
            margin: 0px -4px 0 0!important;
            line-height: 50px;
            height: 50px;
            text-align: left;
            font-size: 15px;
            color: #252525;
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
        grid-column: 3/ span 2;
        grid-row: 8;
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
        font-family: Monteserrat;
        border: none;
        padding: 0;
        width: 100%;
        height:100%
    }
}
</style>