<template>
  <div class="weight-input-container bg-white pd-10 br-20 width-50 ">
    <div v-if="unit == 'metric'">
      <input
        class="weight-input"
        type="number"
        min="0"
        ref="kgsWeight"
        :value="weight"
        @input="updateWeight('metric')"
      />
      <span>KG</span>
    </div>
    <div v-else-if="unit === 'imperial'">
      <input
        class="weight-input"
        type="number"
        min="0"
        ref="stoneWeight"
        :value="stones"
        @input="updateWeight('imperial')"
      />
      <span class="mr-20">st</span>
      <input
        class="weight-input"
        type="number"
        min="0"
        ref="poundsWeight"
        :value="pounds"
        @input="updateWeight('imperial')"
      />
      <span>lbs</span>
    </div>
    <div v-else>
      <p>Cannot handle {{ unit }}!</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LogWeightInput",
  props: ["value", "unit"],

  data() {
    return {
      weight: this.value || 0,
      stones: 0,
      pounds: 0,
      stones2kg: 6.35,
      pounds2kg: 0.45
    };
  },

  methods: {
    getMetricFromImperial(stones, pounds) {
      return (stones + pounds / 14) * this.stones2kg;
    },

    getWeightInStones(weight) {
      return Math.floor(weight / this.stones2kg);
    },

    getWeightInPounds(weight) {
      var pounds = Math.floor(weight / this.pounds2kg);
      var stones = Math.floor(weight / this.stones2kg);

      return Math.floor(pounds - stones * 14);
    },

    emitWeight() {
      console.log(`Emitting results ${this.weight}`);
      this.$emit("input", this.weight);
    },

    updateWeight(unit) {
      if (unit === "metric") {
        this.weight = parseFloat(this.$refs.kgsWeight.value) || 0;
      } else if (unit == "imperial") {
        const stones = parseFloat(this.$refs.stoneWeight.value);
        const pounds = parseFloat(this.$refs.poundsWeight.value);
        this.weight = this.getMetricFromImperial(stones, pounds) || 0;
        this.stones = stones;
        this.pounds = pounds;
      } else {
        console.error(`Cannot handle ${this.unit}`);
      }
      this.emitWeight();
    }
  },

  created() {
    this.stones = this.getWeightInStones(this.weight);
    this.pounds = this.getWeightInPounds(this.weight);
  }
};
</script>

<style lang="scss">
.weight-input-container {
  display: inline-flex;

  input.weight-input {
    width: 20%;
    font-size: 20pt;
    text-align: right;
    border: none;
  }
}
</style>
