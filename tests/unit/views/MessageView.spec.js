import Vue from "vue";
import Vuex from "vuex";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import MessageView from "@/views/MessageView";
import { local } from "d3";

describe("MessageView.vue", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  Vue.use(require("vue-moment"));

  const user = {
    id: "6a7c6d31-fc4f-4dea-98f2-3db249acfa67",
    first_name: "Some",
    last_name: "One",
    email: "someone@something.com",
    is_active: true,
    is_staff: false,
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

  const msg = {
    kind: "weekly-commentry",
    content: "test-comment",
    read: false,
    deleted: false,
    created_at: "2020-05-27T11:57:39.867042Z",
    modified_at: "2020-05-27T13:41:23.796638Z",
    id: "123",
    sender: {
      id: "a4960326-b778-4673-a85b-9c355deeeca2",
      first_name: "Johnny",
      last_name: "Doe",
      email: "abc@xyz.com",
      image: null,
      gender: "",
      number: "",
    },
  };

  const store = new Vuex.Store({
    modules: {
      auth: {
        state: { user },
      },
    },
  });

  const http = jest.fn((params) => {
    if (params.method === "GET") {
      return Promise.resolve({ data: msg });
    } else if (params.method === "PATCH") {
      return Promise.resolve("resolved");
    } else {
      return Promise.reject("rejected");
    }
  });

  store.dispatch = jest.fn();

  let wrapper = shallowMount(MessageView, {
    mocks: {
      $store: store,
      $route: { params: { message_pk: "123" } },
      $http: http,
    },
  });

  it("initializes correctly", () => {
    const kind_label = {
      "checkin-commentry": "Checkin Commentary",
      "weekly-commentry": "Weekly Commentary",
      misc: "Miscellaneous",
    };

    expect(wrapper.vm.message).toEqual(msg);
    expect(wrapper.vm.status).toMatch("success");
    expect(wrapper.vm.search_keyword).toMatch("");
    expect(wrapper.vm.kind_label).toEqual(kind_label);
  });

  it("gets `is_admin` value from the store", () => {
    expect(wrapper.vm.is_admin).toBe(store.state.auth.user.is_staff);
  });

  it("gets 'user' value from the store", () => {
    expect(wrapper.vm.user).toEqual(store.state.auth.user);
  });

  it("gets 'message_pk' from the $route params", () => {
    expect(wrapper.vm.message_pk).toMatch("123");
  });

  it("gets the correct `messages_url`", () => {
    const url =
      process.env.VUE_APP_BASE_URL + "/api/users/" + user.id + "/message/123";

    expect(wrapper.vm.messages_url).toMatch(url);
  });

  it("get the correct 'reply_mailto_url' url", () => {
    const url =
      "mailto:?to=Johnny%20Doe%3Cabc%40xyz.com%3E&subject=Some%20One%20%7C%20weekly-commentry";
    expect(wrapper.vm.reply_mailto_url).toMatch(url);
  });

  it("fetches message from the api", async () => {
    const url =
      process.env.VUE_APP_BASE_URL + "/api/users/" + user.id + "/message/123";

    wrapper.vm.fetch_message();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({ url, method: "GET" });
    expect(wrapper.vm.message).toEqual(msg);
    expect(wrapper.vm.status).toMatch("success");
  });

  it("marks a message as read succesfully", async () => {
    const url =
      process.env.VUE_APP_BASE_URL + "/api/users/" + user.id + "/message/123";

    wrapper.vm.mark_read();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({
      url,
      method: "PATCH",
      data: { read: true },
    });
  });

  it("doesn't send a PATCH request to mark a message read if it is already read", async () => {
    wrapper.vm.message.read = true;

    wrapper.vm.$http.mockClear();
    wrapper.vm.mark_read();
    await Vue.nextTick();

    expect(wrapper.vm.$http).not.toBeCalled();
  });

  it("doesn't send a PATCH request to mark a message read if user is admin", async () => {
    wrapper.vm.message.read = false;
    wrapper.vm.$store.state.auth.user.is_staff = true;

    wrapper.vm.$http.mockClear();
    wrapper.vm.mark_read();
    await Vue.nextTick();

    expect(wrapper.vm.$http).not.toBeCalled();
  });

  it("returns the correct message kind label", () => {
    expect(wrapper.vm.message_kind_label("checkin-commentry")).toMatch(
      "Checkin Commentary"
    );
    expect(wrapper.vm.message_kind_label("weekly-commentry")).toMatch(
      "Weekly Commentary"
    );
    expect(wrapper.vm.message_kind_label("misc")).toMatch("Miscellaneous");
  });

  it("handles API error when fetching message", async () => {
    wrapper.vm.$http = jest.fn(() => Promise.reject("rejected"));

    wrapper.vm.fetch_message();
    await Vue.nextTick();

    expect(wrapper.vm.status).toMatch("error");
  });

  it("handles API error when marking a message read", async () => {
    wrapper.vm.mark_read();
    await Vue.nextTick();

    expect(wrapper.vm.status).toMatch("error");
  });
});
