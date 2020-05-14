import Vuex from "vuex";
import Vue from "vue";
import axios from "axios";
import { mount, createLocalVue } from "@vue/test-utils";
import AddCoachCommentComponent from "@/components/AddCoachCommentComponent.vue";

describe("AddCoachCommentComponent.vue", () => {
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
  });

  let wrapper = mount(AddCoachCommentComponent, {
    mocks: {
      $store: store,
      $route: {
        params: {
          pk: null,
        },
      },
      $http: jest.fn(),
    },
    propsData: {
      fobj_user: user,
      kind: "weekly-commentry",
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.vm.status).toMatch("initial");
    expect(wrapper.vm.message).toMatch("");
    expect(Object.keys(wrapper.vm.comments).length).toBe(0);
  });

  it("gets user from store", () => {
    expect(wrapper.vm.user.id).toMatch(user.id);
  });

  it("gets user from props if `$route.params.pk` exists", () => {
    wrapper.vm.fobj_user.id = "test-id";
    wrapper.vm.$route.params.pk = "test";
    expect(wrapper.vm.user.id).toMatch("test-id");
  });

  it("`allow_comment` gets value from the store", () => {
    expect(wrapper.vm.allow_comment).toBeTruthy();
  });

  it("updates data `message` when textarea is updated", () => {
    const textarea = wrapper.find("textarea");
    textarea.element.value = "test comment";
    textarea.trigger("input");

    expect(wrapper.vm.message).toMatch("test comment");
  });

  it("display's textarea if `allow_comment` is true", () => {
    expect(wrapper.contains("textarea")).toBeTruthy();
  });

  it("doesn't display textarea if `allow_comment` is false", async () => {
    wrapper.vm.$store.state.auth.user["is_staff"] = false;
    await Vue.nextTick();
    expect(wrapper.contains("textarea")).toBeFalsy();
  });

  it("submit comment successfully to the API", () => {
    const content = "test_comment";
    const kind = "weekly-commentry";
    const url =
      process.env.VUE_APP_BASE_URL +
      "/api/users/" +
      wrapper.vm.user.id +
      "/message";

    const data = { content, kind };

    wrapper.vm.message = content;
    wrapper.vm.kind = kind;

    wrapper.vm.submit_comment();
    expect(wrapper.vm.$http).toBeCalledWith({ data, method: "POST", url });
  });

  it("handles error from API on comment submit", async () => {
    wrapper.vm.$http = jest.fn(() => {
      return new Promise((resolve, reject) => {
        reject({ error: "test-error" });
      });
    });

    wrapper.vm.submit_comment();
    await Vue.nextTick();

    expect(wrapper.vm.status).toMatch("error");
  });
});
