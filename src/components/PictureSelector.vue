<template>
<div class="picture-selector-container">
  <div v-if="cropping" class="fullscreen">
    <Cropper
      v-if="circle_stencil"
      :src="image_preview"
      v-on:change="onChange"
      ref="cropper"
      minHeight="20"
      minWidth="20"
	    :stencilComponent="$options.components.CircleStencil"
	    :stencilProps="{
		                 minAspectRatio: 8/8,
		                 maxAspectRatio: 10/8
	                   }"
      />

    <Cropper v-else
             :src="image_preview"
             v-on:change="onChange"
             ref="cropper"
             minHeight="20"
             minWidth="20"
             :stencilProps="{
                minAspectRatio: 9/16,
                maxAspectRatio: 9/16
             }"
      />

    <button class="button" v-on:click="finish_cropping"> Crop </button>
  </div>
  <div v-else>

    <label> {{label}}</label>
    <div class="picture-preview"  v-if="cropped_image">
      <img v-bind:src="cropped_image"> </img>
      <!-- <label v-on:click="reset">reset</label> -->
    </div>
    <div class="picture-preview"  v-else-if="image_preview">
      <img v-bind:src="image_preview"> </img>
      <!-- <label v-on:click="reset">reset</label> -->
    </div>
    <div class="picture-preview"  v-else-if="value">
      <img v-bind:src="value"> </img>
    </div>

    <div class="picture-selector " v-on:click="$emit('cropping');">
      <input type="file" v-on:change="read_url($event.target)">
    </div>
  </div>
</div>
</template>

<script>
import MyStencil from "@/components/ProfilePictureCropper.vue";
import { Cropper, CircleStencil } from 'vue-advanced-cropper';

/**
 * Convert a base64 string in a Blob according to the data and contentType.
 *
 * @param b64Data {String} Pure base64 string without contentType
 * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
 * @param sliceSize {Int} SliceSize to process the byteCharacters
 * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
 * @return Blob
 */
function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

      var blob = new Blob(byteArrays, {type: contentType});
      return blob;
}


export default {
    name: "PictureSelector",
    props: {
        id: String,
        label: String,
        value: [String, Blob],
        circle_stencil: {
            type: Boolean,
            default: false,
        },
    },

    components: {Cropper, CircleStencil, },
    data() {
        return {
            image_preview: null,
			      coordinates: {
				        width: 0,
				        height: 0,
				        left: 0,
				        top: 0
			      },
            cropping: false,
            cropped_image: null,
            new_image: null,

        }
    },
    computed: {
    },
    methods: {
		    onChange: function({coordinates, canvas}) {
			      this.coordinates = coordinates;

            //this.emit_image(canvas.toDataURL());
        },
        finish_cropping: function() {
			      const {coordinates, canvas} = this.$refs.cropper.getResult();

			      this.coordinates = coordinates;
			      this.cropped_image = canvas.toDataURL();

            // Split the base64 string in data and contentType
            var block = this.cropped_image.split(";");
            // Get the content type of the image
            var contentType = block[0].split(":")[1];// In this case "image/gif"
            // get the real base64 content of the file
            var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

            // Convert it to a blob to upload
            var blob = b64toBlob(realData, contentType);
            this.$emit('input', blob);
            this.cropping = false;
            this.$emit('cropped');

        },
        emit_image: function(image) {
            this.cropped_image = image;
            //this.$emit('input', image);
        },
        read_url: function (input) {
            var reader  = new FileReader();

            reader.addEventListener("load", function () {
                this.image_preview = reader.result;
            }.bind(this), false);

            if (input.files && input.files[0]) {
                this.emit_image(input.files[0]);
                var file = input.files[0];
                reader.readAsDataURL(file);
            }
            this.cropping = true;
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
.fullscreen {
    z-index: 100;
    height: 95%;
    width: 99%;
    overflow:auto;
    background-color: $milife-blue;
    position:fixed;
    /* display: block; */
    top: 0;
    left: 0;
}

.hide_file {
    position: absolute;
    z-index: 1000;
    opacity: 0;
    cursor: pointer;
    right: 0;
    top: 0;
    height: 100%;
    font-size: 24px;
    width: 100%;

}
</style>
