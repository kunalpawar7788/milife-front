import { shallowMount } from "@vue/test-utils";
import WeightInput from "@/components/WeightInput.vue";

describe("WeightInput.vue", () => {
  let wrapper = null;

  beforeEach(() => {
    wrapper = shallowMount(WeightInput, {
      propsData: {
        value: {
          preferred_unit: "metric",
          magnitude_si: 0,
        },
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  it("inititalizes correctly", () => {
    expect(wrapper.name()).toMatch("WeightInput");

    expect(wrapper.vm.value.preferred_unit).toMatch("metric");
    expect(wrapper.vm.value.magnitude_si).toBe(0);

    expect(wrapper.vm.choice_menu_open).toBeFalsy();
    expect(wrapper.vm.choices).toContain("imperial");
    expect(wrapper.vm.choices).toContain("metric");
    expect(wrapper.vm.preferred_unit).toMatch("");
    expect(wrapper.vm.magnitude_si).toBe(0);
    expect(wrapper.vm.stones2kg).toBe(6.35);
    expect(wrapper.vm.pounds2kg).toBe(0.45);
  });

  it("selects choice correctly", () => {
    expect(wrapper.vm.selected).toMatch("metric");

    wrapper.vm.select_choice("imperial");
    expect(wrapper.vm.selected).toMatch("imperial");

    wrapper.vm.select_choice("metric");
    expect(wrapper.vm.selected).toMatch("metric");
  });

  it("hides choice menu when choice is selected", () => {
    wrapper.vm.choice_menu_open = true;
    wrapper.vm.select_choice("metric");
    expect(wrapper.vm.choice_menu_open).toBeFalsy();
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
    expect(wrapper.vm.kgs).toBe(0);
    wrapper.vm.kgs = 60;
    expect(wrapper.vm.kgs).toBe(60);
  });

  it("gets & sets computed property pounds", () => {
    expect(wrapper.vm.pounds).toBe(0);
    wrapper.vm.pounds = 10;
    expect(wrapper.vm.pounds).toBe(10);
  });

  it("gets & sets the computed property stones", () => {
    expect(wrapper.vm.stones).toBe(0);
    wrapper.vm.stones = 10;
    expect(wrapper.vm.stones).toBe(10);
  });
});
