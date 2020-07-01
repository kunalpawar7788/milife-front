import Vuex from "vuex";
import Vue from "vue";
import VuePromiseBtn from "vue-promise-btn";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import Holiday from "@/components/holiday/Holiday.vue";

describe("Holiday.vue", () => {
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

  const holiday_response = {
    active: true,
    coach: "a4960326-b778-4673-a85b-9c355deeeca2",
    created_at: "2020-06-04T17:27:36.197794Z",
    end_date: "2020-06-11",
    id: "61826a3a-c70c-4aa7-b6fc-f886f3dc438c",
    modified_at: "2020-06-24T08:05:06.848697Z",
    name: "Weight Loss",
    sessions: {
      Monday: "{'HH': '', 'mm': ''}",
      Tuesday: "{'HH': '04', 'mm': '45'}",
      Wednesday: "{'HH': '', 'mm': ''}",
      Thursday: "{'HH': '06', 'mm': '15'}",
      Friday: "{'HH': '04', 'mm': '45'}",
      Saturday: "{'HH': '08', 'mm': '30'}",
      Sunday: "{'HH': '', 'mm': ''}",
    },
    start_date: "2020-02-02",
    user: "6a7c6d31-fc4f-4dea-98f2-3db249acfa67",
  }

  const http = jest.fn((obj) => {
    if (obj.method == "GET") {
      return Promise.resolve({
        data: holiday_response,
      });
    } else {
      return Promise.reject("rejected");
    }
  });

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

  store.dispatch = jest.fn();

  let wrapper = shallowMount(Holiday, {
    mocks: {
      $http: http,
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
    expect(wrapper.vm.error_message).toMatch("");
    expect(Object.keys(wrapper.vm.errors).length).toBe(0);
    expect(wrapper.vm.sessions).toEqual({
      Monday: {'HH': '', 'mm': ''},
      Tuesday: {'HH': '04', 'mm': '45'},
      Wednesday: {'HH': '', 'mm': ''},
      Thursday: {'HH': '06', 'mm': '15'},
      Friday: {'HH': '04', 'mm': '45'},
      Saturday: {'HH': '08', 'mm': '30'},
      Sunday: {'HH': '', 'mm': ''},
    });
    expect(wrapper.vm.selected).toMatch("add-holiday");
    expect(wrapper.vm.programme).toEqual(holiday_response);
  });

  it("gets user primary key from the url", () => {
    expect(wrapper.vm.user_pk).toMatch("123-456");
  });

  it("gets 'is_admin' from the store", () => {
    expect(wrapper.vm.is_admin).toBeTruthy();
    wrapper.vm.$store.state.auth.user["is_staff"] = false;
    expect(wrapper.vm.is_admin).toBeFalsy();
  });

  it("gets session days", () => {
    expect(wrapper.vm.session_days).toEqual([
        "Tuesday", "Thursday", "Friday", "Saturday"
    ])
  });

  it("fetches programme", async () => {
    wrapper.vm.fetch_programme();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({
      url: `${process.env.VUE_APP_BASE_URL}/api/users/123-456/programmes/654-321`,
      params: {},
      method: "GET",
    });

    expect(wrapper.vm.status).toMatch("success");
    expect(wrapper.vm.error_message).toMatch("");
    expect(wrapper.vm.errors).toEqual({});
    expect(wrapper.vm.programme).toEqual(holiday_response);
  });

  it("fills empty sessions data when fetching programme", async () => {
    holiday_response.sessions = {
      Tuesday: {'HH': '04', 'mm': '45'},
      Thursday: {'HH': '06', 'mm': '15'},
      Friday: {'HH': '04', 'mm': '45'},
      Saturday: {'HH': '08', 'mm': '30'},
    }
    wrapper.vm.fetch_programme();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({
      url: `${process.env.VUE_APP_BASE_URL}/api/users/123-456/programmes/654-321`,
      params: {},
      method: "GET",
    });

    expect(wrapper.vm.sessions).toEqual({
      Monday: {'HH': '', 'mm': ''},
      Tuesday: {'HH': '04', 'mm': '45'},
      Wednesday: {'HH': '', 'mm': ''},
      Thursday: {'HH': '06', 'mm': '15'},
      Friday: {'HH': '04', 'mm': '45'},
      Saturday: {'HH': '08', 'mm': '30'},
      Sunday: {'HH': '', 'mm': ''},
    });
  });

  it("handles API error while fetching messages", async () => {
    wrapper.vm.$http = jest.fn(() => Promise.reject("rejected"));

    wrapper.vm.fetch_programme();
    await Vue.nextTick();

    expect(wrapper.vm.status).toMatch("error");
  });

});