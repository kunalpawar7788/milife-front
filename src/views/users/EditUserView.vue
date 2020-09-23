<template>
<section class="add-user-container">
  <header><h3 class="fc-white">Edit User</h3> </header>

  <template v-if="user">
    <UserAddEditComponent v-bind:fobj_user="user"></UserAddEditComponent>
  </template>
  <h3>
    <router-link :to="{name: 'home'}" class="fc-white"> Cancel </router-link>
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
    margin-bottom: 30px;
    overflow-x: hidden;

    .picture-selector-container{
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        margin-bottom: 15px;
        
        .picture_preview-container{
            grid-row: 1;
            grid-column: 2;

            img {
                max-height: 200px;
                max-width:200px;
            }
        }
        .picture-selector {
            grid-row: 2;
            grid-column: 2;
            min-width: 130px;
        }
    }

}

</style>
