import Vue from "vue";
import Vuex from "vuex";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import HeaderMenu from "@/components/HeaderMenu.vue";

describe("HeaderMenu.vue", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);

  Vue.config.silent = true;

  const store = new Vuex.Store({
    state: {
      theme: {
        theme: "blue",
      },
      auth: {
        is_staff: true,
      },
    },
    getters: {
      "auth/is_staff": jest.fn(),
    },
  });

  store.dispatch = jest.fn();

  let wrapper = shallowMount(HeaderMenu, {
    mocks: {
      $store: store,
      $router: {
        push: jest.fn(),
        go: jest.fn(),
      },
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.name()).toMatch("HeaderMenu");
    expect(wrapper.vm.sidebar_visible).toBeFalsy();
    expect(wrapper.vm.original_theme).toBeNull();
  });

  it("goes to dashboard screen", () => {
    wrapper.vm.go_to_dashboard();
    expect(wrapper.vm.$router.push).toBeCalledWith({ name: "home" });
  });

  it("goes back", () => {
    wrapper.vm.go_back();
    expect(wrapper.vm.$router.go).toBeCalledWith(-1);
  });

  it("hides menu", () => {
    const original_theme = wrapper.vm.original_theme;
    wrapper.vm.hide_menu();

    expect(wrapper.vm.$store.dispatch).toBeCalledWith("theme/set_theme", {
      original_theme,
    });
    expect(wrapper.vm.sidebar_visible).toBeFalsy();
  });

  it("toggles menu", () => {
    wrapper.vm.toggle_menu();
    expect(wrapper.vm.sidebar_visible).toBeTruthy();
    wrapper.vm.toggle_menu();
    expect(wrapper.vm.sidebar_visible).toBeFalsy();
  });

  it("gets theme from store", () => {
    expect(wrapper.vm.theme).toMatch(store.state.theme.theme);
  });

  it("gets correct sidebar menu icon", () => {
    jest.mock("@/assets/images/menu-dark-close.svg", () => {
      return "menu-dark-close";
    });
    jest.mock("@/assets/images/menu-white.svg", () => {
      return "menu-white";
    });
    jest.mock("@/assets/images/menu-dark.svg", () => {
      return "menu-dark";
    });

    wrapper.vm.sidebar_visible = true;
    expect(wrapper.vm.sidebar_menu_icon).toMatch("menu-dark-close");

    wrapper.vm.sidebar_visible = false;
    expect(wrapper.vm.sidebar_menu_icon).toMatch("menu-white");

    wrapper.vm.$store.state.theme.theme = "white";
    expect(wrapper.vm.sidebar_menu_icon).toMatch("menu-dark");
  });

  it("gets correct dashboard icon", () => {
    jest.mock("@/assets/images/dashboard-white.svg", () => {
      return "dashboard-white";
    });
    jest.mock("@/assets/images/dashboard-dark.svg", () => {
      return "dashboard-dark";
    });

    wrapper.vm.$store.state.theme.theme = "blue";
    expect(wrapper.vm.dashboard_icon).toMatch("dashboard-white");

    wrapper.vm.$store.state.theme.theme = "white";
    expect(wrapper.vm.dashboard_icon).toMatch("dashboard-dark");
  });
});
