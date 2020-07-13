<template>
<div class="choicefield-container height">
  <div class="label"><label> Height </label></div>
  <div class="heightselect">
    <multiselect
      v-model="height"
      placeholder="Height"
      :options="height_options"
      :allow-empty="false"
      selectLabel=""
      selectedLabel=""
      deselectLabel=""
      @input="emit_result"
      > </multiselect>
  </div>
  <div v-show="height==='imperial'" class="feet">
    <input type="number" v-model="feet" placeholder="feet" /><p> ft </p>
  </div>
  <div v-show="height==='imperial'" class="inches">
    <input type="number" v-model="inches" placeholder="inches"/><p> in </p>
  </div>
  <div  v-show="height==='metric'" class="cms">
    <input type="number" v-model="cms" placeholder="cms" /><p> cm </p>
  </div>
</div>
</template>

<script>
import Multiselect from 'vue-multiselect';

export default {
    /*this should give out two parameters only:
namely, height in centimeters
and the unit chosen by the user.
*/

    name: 'HeightInput',
    components: {Multiselect},
    props: ['height_retrieved_from_User',],

    data() {
        return {
            height_options: [ 'metric', 'imperial' ],
            magnitude_si: 0,
            feet2cm: 30.48,
            inch2cm: 2.54,
        }
    },
    computed: {
        cms: {
            get() {return this.height_retrieved_from_User.magnitude_si;},
            set(value){
                this.magnitude_si = value || 0;
                this.emit_result();
            },
        },

        inches: {
            get(){
                return this.get_inches_from_cm(this.height_retrieved_from_User.magnitude_si);
            },
            set(value){
                this.magnitude_si = this.get_cm_from_feet(this.feet) + this.get_cm_from_inches(value);
                this.emit_result();
            },
        },

        feet: {
            get() {
                return this.get_feet_from_cm(this.height_retrieved_from_User.magnitude_si);
            },
            set(value){
                console.log('feet', value);
                value = Number(value);

                this.magnitude_si = this.get_cm_from_feet(value) + this.get_cm_from_inches(this.inches);
                this.emit_result();
            }
        },
    },
    methods: {
        round_off2: height_retrieved_from_User => Math.round(height_retrieved_from_User*100)/100,

        emit_result: function() {
            this.$emit('input', {
                preferred_unit: this.height,
                magnitude_si: this.round_off2(this.magnitude_si),
            });
        },

        get_cm_from_feet: function(feet){
            console.log('cm from feet',feet,  feet * this.feet2cm);
            return feet * this.feet2cm;
        },
        get_cm_from_inches: function(inches){
            console.log('cm from inches', inches,  inches * this.inch2cm);
            return inches * this.inch2cm;
        },

        get_feet_from_cm: function(cm){
            console.log('get_feet_from_cm', cm, Math.floor(cm / this.feet2cm));
            return Math.floor(cm / this.feet2cm);
        },
        get_inches_from_cm: function(cm){
            var value = cm / this.inch2cm;
            if (cm >= this.feet2cm){
                value = cm / this.feet2cm % 1 * 12;
            }
            console.log('get_inches_from_cm', cm, Math.floor(cm / this.feet2cm));
            return parseInt(Math.round(value*100)/100)
        },
        set_height_data: function(height_retrieved_from_User) {
            this.height = this.height_retrieved_from_User.preferred_unit;
            this.magnitude_si = this.height_retrieved_from_User.magnitude_si;
        },
    },
    created () {
        this.set_height_data(this.height_retrieved_from_User);
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
        padding: 0 5px;

        label {
            font-size: 13px;
            color: #fff;
            font-family: Montserrat;
            margin: 0;
        }
    }
    div.heightselect{
        margin: 0;

        div.multiselect {
            margin: 0;
            width: 107px;
        }

        .multiselect--active .multiselect__select{
            transform:none!important;
        }
        .multiselect__select {
            background: $milife_green;
            color: #fff;
            content: url($milife-dropdown-icon);
            width: 31px;
            margin-top: 5px;
        }
        div.multiselect__tags {
            background: $milife_green;
            color: #fff;
            height: 50px;
            border: none;
            border-top-left-radius: 50px;
            border-bottom-left-radius: 50px;

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
    div.feet {
        width: 56px;

        input {
            margin: 0;
        }
        p {
            padding: 0px 10px 0 0px;
        }

        input[type=number] {
            -moz-appearance: textfield;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
        }

    }
    div.inches {
        width: 81px;
        margin-left: 2px;
        border-radius: 0px 50px 50px 0px;

        p {
            padding: 0px 10px 0 0px;
        }

        input[type=number] {
            -moz-appearance: textfield;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
        }
    }
    div.cms {
        width: 135px;
        border-radius: 0px 50px 50px 0px;

        input {
            padding-left: 5px;
        }
        p {
            padding: 0px 22px 0 0px;
        }

        input[type=number] {
            -moz-appearance: textfield;
        }

        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
        }
    }
    div.feet, div.inches, div.cms {
        height: 50px;
        display: inline-flex;
        background: #fff;

        input {
            height: 50px;
            margin: 0;
            font-family: Montserrat;

            &::placeholder {
                font-size: 15px;
            }

            input[type=number] {
                -moz-appearance: textfield;
            }

            input::-webkit-outer-spin-button,
            input::-webkit-inner-spin-button {
                -webkit-appearance: none;
                margin: 0;
            }
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
        font-family: Montserrat;
        border: none!important;
        padding: 0;
        width: 100%;
        height:100%
    }
}
</style>