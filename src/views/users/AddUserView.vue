<template>
<section class="add-user-container">
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
section.add-user-container {
    color: black;
    *{
        margin: 5px;
        color: black;
    }
    input {
        border: 1px solid lighten(grey, 30%);
    }
}
</style>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
