import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import HeightInput from "@/components/HeightInput.vue";

describe("HeightInput.vue", () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = shallowMount(HeightInput, {
      propsData: {
        value: {
          magnitude_si: 170,
          preferred_unit: "metric",
        },
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("initializes correctly", () => {
    expect(wrapper.vm.choice_menu_open).toBeFalsy();
    expect(wrapper.vm.choices).toContain("metric");
    expect(wrapper.vm.choices).toContain("imperial");
    expect(wrapper.vm.preferred_unit).toBe("");
    expect(wrapper.vm.magnitude_si).toBe(0);
    expect(wrapper.vm.feet2cm).toBe(30.48);
    expect(wrapper.vm.inch2cm).toBe(2.54);
  });

  it("selects choice correctly", () => {
    wrapper.vm.select_choice("imperial");
    expect(wrapper.vm.selected).toMatch("imperial");
    wrapper.vm.select_choice("metric");
    expect(wrapper.vm.selected).toMatch("metric");
  });

  it("rounds off values correctly", () => {
    expect(wrapper.vm.round_off2(13.345)).toBe(13.35);
  });

  it("emits results", async () => {
    wrapper.vm.preferred_unit = "metric";
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
    expect(wrapper.vm.get_inches_from_cm(170)).toBe(6.93);
  });

  it("gets & sets computed property 'selected'", () => {
    expect(wrapper.vm.selected).toMatch("metric");
    wrapper.vm.selected = "imperial";
    expect(wrapper.vm.selected).toMatch("imperial");
  });

  it("gets & sets computed property 'cms'", () => {
    expect(wrapper.vm.cms).toBe(170);
    wrapper.vm.cms = 175;
    expect(wrapper.vm.magnitude_si).toBe(175);
  });

  it("gets & sets computed property 'inches'", () => {
    expect(wrapper.vm.inches).toBe(6.93);
    wrapper.vm.inches = 6;
    expect(wrapper.vm.magnitude_si).toBeCloseTo(167.64);
  });

  it("gets & sets computed property 'feet'", () => {
    expect(wrapper.vm.feet).toBe(5);
    wrapper.vm.feet = 6;
    expect(wrapper.vm.magnitude_si).toBeCloseTo(200.48);
  });
});
