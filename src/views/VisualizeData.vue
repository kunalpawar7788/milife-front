<template>
  <div>
    <h2>Visualize Data</h2>
    <VisualizeDataComponent :fobj_user="this.fobj_user" />
  </div>
</template>

<script>
import store from "@/store";
import VisualizeDataComponent from "@/components/VisualizeDataComponent.vue";

export default {
  name: "VisualizeData",
  props: ["fobj_user"],

  data() {
    return {};
  },

  mounted() {
    this.$store.dispatch("theme/set_theme_blue");
  },

  computed: {
    user: function() {
      var user = Object.assign({}, this.$store.state.auth.user);

      if (this.$route.params.pk) {
        user = Object.assign({}, this.fobj_user);
      }

      return user;
    },
  },

  components: {
    VisualizeDataComponent,
  },
};
</script>

<style lang="scss"></style>
