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

  <input
    id="first_name"
    class="input text-input"
    v-model="first_name"
    placeholder="First Name"/>

  <input
    class="input text-input"
    v-model="last_name"
    placeholder = "Last Name" />

  <input
    class="input text-input"
    v-model="email"
    placeholder="Email" />

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

  <input
    class="input text-input"
    v-model="number"
    placeholder="Number" />


  <button class="input milife-button milife-button__fullsize" @click.prevent="update_user()">Save</button>
</div>

</template>

<script>
import Multiselect from 'vue-multiselect';
import Datepicker from 'vuejs-datepicker';

import { createHelpers } from 'vuex-map-fields';

const { mapFields } = createHelpers(
    {
        getterType: 'user/getField',
        mutationType: 'user/updateField',
    }
);

export default {
    name: "UserDetail",
    components:{Multiselect, Datepicker},

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

    },
    mounted() {
        this.$store.dispatch("user/fetch_user", this.pk);
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
        },
    },

}
</script>

<style lang="scss">
.container-userdetail {
    .input {
        grid-column-start: 2;
        grid-column-end: 2;
        margin: 10px
    }

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

    .container-userdetail{
        display: grid;
        /*grid-template-columns: 40px 50px auto 50px 40px;*/
        grid-template-columns: 1fr 10fr 1fr;
        justify-items: center;


    }

    .profile-calendar {
        color: $milife-green;
        span.cell:hover{
        }
        span.cell:active{
            color: white;
            background-color: $milife-green;
        }

    }
}
</style>
