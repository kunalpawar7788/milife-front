<template>
<section class="add-user-container specific-add-user-css">
  <header><h3>Add New User </h3> </header>
  <UserAddEditComponent :fobj_user="{}"></UserAddEditComponent>
  <h3>
    <router-link :to="{name: 'home'}"> Cancel </router-link>
  </h3>

</section>
</template>

<script>
import Multiselect from 'vue-multiselect';
import Datepicker from 'vuejs-datepicker';
import moment from 'moment';
import UserAddEditComponent from "@/components/UserAddEditComponent.vue";

export default {
    name: "AddUserView",
    components: {
        Multiselect,
        Datepicker,
        UserAddEditComponent,
    },

    data() {
        return {}
    },
    methods: {
    },
}
</script>

<style lang="scss">
section.add-user-container.specific-add-user-css {
    color: black;
    padding-bottom: 20px;
    margin: 0;

    *{
        color: black;
    }
    .picture_preview-container {
        margin: 5px;
    }
    .picture-selector {
        label#file-drag {
            margin-bottom: 15px;
            
            span#file-upload-btn {
                color: #fff;
            }
        }
    }
    .genderselect {

        .multiselect__select {
            width: 60px!important;
            margin-top: 5px;
        }
        .multiselect__tags {
            background: #efefef;
            height: 50px;
            line-height: 30px;
            padding-left: 20px;
            font-size: 18px;
            font-weight: 500;

            input.multiselect__input {
                background: #efefef;
            }
        }
        .multiselect__single {
            line-height: 30px;
        }
    }
    .is_staff label, 
    .is_active label,
    div.choicefield-container div.label label,
    a.router-link-active {
        color: black!important;
    }
    div.choicefield-container {
        div.feet, div.inches, div.cms,
        div.stones, div.lbs, div.kgs {
            background: #efefef;

            input {
                background: #efefef;
            }
        }
    }
    button.button {
        color: #fff!important;
    }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
