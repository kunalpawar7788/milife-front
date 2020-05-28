import Vue from "vue";
import Vuex from "vuex";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import MessageListView from "@/views/MessageListView.vue";
import _ from "lodash";

describe("MessageListView.vue", () => {
  Vue.config.silent = true;

  Object.defineProperty(Vue.prototype, "$_", { value: _ });

  const localVue = createLocalVue();
  localVue.use(Vuex);

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

  const msgs = [
    {
      kind: "checkin-commentry",
      content: "",
      read: false,
      deleted: true,
      created_at: "2020-02-27T17:17:51.766508Z",
      modified_at: "2020-02-27T17:17:51.766536Z",
      id: "366521f7-8e74-478b-9fb5-000c5cb7a848",
      sender: {
        id: "265bfe36-34bc-4782-9148-0c7525e2fef7",
        first_name: "Daryl",
        last_name: "Barrett",
        email: "daryl.barrett@example.com",
        image: null,
        gender: "M",
        number: "56726",
      },
    },
    {
      kind: "checkin-commentry",
      content: "abcd",
      read: true,
      deleted: false,
      created_at: "2020-03-02T11:14:37.253284Z",
      modified_at: "2020-03-02T11:14:37.253315Z",
      id: "a95ceef9-b526-4a63-95a8-cf2855882767",
      sender: {
        id: "265bfe36-34bc-4782-9148-0c7525e2fef7",
        first_name: "Daryl",
        last_name: "Barrett",
        email: "daryl.barrett@example.com",
        image: null,
        gender: "M",
        number: "56726",
      },
    },
  ];

  const http = jest.fn((obj) => {
    if (obj.url.endsWith("/message") && obj.method == "GET") {
      return Promise.resolve({
        data: {
          count: 2,
          next: null,
          previous: null,
          results: msgs,
        },
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
  });

  store.dispatch = jest.fn();

  let wrapper = shallowMount(MessageListView, {
    mocks: {
      $store: store,
      $router: {
        push: jest.fn(),
      },
      $http: http,
    },
  });

  it("initializes correctly", () => {
    const kind_label = {
      "checkin-commentry": "Checkin Commentary",
      "weekly-commentry": "Weekly Commentary",
      misc: "Miscellaneous",
    };

    expect(wrapper.vm.messages).toEqual(msgs);
    expect(wrapper.vm.status).toMatch("success");
    expect(wrapper.vm.search_keyword).toMatch("");
    expect(wrapper.vm.kind_label).toEqual(kind_label);
  });

  it("gets 'is_admin' value from the store", () => {
    expect(wrapper.vm.is_admin).toEqual(store.state.auth.user.is_staff);
  });

  it("gets 'user' from the store", () => {
    expect(wrapper.vm.user).toEqual(store.state.auth.user);
  });

  it("gets the correct 'messages_url'", () => {
    const url =
      process.env.VUE_APP_BASE_URL + "/api/users/" + user.id + "/message";

    expect(wrapper.vm.messages_url).toMatch(url);
  });

  it("filters out empty messages", () => {
    expect(wrapper.vm.display_messages.length).toBe(1);
  });

  it("returns correct message kind label", () => {
    expect(wrapper.vm.message_kind_label("checkin-commentry")).toMatch(
      "Checkin Commentary"
    );
    expect(wrapper.vm.message_kind_label("weekly-commentry")).toMatch(
      "Weekly Commentary"
    );
    expect(wrapper.vm.message_kind_label("misc")).toMatch("Miscellaneous");
  });

  it("goes to view message screen", () => {
    wrapper.vm.goto_view_message(123);
    expect(wrapper.vm.$router.push).toBeCalledWith({
      name: "message-view",
      params: { pk: user.id, message_pk: 123 },
    });
  });

  it("fetches messages from the API correctly", async () => {
    const url =
      process.env.VUE_APP_BASE_URL + "/api/users/" + user.id + "/message";
    wrapper.vm.fetch_messages;
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({
      url,
      params: { search: "" },
      method: "GET",
    });
    expect(wrapper.vm.messages).toEqual(msgs);
    expect(wrapper.vm.status).toMatch("success");
  });

  it("handles API error while fetching messages", async () => {
    wrapper.vm.$http = jest.fn(() => Promise.reject("rejected"));

    wrapper.vm.fetch_messages();
    await Vue.nextTick();

    expect(wrapper.vm.status).toMatch("error");
  });
});
