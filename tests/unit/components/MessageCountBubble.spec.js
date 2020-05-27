import { shallowMount } from "@vue/test-utils";
import MessageCountBubble from "@/components/MessageCountBubble.vue";

describe("MessageCountBubble.vue", () => {
  let wrapper = shallowMount(MessageCountBubble, {
    slots: {
      default: "2",
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.name()).toMatch("MessageCountBubble");
  });

  it("contains a '<slot>' element", () => {
    let div = wrapper.find("div.bubble-circle");
    expect(div.text()).toMatch("2");
  });
});
