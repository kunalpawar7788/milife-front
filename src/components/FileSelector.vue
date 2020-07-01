<template>
<div class="file-selector-container">
  <label> {{label}}</label>
  <div class="file-preview"  v-if="file_preview">
    <img v-bind:src="file_preview">
    <label v-on:click="reset">reset</label>
  </div>
  <div class="file-preview"  v-else-if="value">
    <img v-bind:src="value">
    <label v-on:click="reset">reset won\&quott work</label>
  </div>

  <div class="file-selector" v-else>
    <input type="file" v-on:change="read_url($event.target)">
  </div>
</div>
</template>

<script>
export default {
    name: "FileSelector",
    props: ['id', 'label', 'value'],
    data() {
        return {
            file_preview: null,
        }
    },
    computed: {
    },
    methods: {
        read_url: function (input) {
            var reader  = new FileReader();

            reader.addEventListener("load", function () {
                this.file_preview = reader.result;
            }.bind(this), false);

            if (input.files && input.files[0]) {
                this.$emit('input', input.files[0]);
                var file = input.files[0];
                reader.readAsDataURL(file);
            }
        },
        reset: function(){
            this.file_preview = null;
            this.$emit('input', null);
        }
    },
}
</script>

<style lang="scss">
.file-selector-container{
    .file-preview{
    }
}
</style>
