    <template>
    <div class="profile-container">
    <h1>Profile</h1>
    <div class="form">
    <form class="updateprofile" @submit.prevent="update_profile">
    <div class="genderselect">
    <multiselect v-model="selected_gender" placeholder="Gender" :options="gender_options">
    </multiselect>
    </div>
    <div class="heightinput"><input v-model="profile_data.height_cm" type="text" class="text-input" placeholder="your height in cm"></div>
    <div class="weightinput"><input  v-model="profile_data.weight_kg" type="text" class="text-input" placholder="your weight in kg"></div>
    <div class="birthdateinput"><datepicker v-model="profile_data.date_of_birth"></datepicker></div>
    <button type="submit" class="milife-button milife-button__fullsize">Update</button>
    </form>
    </div>
    <div> Debug: {{profile_data}}</div>
    </div>
    </template>


    <script>
import axios from 'axios';
import store from '@/store';2
import Multiselect from 'vue-multiselect';
import Datepicker from 'vuejs-datepicker';

export default {
    components: { Multiselect, Datepicker },
    
    name: "UpdateProfile",
    data() {
        return {
            gender_options: ['Male', 'Female', 'Would rather not say'],
            selected_gender: null,
            profile_data : {
                date_of_birth: "",
                weight_kg: "",
                weight_unit: "kg",
                height_cm: "",
                height_unit: "cm",
                gender: "",
            }
        }
        
    },
    
    created: function(){
        this.$store.dispatch('auth/fetch_profile')
            .then(() => console.log('fetched profile'))
            .catch(err => console.log(err))
    },
    mounted: function(){
        console.log(this.$store.state.auth.user.email);
        this.profile_data.date_of_birth = this.$store.state.auth.user.date_of_birth;
        this.$store.dispatch("theme/set_theme_blue");
        
    },

    methods: {
        update_profile(){
            this.$store.dispatch('auth/update_profile', this.profile_data)
                .then(() => console.log('update_profile'))
                .catch(err => console.log(err))

        },

    },
}

</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>

<style lang="scss">
.profile-container{
    .genderinput {
        width: 200px;
    }
    .birthdateinput {

    }
    .vdp-datepicker {
        text-align: center;
        padding-top: 20px;

        color: #8AC53F;

        input {
            color: red;
            border: none;
            border-radius: 50px;
            color: grey;
            height: 50px;
            padding-left: 20px;
            font-size: 15pt;
            font-family: Monteserrat Regular;
            width: 300px;
            outline: none;
            //padding-top: 20px;
            margin-top: 20px;
        }
    }

    .genderselect {
        height: 50px;
        width: 300px;
        margin: auto;
        .multiselect__tags {
            border-radius: 50px;
        }

    }
    .multiselect__tags{
        border-radius: 50px;
        height: 50px;
        width: 300px;
        padding-left: 20px;
        font-size: 15pt;
        font-family: Monteserrat Regular;

    }
    .multiselect__select{
        padding: 30px 8px;
    }


    .vdp-datepicker__calendar {
        margin: auto;
        position: inherit;
    }
}

</style>
