import Vue from "vue";
import VuePromiseBtn from "vue-promise-btn";
import { shallowMount } from "@vue/test-utils";
import ListHoliday from "@/components/holiday/ListHolidays.vue";

describe("ListHolidays.vue", () => {
  Vue.use(VuePromiseBtn);

  const holidays_list = [
    {
      comment: "Weekly off",
      created_at: "2020-06-04T18:50:25.654659Z",
      end: "2020-06-10",
      id: "9c6d8a19-4221-484e-8a19-1e3b8be7312a",
      modified_at: "2020-06-04T18:50:25.654681Z",
      programme_end_date: "2020-08-05",
      start: "2020-06-10",
    },
    {
      comment: "Public holiday",
      created_at: "2020-06-04T18:50:42.882786Z",
      end: "2020-06-10",
      id: "f5218dd5-f297-4004-b966-8689e9dfc3ea",
      modified_at: "2020-06-04T18:50:42.882807Z",
      programme_end_date: "2020-10-10",
      start: "2020-06-10",
    },
  ];

  const http = jest.fn((obj) => {
    if (obj.url.endsWith("/holiday") && obj.method == "GET") {
      return Promise.resolve({
        data: {
          count: 2,
          next: null,
          previous: null,
          results: holidays_list,
        },
      });
    } else {
      return Promise.reject("rejected");
    }
  });

  let wrapper = shallowMount(ListHoliday, {
    mocks: {
      $http: jest.fn(() => Promise.resolve("resolved")),
      $route: {
        params: {
          pk: "123-456",
          programme_pk: "654-321",
        },
      },
      $store: {
        dispatch: jest.fn(),
      },
      $http: http,
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.vm.status).toMatch("");
    expect(wrapper.vm.holidays).toEqual(holidays_list);
  });

  it("gets user primary key from the url", () => {
    expect(wrapper.vm.user_pk).toMatch("123-456");
  });

  it("gets programme primary key from the url", () => {
    expect(wrapper.vm.programme_pk).toMatch("654-321");
  });

  it("gets the correct url", () => {
    const url = `${process.env.VUE_APP_BASE_URL}/api/users/123-456/programmes/654-321/holiday`;
    expect(wrapper.vm.url).toMatch(url);
  });

  it("fetches holidays", async () => {
    wrapper.vm.fetch_holidays();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({
      url: `${process.env.VUE_APP_BASE_URL}/api/users/123-456/programmes/654-321/holiday`,
      params: {},
      method: "GET",
    });

    expect(wrapper.vm.status).toEqual("success");
    expect(wrapper.vm.error_message).toMatch("");
    expect(wrapper.vm.errors).toEqual({});
    expect(wrapper.vm.holidays).toEqual(holidays_list);
    
  });

  it("handles API error while fetching messages", async () => {
    wrapper.vm.$http = jest.fn(() => Promise.reject("rejected"));

    wrapper.vm.fetch_holidays();
    await Vue.nextTick();

    expect(wrapper.vm.status).toMatch("error");
  });

});