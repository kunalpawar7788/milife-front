import Vue from "vue";
import Vuex from "vuex";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import LogWeightComponent from "@/components/LogWeightComponent.vue";

describe("LogWeightComponent.vue", () => {
  Vue.config.silent = true;

  const localVue = createLocalVue();
  localVue.use(Vuex);

  const mockDate = new Date(1572393600000);
  global.Date = jest.fn(() => mockDate);

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
    },
  });

  let wrapper = shallowMount(LogWeightComponent, {
    propsData: {
      fobj_user: user,
    },
    mocks: {
      $route: {
        params: {
          pk: undefined,
        },
      },
      $router: {
        push: jest.fn(),
      },
      $store: store,
      $http: jest.fn(() => Promise.resolve("resolved")),
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.vm.measured_on).toEqual(mockDate);
    expect(wrapper.vm.weight.magnitude_si).toBe(parseFloat(user.weight_kg));
    expect(wrapper.vm.weight.preferred_unit).toBe(user.weight_unit);
  });

  it("gets user from store", () => {
    expect(wrapper.vm.user.id).toBe(store.state.auth.user.id);
  });

  it("gets user from props if '$route.params.pk' is defined", () => {
    wrapper.vm.$route.params.pk = user.id;
    expect(wrapper.vm.user.id).toBe(user.id);
  });

  it("calls the API to log weight correctly", async () => {
    const url =
      process.env.VUE_APP_BASE_URL + "/api/users/" + user.id + "/weight";

    wrapper.vm.add_weight_to_log();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({
      url,
      data: { measured_on: "2019-10-30", weight: 75 },
      method: "POST",
    });
    expect(wrapper.vm.status).toBe("success");
    expect(wrapper.vm.error_message).toBe("");
    expect(wrapper.vm.errors).toEqual({});
    expect(wrapper.vm.$router.push).toBeCalledWith("/");
  });

  it("handles API error while logging weight", async () => {
    wrapper.vm.$http = jest.fn(() => Promise.reject("rejected"));
    wrapper.vm.add_weight_to_log();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalled();
    expect(wrapper.vm.status).toBe("error");
  });
});
