import Vue from "vue";
import { shallowMount } from "@vue/test-utils";
import AddBankedSession from "@/components/holiday/AddBankedSession.vue";

describe("AddBankedSession.vue", () => {
  let wrapper = shallowMount(AddBankedSession, {
    mocks: {
      $route: {
        params: {
          pk: "123-456",
          programme_pk: "654-321",
        },
      },
      $store: {
        dispatch: jest.fn(),
      },
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.vm.status).toMatch("");
    expect(wrapper.vm.date).toMatch("");
  });

  it("gets user primary key from the url", () => {
    expect(wrapper.vm.user_pk).toMatch("123-456");
  });

  it("gets programme primary key from the url", () => {
    expect(wrapper.vm.programme_pk).toMatch("654-321");
  });

  it("gets the correct submit url", () => {
    const url = `${process.env.VUE_APP_BASE_URL}/api/programmes/654-321/leave-ledger`;
    expect(wrapper.vm.submit_url).toMatch(url);
  });

  it("gets correct data for submission", () => {
    wrapper.vm.date = "2020-01-01";
    expect(wrapper.vm.data).toEqual({
      date: "2020-01-01",
      kind: "C",
    });
  });

  it("resets the date", () => {
    wrapper.vm.date = "2020-02-01";
    wrapper.vm.reset();
    expect(wrapper.vm.date).toMatch("");
  });
});
