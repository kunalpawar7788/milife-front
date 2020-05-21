import Vuex from "vuex";
import Vue from "vue";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import MyDetailsView from "@/views/MyDetailsView.vue";
import { VerbosityLevel } from "pdfjs-dist";

describe("MyDetailsView.vue", () => {
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

  const http = jest.fn((obj) => {
    if (obj.url.endsWith("api/me") && obj.method === "GET") {
      return Promise.resolve({ data: user });
    } else if (obj.url.endsWith("/message") && obj.method === "GET") {
      return Promise.resolve({ data: { count: 2 } });
    }
    return Promise.reject();
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
      "theme/set_theme_blue": jest.fn(),
    },
  });

  let wrapper = shallowMount(MyDetailsView, {
    mocks: {
      $store: store,
      $http: http,
      $router: {
        push: jest.fn(),
      },
    },
  });

  it("initializes correctly on creation", () => {
    expect(wrapper.vm.profile_api_status).toMatch("success");
    expect(wrapper.vm.messages_api_status).toMatch("success");
    expect(wrapper.vm.messages_count).toBe(2);
    expect(wrapper.vm.profile.id).toMatch(user.id);
    expect(wrapper.vm.feet2cm).toBe(30.48);
    expect(wrapper.vm.inch2cm).toBe(2.54);
  });

  it("displays date in correct format", () => {
    expect(wrapper.vm.display_date(user.date_of_birth)).toMatch(
      "15th Jun 1993"
    );
  });

  it("gets feets from cms", () => {
    expect(wrapper.vm.get_feet_from_cm(user.height_cm)).toBe(5);
  });

  it("gets inches from cm", () => {
    expect(wrapper.vm.get_inches_from_cm(user.height_cm)).toBe(6.93);
  });

  it("goes to message list", () => {
    wrapper.vm.goto_message_list();
    expect(wrapper.vm.$router.push).toBeCalledWith({
      name: "message-list-view",
    });
  });

  it("goes to edit details", () => {
    wrapper.vm.goto_edit_details();
    expect(wrapper.vm.$router.push).toBeCalledWith({ name: "my-profile" });
  });

  it("goes to view docments", () => {
    wrapper.vm.goto_view_documents();
    expect(wrapper.vm.$router.push).toBeCalledWith({ name: "my-documents" });
  });

  it("goes to view programmes", () => {
    wrapper.vm.goto_view_programmes();
    expect(wrapper.vm.$router.push).toBeCalledWith({ name: "my-programmes" });
  });

  it("goes to view mealplan", () => {
    wrapper.vm.goto_view_mealplan();
    expect(wrapper.vm.$router.push).toBeCalledWith({
      name: "my-mealplan-summary",
    });
  });

  it("goes to view progress reports", () => {
    wrapper.vm.goto_view_progress_reports();
    expect(wrapper.vm.$router.push).toBeCalledWith({
      name: "self-progress-chart",
    });
  });

  it("computed property 'status' returns correct values", () => {
    expect(wrapper.vm.status).toBeTruthy();

    wrapper.vm.profile_api_status = "error";
    expect(wrapper.vm.status).toBeFalsy();

    wrapper.vm.messages_api_status = "error";
    expect(wrapper.vm.status).toBeFalsy();

    wrapper.vm.profile_api_status = "success";
    expect(wrapper.vm.status).toBeFalsy();
  });

  it("computed property 'error' returns correct values", () => {
    wrapper.vm.profile_api_status = "error";
    wrapper.vm.messages_api_status = "error";
    expect(wrapper.vm.error).toBeTruthy();

    wrapper.vm.profile_api_status = "success";
    expect(wrapper.vm.error).toBeTruthy();

    wrapper.vm.messages_api_status = "success";
    expect(wrapper.vm.error).toBeFalsy();

    wrapper.vm.profile_api_status = "error";
    expect(wrapper.vm.error).toBeTruthy();
  });

  it("gets 'is_admin' from the store", () => {
    expect(wrapper.vm.is_admin).toBeTruthy();
    wrapper.vm.$store.state.auth.user["is_staff"] = false;
    expect(wrapper.vm.is_admin).toBeFalsy();
  });

  it("gets user from the store", () => {
    expect(wrapper.vm.user.id).toMatch(store.state.auth.user.id);
  });

  it("fetches user profile correctly", async () => {
    const url = process.env.VUE_APP_BASE_URL + "/api/me";

    wrapper.vm.fetch_profile();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({ url, method: "GET" });
    expect(wrapper.vm.profile.id).toMatch(user.id);
    expect(wrapper.vm.profile_api_status).toMatch("success");
  });

  it("fetches messages correctly", async () => {
    const url =
      process.env.VUE_APP_BASE_URL + "/api/users/" + user.id + "/message";
    const params = {
      read: false,
      deleted: false,
      content_isempty: false,
    };

    wrapper.vm.fetch_messages();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({ url, params, method: "GET" });
    expect(wrapper.vm.messages_count).toBe(2);
    expect(wrapper.vm.messages_api_status).toMatch("success");
  });

  it("handles error while fetching user profile", async () => {
    wrapper.vm.$http = jest.fn(() => {
      return Promise.reject("test-error");
    });

    wrapper.vm.fetch_profile();
    await Vue.nextTick();

    expect(wrapper.vm.profile_api_status).toMatch("error");
  });

  it("handles error while fetching messages", async () => {
    wrapper.vm.$http = jest.fn(() => {
      return Promise.reject("test-error");
    });

    wrapper.vm.fetch_messages();
    await Vue.nextTick();

    expect(wrapper.vm.messages_api_status).toMatch("error");
  });
});
