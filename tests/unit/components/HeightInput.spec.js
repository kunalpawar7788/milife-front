import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import HeightInput from "@/components/HeightInput.vue";

describe("HeightInput.vue", () => {
  let wrapper = shallowMount(HeightInput, {
    propsData: {
      height_retrieved_from_User: {
        magnitude_si: 170,
        preferred_unit: "metric",
      },
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.name()).toMatch("HeightInput");
    expect(wrapper.vm.height_retrieved_from_User.preferred_unit).toMatch("metric");
    expect(wrapper.vm.height_retrieved_from_User.magnitude_si).toBe(170);
    expect(wrapper.vm.height_options).toContain("metric");
    expect(wrapper.vm.height_options).toContain("imperial");
    expect(wrapper.vm.magnitude_si).toBe(170);
    expect(wrapper.vm.feet2cm).toBe(30.48);
    expect(wrapper.vm.inch2cm).toBe(2.54);
  });

  it("rounds off values correctly", () => {
    expect(wrapper.vm.round_off2(13.345)).toBe(13.35);
  });

  it("emits results", async () => {
    wrapper.vm.height = "metric";
    wrapper.vm.magnitude_si = 170;

    wrapper.vm.emit_result();
    await Vue.nextTick();

    expect(wrapper.emitted("input")[0][0]).toEqual({
      preferred_unit: "metric",
      magnitude_si: 170,
    });
  });

  it("gets cms from feet", () => {
    expect(wrapper.vm.get_cm_from_feet(5)).toBe(152.4);
  });

  it("gets cm from inches", () => {
    expect(wrapper.vm.get_cm_from_inches(5)).toBe(12.7);
  });

  it("gets feet from cm", () => {
    expect(wrapper.vm.get_feet_from_cm(170)).toBe(5);
  });

  it("gets inches from cm", () => {
    expect(wrapper.vm.get_inches_from_cm(170)).toBe(6);
  });

  it("gets & sets computed property 'cms'", () => {
    expect(wrapper.vm.cms).toBe(170);
    wrapper.vm.cms = 175;
    expect(wrapper.vm.magnitude_si).toBe(175);
  });

  it("gets & sets computed property 'inches'", () => {
    expect(wrapper.vm.inches).toBe(6);
    wrapper.vm.inches = 6;
    expect(wrapper.vm.magnitude_si).toBeCloseTo(167.64);
  });

  it("gets & sets computed property 'feet'", () => {
    expect(wrapper.vm.feet).toBe(5);
    wrapper.vm.feet = 6;
    expect(wrapper.vm.magnitude_si).toBeCloseTo(198.12);
  });
});
