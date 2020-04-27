<template>
<section class="add-user-container">
  <header><h3>Edit User</h3> </header>

  <template v-if="user">
    <UserAddEditComponent v-bind:fobj_user="user"></UserAddEditComponent>
  </template>
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
    name: "EditUserView",

    props: ['fobj_user', ],

    components: {
        Multiselect,
        Datepicker,
        UserAddEditComponent,
    },
    computed: {
        user() {
            console.log('computed', this.fobj_user);
            return this.fobj_user;

        },
    },

    data() {
        return {
        }
    },
    methods: {

    },
    created() {
        console.log('here', this.fobj_user);
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

    .picture-selector-container{
        *{
            margin: 0px;
        }
        .picture-preview{
            img {
                max-height: 200px;
                max-width:200px;
            }
        }
    }

}

</style>
