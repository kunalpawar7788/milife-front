import Vuex from "vuex";
import Vue from "vue";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import UserEmailVerificationPending from "@/components/UserEmailVerificationPending.vue";

describe("UserEmailVerificationPending.vue", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const store = new Vuex.Store({
    state: {
      email: "abc@xyz.com",
    },
    getters: {
      "auth/email": (state) => state.email,
    },
  });

  let wrapper = shallowMount(UserEmailVerificationPending, {
    mocks: {
      $store: store,
      $http: jest.fn(() => Promise.resolve("resolved")),
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.name()).toMatch("UserEmailVerificationPending");
    expect(wrapper.vm.email).toMatch(store.state.email);
    expect(wrapper.vm.email_sent).toBeFalsy();
  });

  it("resends verification email", async () => {
    wrapper.vm.resend_email();
    await Vue.nextTick();

    const url =
      process.env.VUE_APP_BASE_URL +
      "/api/auth/resend_user_email_verification_mail/";

    expect(wrapper.vm.email_sent).toBeTruthy();
    expect(wrapper.vm.$http).toBeCalledWith({
      url,
      data: { email: store.state.email },
      method: "POST",
    });
  });

  it("handles error while resending verification email", async () => {
    wrapper.vm.email_sent = false;
    wrapper.vm.$http = jest.fn(() => Promise.reject("rejected"));
    wrapper.vm.resend_email();
    await Vue.nextTick();

    expect(wrapper.vm.email_sent).toBeFalsy();
  });
});
