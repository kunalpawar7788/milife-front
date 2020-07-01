import Vue from "vue";
import VuePromiseBtn from "vue-promise-btn";
import { shallowMount } from "@vue/test-utils";
import AddHoliday from "@/components/holiday/AddHoliday.vue";

describe("AddHoliday.vue", () => {
  Vue.use(VuePromiseBtn);

  let wrapper = shallowMount(AddHoliday, {
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
    },
  });

  it("initializes correctly", () => {
    expect(wrapper.vm.start_date).toMatch("");
    expect(wrapper.vm.end_date).toMatch("");
    expect(wrapper.vm.description).toMatch("");
    expect(wrapper.vm.programme_end_date).toMatch("");
  });

  it("gets user primary key from the url", () => {
    expect(wrapper.vm.user_pk).toMatch("123-456");
  });

  it("gets programme primary key from the url", () => {
    expect(wrapper.vm.programme_pk).toMatch("654-321");
  });

  it("gets the correct submit url", () => {
    const url = `${process.env.VUE_APP_BASE_URL}/api/programmes/654-321/holiday`;
    expect(wrapper.vm.submit_url).toMatch(url);
  });

  it("gets correct data for submission", () => {
    wrapper.vm.start_date = "2020-01-01";
    wrapper.vm.end_date = "2020-06-01";
    wrapper.vm.description = "XYZ Holiday";
    wrapper.vm.programme_end_date = "2020-08-04";
    expect(wrapper.vm.data).toEqual({
      start: "2020-01-01",
      end: "2020-06-01",
      comment: "XYZ Holiday",
      programme_end_date: "2020-08-04",
    });
  });

  it("resets the date", () => {
    wrapper.vm.date = "2020-02-01";
    wrapper.vm.reset();
    expect(wrapper.vm.date).toMatch("");
  });

  it("adds a holiday", async () => {
    const data = {
      start: "2020-01-01",
      end: "2020-06-01",
      comment: "XYZ Holiday",
      programme_end_date: "2020-08-04",
    };
    wrapper.vm.add_holiday();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({
      url: `${process.env.VUE_APP_BASE_URL}/api/programmes/654-321/holiday`,
      method: "POST",
      data: data,
    });

    expect(wrapper.vm.date).toMatch("");
  });

});