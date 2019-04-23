<template>
<div class="picture-selector-container">
  <label> {{label}}</label>
  <div class="picture-preview"  v-if="image_preview">
    <img v-bind:src="image_preview"> </img>
    <label v-on:click="reset">reset</label>
  </div>
  <div class="picture-preview"  v-else-if="value">
    <img v-bind:src="value"> </img>
  </div>

  <div class="picture-selector">
    <input type="file" v-on:change="read_url($event.target)">
  </div>
</div>
</template>

<script>
export default {
    name: "PictureSelector",
    props: ['id', 'label', 'value'],
    data() {
        return {
            image_preview: null,
        }
    },
    computed: {
    },
    methods: {
        read_url: function (input) {
            var reader  = new FileReader();

            reader.addEventListener("load", function () {
                this.image_preview = reader.result;
            }.bind(this), false);

            if (input.files && input.files[0]) {
                this.$emit('input', input.files[0]);
                var file = input.files[0];
                reader.readAsDataURL(file);
            }
        },
        reset: function(){
            this.image_preview = null;
            this.$emit('input', null);
        }
    },
}
</script>

<style lang="scss">
.picture-selector-container{
    .picture-preview{
        img {
            max-height: 150px;
            max-width:150px;
        }
    }
}
</style>
