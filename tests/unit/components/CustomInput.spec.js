import { shallowMount } from "@vue/test-utils";
import CustomInput from "@/components/CustomInput.vue";

describe("HeightInput.vue", () => {
    let wrapper = shallowMount(CustomInput, {
      propsData: {
        value: 70,
        suffix: " kg",
      },
    });

    it("initializes correctly", () => {
        expect(wrapper.name()).toMatch("CustomInput");
        expect(wrapper.vm.value).toBe(70);
        expect(wrapper.vm.suffix).toMatch(" kg");
        expect(wrapper.vm.local).toBe(70);
      });

    it("gives the text value for input", () => {
        expect(wrapper.vm.text).toMatch("70 kg");
    });

    it("emits input on setting the text value", () => {
        expect(wrapper.vm.text).toMatch("70 kg");
        wrapper.vm.text = 54
        expect(wrapper.emitted("input")[0][0]).toEqual("54 kg");
    });
});