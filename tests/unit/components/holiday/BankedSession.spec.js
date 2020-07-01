import Vuex from "vuex";
import Vue from "vue";
import VuePromiseBtn from "vue-promise-btn";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import BankedSession from "@/components/holiday/BankedSession.vue";

describe("BankedSession.vue", () => {
  Vue.use(VuePromiseBtn);

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
    },
    getters: {
      "auth/is_staff": (state) => state.auth.user["is_staff"],
    },
    actions: {
      "theme/set_theme_white": jest.fn(),
    },
  });

  let wrapper = shallowMount(BankedSession, {
    mocks: {
      $http: jest.fn(() => Promise.resolve("resolved")),
      $route: {
        params: {
          pk: "123-456",
          programme_pk: "654-321",
        },
      },
      $store: store,
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.vm.status).toMatch("");
    expect(wrapper.vm.balance).toEqual(0);
  });

  it("gets user primary key from the url", () => {
    expect(wrapper.vm.user_pk).toMatch("123-456");
  });

  it("gets programme primary key from the url", () => {
    expect(wrapper.vm.programme_pk).toMatch("654-321");
  });

  it("gets 'is_admin' from the store", () => {
    expect(wrapper.vm.is_admin).toBeTruthy();
    wrapper.vm.$store.state.auth.user["is_staff"] = false;
    expect(wrapper.vm.is_admin).toBeFalsy();
  });

  it("gets the correct url", () => {
    const url = `${process.env.VUE_APP_BASE_URL}/api/programmes/654-321/leave-ledger`;
    expect(wrapper.vm.url).toMatch(url);
  });

  it("fetches balance", async () => {
    wrapper.vm.fetch_balance();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({
      url: `${process.env.VUE_APP_BASE_URL}/api/programmes/654-321/leave-ledger`,
      method: "GET",
    });

    expect(wrapper.vm.balance).toEqual(0);
  });

});