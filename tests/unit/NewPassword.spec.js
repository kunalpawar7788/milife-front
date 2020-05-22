import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import NewPassword from "@/components/NewPassword.vue";

describe("NewPassword.vue", () => {
  let wrapper = shallowMount(NewPassword);

  it("initializes correctly", () => {
    expect(wrapper.vm.password).toBeNull();
    expect(wrapper.vm.confirmpassword).toBeNull();
  });

  it("updates passwords correctly", async () => {
    let passwordInput = wrapper.find("#password");
    passwordInput.element.value = "test-pass";
    passwordInput.trigger("input");

    await Vue.nextTick();

    expect(wrapper.emitted("input")[0][0]).toMatch("");

    let confirmPasswordInput = wrapper.find("#confirmpassword");
    confirmPasswordInput.element.value = "test-pass";
    confirmPasswordInput.trigger("input");

    await Vue.nextTick();

    expect(wrapper.emitted("input")[1][0]).toMatch("test-pass");
  });

  it("checks if passwords match correctly", () => {
    wrapper.vm.password = "test";
    wrapper.vm.confirmpassword = "test";

    expect(wrapper.vm.passwordsMatch).toBeTruthy();

    wrapper.vm.password = "test1";
    expect(wrapper.vm.passwordsMatch).toBeFalsy();

    wrapper.vm.confirmPasswordInput = "test2";
    expect(wrapper.vm.passwordsMatch).toBeFalsy();
  });
});
