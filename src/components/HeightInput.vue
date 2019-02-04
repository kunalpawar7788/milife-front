<template>
<div class="choicefield-container">
  <div class="choice-container" v-if="choice_menu_open">
    <div
      v-bind:class="[selected==choice? 'selected': '']"
      v-for="choice in choices"
      v-on:click="select_choice(choice)"
      >
      {{choice}}
    </div>
  </div>
  
  <div class="input-fields" v-else>
    <div class="menu-button" v-on:click="choice_menu_open=true">
      <p>{{selected}}</p>
    </div>
    <input v-if="selected=='imperial'" class="feet" type="number" v-model="feet" placeholder="feet" suffix="'" />
    <input v-if="selected=='imperial'" class="inches" type="number" v-model="inches" placeholder="inches" suffix='\"' />
    <input v-if="selected=='metric'" class="cms" type="number" v-model="cms" placeholder="cms" suffix="cms"/>
    
  </div>

</div>
</template>

<script>
import CustomInput from '@/components/CustomInput';

export default {
    /*this should give out two parameters only:
namely, height in centimeters
and the unit chosen by the user.

*/

    name: 'HeightInput',
    components: [CustomInput, ],
    props: ['value',],

    data() {
        return {
            choice_menu_open: false,
            choices: ['imperial', 'metric'],
            selected: this.value.preferred_unit,
            magnitude_si: 0,
            feet2cm: 30.48,
            inch2cm: 2.54,
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
            return Math.round(value*100)/100
        },
    },
    
    computed: {
        cms: {
            get() {return this.value.magnitude_si;},
            set(value){
                this.magnitude_si = value || 0;
                this.emit_result();
            },
        },

        inches: {
            get(){
                return this.get_inches_from_cm(this.value.magnitude_si);
            },
            set(value){
                this.magnitude_si = this.get_cm_from_feet(this.feet) + this.get_cm_from_inches(value);
                this.emit_result();
            },
        },

        feet: {
            get() {
                return this.get_feet_from_cm(this.value.magnitude_si);
            },
            set(value){
                console.log('feet', value);
                value = Number(value);

                this.magnitude_si = this.get_cm_from_feet(value) + this.get_cm_from_inches(this.inches);
                this.emit_result();
            }
        },
    },
}
</script>

<style lang="scss">
div.choicefield-container{
    border: 1px dotted yellow;
    border-radius: 50px;
    height: 50px;
    font-size: 15pt;
    font-family: Monteserrat Regular;
    
    div.choice-container {
        /* grid-template-columns: */
        grid-template-columns: repeat(auto-fit, minmax(100px,1fr));
        display: grid;
        grid-gap: 1px;
        
        div {
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
            
            &:nth-child(1){
                border-radius: 50px 0px 0px 50px;
            }
            
            &:nth-last-child(1){
                border-radius: 0px 50px 50px 0px;
            }
            
            
        }
    }
    
    div.input-fields {
        height: inherit;
        grid-template-columns: 50% repeat(auto-fit, minmax(10px,1fr));
        display: grid;
        grid-gap: 1px;
        
        input {
            text-align: center;
            font-size: 15pt;
            font-family: Monteserrat Regular;
            border: none;
            padding: none;

        }
        :nth-child(1){
            border-radius: 50px 0px 0px 50px;
        }
        
        :nth-last-child(1){
            border-radius: 0px 50px 50px 0px;
            }
        
        .menu-button{
            background-color: $milife-green;
            color: white;
            height: inherit;



            &:hover{
                background-color: lighten($milife-green, 20%);
            }
            
            p{
                margin-top: 10px;
            }
        }

    }
}

</style>
