<template>
  <Cropper
		src="https://images.pexels.com/photos/226746/pexels-photo-226746.jpeg"
		@change="onChange"
  />

</template>


<script>
import { Cropper } from 'vue-advanced-cropper';

export default {
    name: "MyStencil",

	  data() {
		    return {
			      coordinates: {
				        width: 0,
				        height: 0,
				        left: 0,
				        top: 0
			      },
			      image: null
		    }
	  },
	  methods: {
		    onChange({coordinates, canvas}) {
			      this.coordinates = coordinates
			      // You able to do different manipulations at a canvas
			      // but there we just get a cropped image
			      //this.image = canvas.toDataURL()
		    }
	  },
	  components: {
		    Cropper
	  }
}


</script>
