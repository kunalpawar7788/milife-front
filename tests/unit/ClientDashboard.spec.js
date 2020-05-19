import Vuex from "vuex";
import Vue from "vue";
import { shallowMount, createLocalVue } from "@vue/test-utils";
import ClientDashboard from "@/components/ClientDashboard.vue";

describe("ClientDashboard.vue", () => {
  const localVue = createLocalVue();
  localVue.use(Vuex);
  Vue.use(require("vue-moment"));

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

  const dashboardData = {
    weight_log: [
      {
        id: "7411220c-a10d-48aa-95c9-0d7eee873ef5",
        weight: 83.0,
        measured_on: "2020-05-17",
      },
      {
        id: "71296f53-4590-4162-a5fe-e1961da233cd",
        weight: 82.0,
        measured_on: "2020-05-15",
      },
    ],
    target_weight: [
      {
        id: "e5cbf5b3-0726-4f36-ab0f-7f24e64b9d38",
        target_date: "2020-01-10",
        target_weight: 75.0,
      },
      {
        id: "7a579246-6cd2-4ed5-8534-479262ef8bee",
        target_date: "2020-02-10",
        target_weight: 70.0,
      },
    ],
    calorie: 2500,
    messages_count: 2,
    progress_report: [
      {
        body_fat: 0.0,
        muscle_mass: 0.0,
        date_of_checkin: "2020-05-06",
        percentage_body_fat: 0,
        percentage_muscle_mass: 0,
        month: "May 20",
      },
      {
        body_fat: 0.0,
        muscle_mass: 0.0,
        date_of_checkin: "2020-03-31",
        percentage_body_fat: 0,
        percentage_muscle_mass: 0,
        month: "Mar 20",
      },
    ],
    programme: {
      id: "4da0dd02-3b34-4c8b-b4bd-fd4982cc13e1",
      sessions: {
        Friday: "{'HH': '07', 'mm': '00'}",
        Monday: "{'HH': '17', 'mm': '00'}",
        Sunday: "{'HH': '', 'mm': ''}",
        Tuesday: "{'HH': '17', 'mm': '00'}",
        Saturday: "{'HH': '', 'mm': ''}",
        Thursday: "{'HH': '', 'mm': ''}",
        Wednesday: "{'HH': '17', 'mm': '00'}",
      },
      created_at: "2020-03-02T11:10:43.102341Z",
      modified_at: "2020-03-02T11:11:22.010441Z",
      name: "Core Excersises",
      start_date: "2020-02-01",
      end_date: "2020-04-30",
      active: true,
      user: "6a7c6d31-fc4f-4dea-98f2-3db249acfa67",
      coach: "a4960326-b778-4673-a85b-9c355deeeca2",
    },
    first_checkin: {
      id: "bf4088b7-7eff-4107-8904-8e7351b9702b",
      created_at: "2020-03-04T09:30:56.371705Z",
      modified_at: "2020-05-06T12:24:13.217220Z",
      accuniq_id: "SOME ONE************",
      date_of_checkin: "2017-11-14",
      photo_front_profile:
        "http://localhost:8050/media/checkin_images/frontprofile_8fqzJ8y.png",
      photo_side_profile:
        "http://localhost:8050/media/checkin_images/sideprofile_4pS0aC6.png",
      waist: "0.00",
      hips: "0.00",
      chest: "0.00",
      shoulders: "0.00",
      left_arm: "0.00",
      right_arm: "0.00",
      left_leg: "0.00",
      right_leg: "0.00",
      systolic_blood_pressure: 0,
      diastolic_blood_pressure: 0,
      blood_sugar: "0.00",
      vo2_max: 0,
      resting_heart_rate: 0,
      deleted: false,
      comment: "465c2f1a-2e46-4dc5-b011-f1472f8c93e8",
    },
  };

  const store = new Vuex.Store({
    modules: {
      auth: {
        state: { user },
      },
    },
  });

  let wrapper = shallowMount(ClientDashboard, {
    mocks: {
      $store: store,
      $http: jest.fn(() => {
        return new Promise((res, rej) => res({ data: dashboardData }));
      }),
      $router: {
        push: jest.fn(),
      },
    },
  });

  it("fetches data correctly", async () => {
    wrapper.vm.fetch_dashboard_data();
    await Vue.nextTick();

    const url = process.env.VUE_APP_BASE_URL + "/api/dashboard/" + user.id;

    expect(wrapper.vm.$http).toBeCalledWith({ url, method: "GET" });
    expect(wrapper.vm.status).toMatch("ready");
    expect(Object.keys(wrapper.vm.data).length).toBe(
      Object.keys(dashboardData).length
    );
  });

  it("computed property 'user' returns value from store", () => {
    expect(wrapper.vm.user.id).toBe(user.id);
  });

  it("computed property 'pr' returns progress data", () => {
    expect(wrapper.vm.pr.length).toBe(dashboardData.progress_report.length);
  });

  it("goes to message list screen", () => {
    wrapper.vm.goto_message_list();
    expect(wrapper.vm.$router.push).toBeCalledWith({
      name: "message-list-view",
    });
  });

  it("goes to log weight screen", () => {
    wrapper.vm.goto_log_weight();
    expect(wrapper.vm.$router.push).toBeCalledWith({
      name: "log-weight-view-self",
    });
  });

  it("goes to view meal breakdown screen", () => {
    wrapper.vm.goto_view_meal_breakdown();
    expect(wrapper.vm.$router.push).toBeCalledWith({
      name: "my-mealplan-summary",
    });
  });

  it("goes to detailed report screen", () => {
    wrapper.vm.goto_detailed_report();
    expect(wrapper.vm.$router.push).toBeCalledWith({
      name: "self-progress-chart",
    });
  });

  it("handles error while fetching dashboard data", async () => {
    wrapper.vm.$http = jest.fn(() => {
      return new Promise((res, rej) => {
        rej("error");
      });
    });

    wrapper.vm.fetch_dashboard_data();
    await Vue.nextTick();

    expect(wrapper.vm.status).toMatch("error");
  });
});
