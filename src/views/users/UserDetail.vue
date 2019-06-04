<template>
<div class="container-userdetail">

  <div class="input">
    <datepicker
      wrapper-class="profile-calendar"
      input-class="text-input"
      v-model="date_of_birth"
      format="yyyy-MM-dd"
      :typeable="true"
      placeholder="Select Date of Birth">
    </datepicker>
  </div>

  <div>
    <input
      id="first_name"
      class="input text-input"
      v-model="first_name"
      placeholder="First Name"/>
  </div>


  <div>
    <input
      class="input text-input"
      v-model="last_name"
      placeholder="Last Name" />
  </div>


  <div>
    <input
      class="input text-input"
      v-model="email"
      placeholder="Email" />
  </div>


  <div class="input genderselect">
    <multiselect
      v-model="gender"
      placeholder="Gender"
      :options="gender_options"
      label="label"
      track-by="value"
      >
    </multiselect>
  </div>

  <div>
    <input
      class="input text-input"
      v-model="number"
      placeholder="Number" />
  </div>


  <div class="heightinput-container">
    <HeightInput v-model="height"> </HeightInput>
  </div>

  <div> <button class="input milife-button milife-button__fullsize" @click.prevent="update_user()">Save</button></div>
</div>

</template>

<script>
import Multiselect from 'vue-multiselect';
import Datepicker from 'vuejs-datepicker';
import HeightInput from '@/components/HeightInput.vue';
import { createHelpers } from 'vuex-map-fields';

const { mapFields } = createHelpers(
    {
        getterType: 'user/getField',
        mutationType: 'user/updateField',
    }
);

export default {
    name: "UserDetail",
    components:{Multiselect, Datepicker, HeightInput},

    computed: {
        ...mapFields([
            'user.first_name',
            'user.last_name',
            'user.email',
            'user.number',
        ]),
        gender: {
            get(){
                var d = {
                    M: {label: 'Male', value: 'M',},
                    F: {label: 'Female', value: 'F'},
                    N: {label: 'Would rather not say', value: 'N'},
                };

                return d[this.$store.state.user.user['gender']] || {};
            },
            set(value){
                this.$store.commit("user/update_gender_field", value);
            }
        },

        date_of_birth: {
            get() {
                return this.$store.state.user.user.date_of_birth;
            },

            set(value) {
                this.$store.commit("user/update_date_of_birth_field", value);
            }
        },

        height: {
            get() {
                return {
                    magnitude_si: this.$store.state.user.user.height_cm,
                    preferred_unit: this.$store.state.user.user.height_unit || 'metric',
                };
            },

            set(value) {
                this.$store.commit("user/update_height_field", value);
            }

        }

    },
    mounted() {
        this.$store.dispatch("user/fetch_user", this.pk);
        this.$store.dispatch("theme/set_theme_blue");
    },

    data() {
        return {
            //gender_options: ['Male', 'Female', 'Would rather not say'],
            gender_options: [
                {label: 'Male', value: 'M',},
                {label: 'Female', value: 'F'},
                {label: 'Would rather not say', value: 'N'},
            ],
            pk:  this.$route.params.pk,
        }

    },

    methods: {
        update_user: function(){
            this.$store.dispatch("user/update_user");
            console.log('bleh');
        },
    },

}
</script>

<style lang="scss">
.container-userdetail {
    display: grid;
    grid-template-columns: 2fr 3fr 2fr;
    grid-auto-rows: 70px;
    justify-items: center;
    align-items: center;
    div {

        grid-column: 2 / span 1;

        .multiselect{
            height: 52px;
            width: 320px;
            margin: auto;
            .multiselect__select{
                top: 10px;
                right: 10px;
            }

            .multiselect__tags {
                border-radius: 50px;
                height: 52px;
                width: 320px;
                padding-top: 14px;
            }

        }

        #first_name {

        }

        .profile-calendar {
            color: $milife-green;
            margin: 0 auto;
            span.cell:hover{
            }
            span.cell:active{
                color: white;
                background-color: $milife-green;
            }

        }
    }
}
</style>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
