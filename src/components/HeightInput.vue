<template>

<div class="choicefield-container">
  <div class="label"> <label> Height </label></div>
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
    class="feet">

    <input type="number" v-model="feet" placeholder="feet" />
  </div>
  
  <div
    v-if="selected=='imperial' && !choice_menu_open"
    class="inches">
    <input type="number" v-model="inches" placeholder="inches"/>
  </div>

  <div
    v-if="selected=='metric' && !choice_menu_open"
    class="cms">
    <input type="number" v-model="cms" placeholder="cms" />
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
    div.feet {
        grid-column: 5 / span 1;
    }
    div.inches{
        grid-column: 6/ span 1;
        input{
            border-radius: 0px 50px 50px 0px;
        }
    }
    div.cms{
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
        padding: none;
        width: 100%;
        height:100%                          
    }

}

</style>

