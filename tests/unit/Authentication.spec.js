import Vuex from "vuex";
import Vue from "vue";
import { mount, createLocalVue } from "@vue/test-utils";
import Authentication from "@/components/Authentication";

describe("Authentication.vue", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  const user = {
    id: "6a7c6d31-fc4f-4dea-98f2-3db249acfa67",
    first_name: "Some",
    last_name: "One",
    email: "someone@something.com",
    is_active: true,
    is_staff: true,
    email_verified: true,
    weight_kg: "75.00",
    height_cm: "170.00",
    height_unit: "metric",
    weight_unit: "metric",
    date_of_birth: "1993-06-15",
    image: null,
    gender: "M",
    number: "124876095",
    invited: false,
  };

  const store = new Vuex.Store({
    modules: {
      auth: {
        state: { user },
      },
      getters: {
        "auth/is_staff": (state) => state.auth.user["is_staff"],
      },
    },
  });

  store.dispatch = jest.fn(() => {
    return new Promise((resolve, reject) => {
      resolve("resolved");
    });
  });

  let wrapper = mount(Authentication, {
    mocks: {
      $store: store,
      $http: jest.fn(),
      $router: {
        push: jest.fn(),
      },
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.vm.email).toMatch("");
    expect(wrapper.vm.password).toMatch("");
    expect(wrapper.vm.error_message).toMatch("");
    expect(wrapper.vm.error).toBeNull();
  });

  it("contains an email input bound to 'email' data value", () => {
    const emailInput = wrapper.find("input.text-input");
    emailInput.element.value = "abc@xyz.com";
    emailInput.trigger("input");

    expect(wrapper.vm.email).toMatch("abc@xyz.com");
  });

  it("contains a password input bound to 'password' data valye", () => {
    const passInput = wrapper.find("input.password-input");
    passInput.element.value = "abcde";
    passInput.trigger("input");

    expect(wrapper.vm.password).toMatch("abcde");
  });

  it("calls `$store.dispatch` correctly on login", () => {
    wrapper.vm.login();
    const params = [
      "auth/login",
      { email: wrapper.vm.email, password: wrapper.vm.password },
    ];

    expect(wrapper.vm.$store.dispatch).toBeCalledWith(...params);
  });

  it("calls `$router.push` on successful login", () => {
    wrapper.vm.login();
    expect(wrapper.vm.$router.push).toBeCalledWith("/");
  });

  it("sets `error_message` & `error` correctly on unsuccessful login for a error >= 500", async () => {
    let err = { response: { status: 500 } };

    wrapper.vm.$store.dispatch = jest.fn(() => {
      return new Promise((res, rej) => {
        rej(err);
      });
    });

    wrapper.vm.login();
    await Vue.nextTick();

    expect(wrapper.vm.error).toBe(err);
    expect(wrapper.vm.error_message).toMatch(
      "Something went wrong !! Please try after sometime."
    );
  });

  it("sets `error_message` & `error` correctly on unsuccessful login for a error < 500", async () => {
    let err = {
      response: { status: 400, data: { errors: [{ message: "test-error" }] } },
    };

    wrapper.vm.$store.dispatch = jest.fn(() => {
      return new Promise((res, rej) => {
        rej(err);
      });
    });

    wrapper.vm.login();
    await Vue.nextTick();

    expect(wrapper.vm.error).toBe(err);
    expect(wrapper.vm.error_message).toMatch("test-error");
  });
});
