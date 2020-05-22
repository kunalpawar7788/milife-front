import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import LogWeightInput from "@/components/LogWeightInput.vue";

describe("LogWeightInput.vue", () => {
  Vue.config.silent = true;

  // Wrapper with props data
  let wrapper1 = shallowMount(LogWeightInput, {
    propsData: {
      value: 75,
      unit: "metric",
    },
  });

  // Wrapper without props data
  let wrapper2 = shallowMount(LogWeightInput);

  it("initializes correctly with props", () => {
    expect(wrapper1.vm.weight).toBe(75);
    expect(wrapper1.vm.stones).toBe(11);
    expect(wrapper1.vm.pounds).toBe(12);
    expect(wrapper1.vm.stones2kg).toBe(6.35);
    expect(wrapper1.vm.pounds2kg).toBe(0.45);
  });

  it("initializes correctly without props", () => {
    expect(wrapper2.vm.weight).toBe(0);
    expect(wrapper2.vm.stones).toBe(0);
    expect(wrapper2.vm.pounds).toBe(0);
    expect(wrapper2.vm.stones2kg).toBe(6.35);
    expect(wrapper2.vm.pounds2kg).toBe(0.45);
  });

  it("converts kgs to stones", () => {
    expect(wrapper1.vm.getWeightInStones(7)).toBe(1);
  });

  it("converts kgs to pounds", () => {
    expect(wrapper1.vm.getWeightInPounds(7)).toBe(1);
  });

  it("converts stones & pounds to kgs", () => {
    expect(wrapper1.vm.getMetricFromImperial(11, 12)).toBeCloseTo(75.29);
  });

  it("emits weight in kgs", async () => {
    wrapper1.vm.emitWeight();
    await Vue.nextTick();

    expect(wrapper1.emitted("input")[0][0]).toBe(75);
  });

  it("updates weight when weight is input in 'kgsWeight' input", async () => {
    let kgsWeightInput = wrapper1.find("div.metric").find("input");
    kgsWeightInput.element.value = 80;
    kgsWeightInput.trigger("input");

    await Vue.nextTick();
    expect(wrapper1.vm.weight).toBe(80);
  });

  it("updates weight when weight is input in 'stoneWeight' input", async () => {
    wrapper1.vm.unit = "imperial";
    await Vue.nextTick();

    let stoneWeight = wrapper1.find("div.imperial").find("input");
    stoneWeight.element.value = 10;
    stoneWeight.trigger("input");

    await Vue.nextTick();

    expect(wrapper1.vm.weight).toBeCloseTo(68.94);
  });

  it("updates weight when weight is input in 'poundWeight' input", async () => {
    wrapper1.vm.unit = "imperial";
    await Vue.nextTick();

    let poundWeight = wrapper1
      .find("div.imperial")
      .findAll("input")
      .at(1);
    poundWeight.element.value = 5;
    poundWeight.trigger("input");

    await Vue.nextTick();

    expect(Math.floor(wrapper1.vm.weight)).toBe(65);
  });
});
