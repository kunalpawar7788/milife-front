import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import WeightInput from "@/components/WeightInput.vue";

describe("WeightInput.vue", () => {
  let wrapper = shallowMount(WeightInput, {
    propsData: {
      weight_retrieved_from_User: {
        preferred_unit: "metric",
        magnitude_si: 70,
      },
    },
  });

  it("inititalizes correctly", () => {
    expect(wrapper.name()).toMatch("WeightInput");
    expect(wrapper.vm.weight_retrieved_from_User.preferred_unit).toMatch("metric");
    expect(wrapper.vm.weight_retrieved_from_User.magnitude_si).toBe(70);
    expect(wrapper.vm.weight_options).toContain("metric");
    expect(wrapper.vm.weight_options).toContain("imperial");
    expect(wrapper.vm.magnitude_si).toBe(70);
    expect(wrapper.vm.stones2kg).toBe(6.35);
    expect(wrapper.vm.pounds2kg).toBe(0.45);
  });

  it("rounds off values correctly", () => {
    expect(wrapper.vm.round_off2(13.345)).toBe(13.35);
  });

  it("emits results", async () => {
    wrapper.vm.weight = "metric";
    wrapper.vm.magnitude_si = 70;

    wrapper.vm.emit_result();
    await Vue.nextTick();

    expect(wrapper.emitted("input")[0][0]).toEqual({
      preferred_unit: "metric",
      magnitude_si: 70,
    });
  });

  it("converts stones to kg", () => {
    expect(wrapper.vm.get_kg_from_stones(10)).toBe(63.5);
  });

  it("converts pounds to kgs", () => {
    expect(wrapper.vm.get_kg_from_pounds(10)).toBe(4.5);
  });

  it("converts kg to stones", () => {
    expect(wrapper.vm.get_stones_from_kg(63.5)).toBe(10);
  });

  it("converts kgs to pounds", () => {
    expect(wrapper.vm.get_pounds_from_kg(4.5)).toBe(10);
  });

  it("gets & sets computed property kgs", () => {
    expect(wrapper.vm.kgs).toBe(70);
    wrapper.vm.kgs = 60;
    expect(wrapper.vm.magnitude_si).toBe(60);
  });

  it("gets & sets computed property pounds", () => {
    expect(wrapper.vm.kgs).toBe(70);
    expect(wrapper.vm.pounds).toBe(0.28);
    wrapper.vm.pounds = 10;
    expect(wrapper.vm.magnitude_si).toBeCloseTo(74.35);
  });

  it("gets & sets the computed property stones", () => {
    expect(wrapper.vm.kgs).toBe(70);
    expect(wrapper.vm.stones).toBe(11);
    wrapper.vm.stones = 10;
    expect(wrapper.vm.magnitude_si).toBeCloseTo(63.63);
  });
});
