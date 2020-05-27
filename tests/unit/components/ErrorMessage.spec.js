import { shallowMount } from "@vue/test-utils";
import ErrorMessage from "@/components/ErrorMessage.vue";

describe("ErrorMessage.vue", () => {
  let error_message = "error msg";
  let wrapper = shallowMount(ErrorMessage, {
    propsData: { error_message },
  });

  it("initializes with correct props data", () => {
    expect(wrapper.vm.error_message).toMatch(error_message);
  });

  it("contains a div with errormessage class", () => {
    expect(wrapper.find("div").element.classList).toContain("errormessage");
  });

  it("renders div with the error message", () => {
    expect(wrapper.find("div").text()).toMatch(error_message);
  });
});
