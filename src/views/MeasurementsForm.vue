<template>
<div class="measurementsform-container">
  <h3> Add Check in for {{fobj_user.first_name}}</h3>
  <div class="checkin-date">
    <datepicker
      wrapper-class="checkin-datepicker"
      input-class="text-input"
      v-model="checkin_date"
      format="yyyy-MM-dd"
      :typeable="true"
      placeholder="Select Date of Checkin"
      v-on:input="reload"
      >
    </datepicker>
  </div>


  <div class="picture-input-side-profile">
    <PictureSelector
      v-model="photo_side_profile"
      id="side_profile"
      label="Side Profile"
      > </PictureSelector>
  </div>

  <div class="picture-input-front-profile">
    <PictureSelector
      v-model="photo_front_profile"
      id="front_profile"
      label="Front Profile"
      > </PictureSelector>
  </div>

  <div class="form-label">
    <label>Waist (inches)</label>
  </div>

  <div class="form-input">
    <input type="number" min="0" step="0.01" v-model="waist"/>
  </div>

  <div class="form-label">
    <label>Hips (inches)</label>
  </div>
  <div class="form-input">

    <input type="number" min="0" step="0.01" v-model="hips"/>
  </div>


  <div class="form-label">
    <label>Chest (inches)</label>
  </div>
  <div class="form-input">

    <input type="number" min="0" step="0.01" v-model="chest"/>
  </div>


  <div class="form-label">
    <label>Shoulders (inches)</label>
  </div>
  <div class="form-input">

    <input type="number" min="0" step="0.01" v-model="shoulders"/>
  </div>


  <div class="form-label">
    <label>Left Arm (inches)</label>
  </div>
  <div class="form-input">

    <input type="number" min="0" step="0.01" v-model="left_arm"/>
  </div>


  <div class="form-label">
    <label>Right Arm(inches)</label>
  </div>
  <div class="form-input">

    <input type="number" min="0" step="0.01" v-model="right_arm"/>
  </div>

  <div class="form-label">
    <label>Left Leg(inches)</label>
  </div>
  <div class="form-input">

    <input type="number" min="0" step="0.01" v-model="left_leg"/>
  </div>


  <div class="form-label">
    <label>Right Leg (inches)</label>
  </div>
  <div class="form-input">

    <input type="number" min="0" step="0.01" v-model="right_leg"/>
  </div>
  <button class="button" v-on:click="submit"> Save </button>

</div>
</template>

<script>
import Datepicker from 'vuejs-datepicker';
import { createHelpers } from 'vuex-map-fields';
import PictureSelector from '@/components/PictureSelector';

const { mapFields } = createHelpers(
    {
        getterType: 'checkin/getField',
        mutationType: 'checkin/updateField',
    }
);

export default {
    name: "MeasurementsInput",
    props: ['fobj_user', ],
    components: {Datepicker, PictureSelector},
    data() {
        return {
            user_id: this.$route.params.pk,
        }
    },
    methods: {
        submit: function(){
            this.$store.dispatch("checkin/upsert_checkin");
        },
        reload: function(){
            console.log('reloading ...');
        }

    },
    mounted: function() {
        this.$store.dispatch("theme/set_theme_white");
        //this.$store.dispatch("checkin/fetch_checkin_for_user_by_date", this.user_id, this.checkin_date);
        //this.$store.dispatch("checkin/fetch_checkin_for_user_by_date", this.user_id, new Date());

    },
    computed: {
        ...mapFields([
            'measurements.waist',
            'measurements.hips',
            'measurements.chest',
            'measurements.shoulders',
            'measurements.left_arm',
            'measurements.right_arm',
            'measurements.left_leg',
            'measurements.right_leg',
            'photo_side_profile',
            'photo_front_profile',
        ]),
        checkin_date: {
            get() {
                return this.$store.state.checkin.checkin_date;
            },

            set(value) {
                //this.$store.commit("checkin/update_checkin_date_field", value);
                //this.$store.dispatch("checkin/fetch_checkin_for_user_by_date", this.user_id, value);
                var user_id = this.user_id;
                var date = value
                this.$store.commit("checkin/INITIALIZE", {user_id, date});
                this.$store.dispatch("checkin/fetch_checkin_for_user_by_date");

            }
        },

    },
}
</script>

<style lang="scss">
.measurementsform-container{
    color: black;
    display: grid;
    grid-template-columns: 2fr 2fr 1fr 2fr 2fr;
    grid-row-gap: 10px;
    grid-column-gap: 5px;

    h3 {
        grid-column: 1 / span 5;
    }

    .form-label{
        grid-column: 1 / span 2;
        justify-self: left;
    }
    .form-input{
        grid-column: 4/ span 2;
        input{
            text-align: center;
            width: 100%;
        }

    }
    .picture-input{
        width: 100%;
        height: 150px;
    }
    .picture-input-side-profile{
        grid-column: 4 / span 2;
        grid-row: 3;

    }

    .picture-input-front-profile{
        grid-column: 1 / span 2;
        grid-row: 3;
        width: 100%;
        height: 150px
    }
    .checkin-date{
        grid-column: 2 / span 3;
        justify-self: center;

    }
    .picture-input{
        grid-column: 1/ span 5;

    }
    *.checkin-datepicker {
        color: $milife-green;
        margin: 0 auto;
        width: 100%;
        span.cell:hover{
        }
        span.cell:active{
            color: white;
            background-color: $milife-green;
        }

    }

    .button{
        grid-column: 2/ span 3;
        height: 10px;
    }

}

</style>
