import Vue from "vue";
import Vuex from "vuex";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import DocumentList from "@/views/userdocument/DocumentList.vue";

describe("DocumentList.vue", () => {
  Vue.config.silent = true;

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

  const docs = [
    {
      id: "709bfc8b-7f1f-4376-a08a-d8e04cac8c29",
      created_at: "2020-02-27T10:50:13.070510Z",
      modified_at: "2020-02-27T10:50:13.070612Z",
      document: "http://localhost:8050/media/sudo",
      name: "meal plan",
      deleted: false,
      notes: "meal plan",
      kind: "MEALPLAN",
    },
    {
      id: "4cacdbf4-cf35-49db-bc6f-9b8be46eda53",
      created_at: "2020-02-27T10:53:07.699384Z",
      modified_at: "2020-02-27T10:53:07.699423Z",
      document: "http://localhost:8050/media/scc.out",
      name: "abc",
      deleted: false,
      notes: "aa",
      kind: "MEALPLAN",
    },
  ];

  const store = new Vuex.Store({
    modules: {
      auth: {
        namespace: true,
        state: { user },
      },
    },
  });

  store.dispatch = jest.fn();
  store.state.auth.user.id = "123";

  const http = jest.fn((obj) => {
    if (obj.url.endsWith("documents") && obj.method == "GET") {
      return Promise.resolve({
        data: {
          count: 2,
          next: null,
          previous: null,
          results: docs,
        },
      });
    } else if (obj.method == "GET" && obj.responseType == "blob") {
      return Promise.resolve({ data: "test-blob" });
    } else {
      return Promise.reject("rejected");
    }
  });

  let wrapper = shallowMount(DocumentList, {
    propsData: {
      fobj_user: user,
    },
    mocks: {
      $store: store,
      $route: {
        params: {
          pk: user.id,
        },
      },
      $router: {
        push: jest.fn(),
      },
      $http: http,
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.vm.documents).toEqual(docs);
    expect(wrapper.vm.pk).toMatch("123");
    expect(wrapper.vm.params).toEqual({ search: "" });
    expect(wrapper.vm.$store.dispatch).toBeCalledWith("theme/set_theme_blue");
  });

  it("gets user from store when '$route.params.pk' is not defined", () => {
    wrapper.vm.$route.params.pk = undefined;
    expect(wrapper.vm.user).toEqual(store.state.auth.user);
  });

  it("gets user from props when '$route.params.pk' is defined", () => {
    wrapper.vm.$route.params.pk = user.id;
    expect(wrapper.vm.user).toEqual(user);
  });

  it("gets user pk from store when '$route.params.pk' is not defined", () => {
    wrapper.vm.$route.params.pk = undefined;
    expect(wrapper.vm.user_pk).toMatch(store.state.auth.user.id);
  });

  it("gets user_pk from '$route.params.pk' when it is defined", () => {
    wrapper.vm.$route.params.pk = user.id;
    expect(wrapper.vm.user_pk).toMatch(user.id);
  });

  it("gets 'is_admin' value from store", () => {
    expect(wrapper.vm.is_admin).toBe(store.state.auth.user.is_staff);
  });

  it("goes to 'user-document-view' when user is admin", () => {
    wrapper.vm.goto_view_document("a1b2");
    expect(wrapper.vm.$router.push).toBeCalledWith({
      name: "user-document-view",
      params: { pk: user.id, doc_pk: "a1b2" },
    });
  });

  it("goes to 'my-document-view' when user is not admin", () => {
    wrapper.vm.$store.state.auth.user.is_staff = false;
    wrapper.vm.goto_view_document("a1b2");
    expect(wrapper.vm.$router.push).toBeCalledWith({
      name: "my-document-view",
      params: { doc_pk: "a1b2" },
    });
  });

  it("fetches documents from the API correctly", async () => {
    const url =
      process.env.VUE_APP_BASE_URL + "/api/users/" + user.id + "/documents";

    wrapper.vm.fetch_documents();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({
      url,
      params: { search: "" },
      method: "GET",
    });
    expect(wrapper.vm.error_message).toMatch("");
    expect(wrapper.vm.errors).toEqual({});
  });

  it("handles API error when fetching documents", async () => {
    const err = {
      response: { data: { errors: [{ field: "email", message: "error" }] } },
    };
    wrapper.vm.$http = jest.fn(() => Promise.reject(err));

    wrapper.vm.fetch_documents();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalled();
    expect(wrapper.vm.errors).toEqual({ email: "error" });
  });
});
