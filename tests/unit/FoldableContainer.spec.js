import { shallowMount } from "@vue/test-utils";
import FoldableContainer from "@/components/FoldableContainer.vue";

describe("FoldableContainer.vue", () => {
  let wrapper = shallowMount(FoldableContainer, {
    propsData: {
      label: "Test",
    },
    slots: {
      default: '<div class="test-div"></div>',
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.vm.status).toMatch("");
    expect(wrapper.vm.collapsed).toBeTruthy();
  });

  it("toggles correctly", () => {
    wrapper.vm.toggle();
    expect(wrapper.vm.collapsed).toBeFalsy();
    wrapper.vm.toggle();
    expect(wrapper.vm.collapsed).toBeTruthy();
  });
});
