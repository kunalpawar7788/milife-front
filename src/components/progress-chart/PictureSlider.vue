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
            width: 100%;
            meight: 100%;

        }
    }
    .arrow-div {
        margin-left: auto;
        width: 6%;
        display: flex;
        align-items: center;
    }
    [class^=arr-]{  /* Arrows @RCB */
        border:       solid currentColor;
        border-width: 0 .2em .2em 0;
        display:      inline-block;
        padding:      .20em;
    }
    .arr-right {transform:rotate(-45deg);}
    .arr-left  {transform:rotate(135deg);}
    .arr-up    {transform:rotate(-135deg);}
    .arr-down  {transform:rotate(45deg);}



}
</style>
