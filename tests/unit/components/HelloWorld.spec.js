import { shallowMount } from "@vue/test-utils";
import HelloWorld from "@/components/HelloWorld.vue";

describe("HeightInput.vue", () => {
    let wrapper = shallowMount(HelloWorld, {
      propsData: {
        msg: "Welcome to this page",
      },
    });

    it("initializes correctly", () => {
        expect(wrapper.name()).toMatch("HelloWorld");
        expect(wrapper.vm.msg).toMatch("Welcome to this page");
      });
});