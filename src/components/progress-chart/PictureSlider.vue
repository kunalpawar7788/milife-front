<template>
<div class="picture-slider">
  <template v-if="show_front">
    <div class="picture">
      <img :src="pictures.original_front_profile"
           alt="NA" />
    </div>
    <div class="picture">
      <img :src="pictures.current_front_profile"
           alt="NA"
           />
    </div>
    <div class="arrow-div" v-on:click="show_front=false">
      <div class="arr-right">
      </div>
    </div>
  </template>
  <template v-else>
    <div class="arrow-div" v-on:click="show_front=true">
      <div class="arr-left">
      </div>
    </div>
    <div class="picture">
      <img :src="pictures.original_side_profile"
           alt="NA"
           />

    </div>
    <div class="picture">
      <img :src="pictures.current_side_profile"
           alt="NA"
           />
    </div>
  </template>
</div>
</template>

<script>

export default{
    name: "PictureSlider",
    props: ['pictures', ],

    data() {
        return {
            show_front: true,
        };

    },

}
</script>

<style lang="scss">
.picture-slider{
    margin-top: 30px;
    display: flex;
    .picture{
        height: 350px;
        width: 47%;

        img {

            height: 350px;

        }
    }

    .arrow-div {
        margin-left: auto;
        width: 6%;
        display: flex;
    align-items: center;
}


}
</style>
