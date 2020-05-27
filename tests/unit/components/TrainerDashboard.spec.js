import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import TrainerDashboard from "@/components/TrainerDashboard.vue";

describe("TrainerDashboard.vue", () => {
  Vue.config.silent = true;

  const http = jest.fn((obj) => {
    if (
      obj.url.endsWith("/api/counts/email_verification_status") &&
      obj.method == "GET"
    ) {
      return Promise.resolve({ data: { waiting: 18, active: 16 } });
    } else {
      return Promise.reject("error");
    }
  });

  let wrapper = shallowMount(TrainerDashboard, {
    mocks: {
      $http: http,
      $store: {
        dispatch: jest.fn(),
      },
      $router: {
        push: jest.fn(),
      },
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.name()).toMatch("TrainerDashboard");
    expect(wrapper.vm.status_d).toEqual({ waiting: 18, active: 16 });
    expect(wrapper.vm.email).toBeNull();
    expect(wrapper.vm.errors).toEqual({});
    expect(wrapper.vm.search_param).toMatch("");
  });

  it("goes to upload csv screen", () => {
    wrapper.vm.goto_upload_csv();
    expect(wrapper.vm.$router.push).toBeCalledWith({ name: "upload-csv" });
  });

  it("goes to add user screen", () => {
    wrapper.vm.goto_add_user();
    expect(wrapper.vm.$router.push).toBeCalledWith({ name: "add-user" });
  });

  it("goes to invite user screen", () => {
    wrapper.vm.goto_invite_user();
    expect(wrapper.vm.$router.push).toBeCalledWith({
      name: "pending-invitations",
    });
  });

  it("goes to user list screen & searches for user", () => {
    wrapper.vm.search_param = "test";
    wrapper.vm.goto_search_user();
    expect(wrapper.vm.$store.dispatch).toBeCalledWith(
      "temps/set_user_search_param",
      "test"
    );
    expect(wrapper.vm.$router.push).toBeCalledWith({ name: "user-list" });
  });

  it("goes to waiting users screen", () => {
    wrapper.vm.goto_waiting_users();
    expect(wrapper.vm.$router.push).toBeCalledWith({ name: "waiting-users" });
  });

  it("goes to active users screen", () => {
    wrapper.vm.goto_active_users();
    expect(wrapper.vm.$router.push).toBeCalledWith({ name: "active-users" });
  });

  it("it gets invitation count from API succesfully", async () => {
    const url =
      process.env.VUE_APP_BASE_URL + "/api/counts/email_verification_status";

    wrapper.vm.invitation_status_count();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({
      url,
      params: wrapper.params,
      method: "GET",
    });
    expect(wrapper.vm.errors).toEqual({});
    expect(wrapper.vm.step).toBe(2);
    expect(wrapper.vm.status_d).toEqual({ waiting: 18, active: 16 });
  });

  it("handles API error while getting invitation count", async () => {
    wrapper.vm.$http = jest.fn(() => {
      return Promise.reject({
        response: {
          data: {
            errors: [
              { field: "f1", message: "err1" },
              { field: "f2", message: "err2" },
            ],
          },
        },
      });
    });

    wrapper.vm.invitation_status_count();
    await Vue.nextTick();

    expect(wrapper.vm.errors).toEqual({ f1: "err1", f2: "err2" });
  });
});
