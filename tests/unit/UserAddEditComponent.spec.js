import Vue from "vue";
import VuePromiseBtn from "vue-promise-btn";
import { shallowMount } from "@vue/test-utils";
import UserAddEditComponent from "@/components/UserAddEditComponent.vue";

describe("UserAddEditComponent.vue", () => {
  Vue.use(VuePromiseBtn);

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

  // Wrapper without fobj_user prop
  let wrapper = shallowMount(UserAddEditComponent, {
    mocks: {
      $http: jest.fn(() => Promise.resolve("resolved")),
      $router: {
        push: jest.fn(),
      },
    },
    propsData: {
      fobj_user: {},
    },
  });

  // Wrapper with fobj_user prop
  let wrapper2 = shallowMount(UserAddEditComponent, {
    mocks: {
      $http: jest.fn(() => Promise.resolve("resolved")),
      $router: {
        push: jest.fn(),
      },
    },
    propsData: {
      fobj_user: user,
    },
  });

  it("initializes correctly with empty fobj_user prop", () => {
    expect(wrapper.name()).toMatch("UserAddEditComponent");
    expect(wrapper.vm.data.image).toMatch("");
    expect(wrapper.vm.data.is_staff).toMatch("");
    expect(wrapper.vm.data.is_active).toMatch("true");
    expect(wrapper.vm.data.accuniq_id).toMatch("");
    expect(wrapper.vm.data.email).toMatch("");
    expect(wrapper.vm.data.first_name).toMatch("");
    expect(wrapper.vm.data.last_name).toMatch("");
    expect(wrapper.vm.data.number).toMatch("");
    expect(wrapper.vm.data.date_of_birth).toMatch("");
    expect(wrapper.vm.data.height_cm).toMatch("");
    expect(wrapper.vm.data.height_unit).toMatch("");
    expect(wrapper.vm.data.weight_kg).toMatch("");
    expect(wrapper.vm.data.weight_unit).toMatch("");
    expect(Object.keys(wrapper.vm.errors).length).toBe(0);
    expect(wrapper.vm.error_message).toMatch("");
    expect(wrapper.vm.gender_options).toEqual([
      { label: "Male", value: "M" },
      { label: "Female", value: "F" },
      { label: "Would rather not say", value: "N" },
    ]);
    expect(wrapper.vm.cropping).toBeFalsy();
  });

  it("computed property 'user' return empty user object", () => {
    expect(wrapper.vm.user).toEqual({});
  });

  it("computed property 'upsert_method' returns 'POST' when adding a user", () => {
    expect(wrapper.vm.upsert_method).toMatch("POST");
  });

  it("computed property 'upsert_url' returns correct url when adding a user", () => {
    const url = process.env.VUE_APP_BASE_URL + "/api/users";
    expect(wrapper.vm.upsert_url).toMatch(url);
  });

  it("computed property 'gender_options_d' returns correct value when adding a user", () => {
    const options = {
      M: wrapper.vm.gender_options[0],
      F: wrapper.vm.gender_options[1],
      N: wrapper.vm.gender_options[2],
    };
    expect(wrapper.vm.gender_options_d).toEqual(options);
  });

  it("gets & sets 'gender' values correctly", () => {
    wrapper.vm.gender = { label: "Male", value: "M" };
    expect(wrapper.vm.gender).toEqual({ label: "Male", value: "M" });

    wrapper.vm.gender = { label: "Female", value: "F" };
    expect(wrapper.vm.gender).toEqual({ label: "Female", value: "F" });

    wrapper.vm.gender = { label: "Would rather not say", value: "N" };
    expect(wrapper.vm.gender).toEqual({
      label: "Would rather not say",
      value: "N",
    });
  });

  it("gets & sets 'date_of_birth' values correctly", () => {
    wrapper.vm.date_of_birth = "2020-05-01";
    expect(wrapper.vm.date_of_birth).toMatch("2020-05-01");
  });

  it("gets & sets 'height' values correctly", () => {
    wrapper.vm.height = { magnitude_si: 170, preferred_unit: "metric" };
    expect(wrapper.vm.height).toEqual({
      magnitude_si: 170,
      preferred_unit: "metric",
    });

    wrapper.vm.height = { magnitude_si: 170, preferred_unit: "imperial" };
    expect(wrapper.vm.height).toEqual({
      magnitude_si: 170,
      preferred_unit: "imperial",
    });
  });

  it("gets & sets 'weight' values correctly", () => {
    wrapper.vm.weight = { magnitude_si: 70, preferred_unit: "metric" };
    expect(wrapper.vm.weight).toEqual({
      magnitude_si: 70,
      preferred_unit: "metric",
    });

    wrapper.vm.height = { magnitude_si: 70, preferred_unit: "imperial" };
    expect(wrapper.vm.height).toEqual({
      magnitude_si: 70,
      preferred_unit: "imperial",
    });
  });

  it("gets & sets 'image' values correctly", () => {
    wrapper.vm.image = "test-image";
    expect(wrapper.vm.image).toMatch("test-image");
  });

  it("gets & sets 'is_staff' values correctly", () => {
    wrapper.vm.is_staff = true;
    expect(wrapper.vm.is_staff).toBeTruthy();
    wrapper.vm.is_staff = false;
    expect(wrapper.vm.is_staff).toBeFalsy();
  });

  it("gets & sets 'is_active' values correctly", () => {
    wrapper.vm.is_active = true;
    expect(wrapper.vm.is_active).toBeTruthy();
    wrapper.vm.is_active = false;
    expect(wrapper.vm.is_active).toBeFalsy();
  });

  it("gets & sets 'accuniq_id' values correctly", () => {
    wrapper.vm.accuniq_id = "test-accuniq_id";
    expect(wrapper.vm.accuniq_id).toMatch("test-accuniq_id");
  });

  it("gets & sets 'email' values correctly", () => {
    wrapper.vm.email = "test-email";
    expect(wrapper.vm.email).toMatch("test-email");
  });

  it("gets & sets 'first_name' values correctly", () => {
    wrapper.vm.first_name = "test-first_name";
    expect(wrapper.vm.first_name).toMatch("test-first_name");
  });

  it("gets & sets 'last_name' values correctly", () => {
    wrapper.vm.last_name = "test-last_name";
    expect(wrapper.vm.last_name).toMatch("test-last_name");
  });

  it("gets & sets 'number' values correctly", () => {
    wrapper.vm.number = "test-number";
    expect(wrapper.vm.number).toMatch("test-number");
  });

  it("'upsert_user' sends a POST request to add a user correctly", async () => {
    let formData = new FormData();
    for (var key in wrapper.vm.data) {
      if (key == "image") {
        continue;
      }
      if (wrapper.vm.data[key]) {
        formData.append(key, wrapper.vm.data[key]);
      }
    }
    if (wrapper.vm.data.image && typeof wrapper.vm.data.image != "string") {
      formData.append("image", wrapper.vm.data.image, "something.png");
    }

    wrapper.vm.upsert_user();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalledWith({
      url: process.env.VUE_APP_BASE_URL + "/api/users",
      data: formData,
      method: "POST",
    });
    expect(wrapper.vm.status).toMatch("success");
    expect(wrapper.vm.error_message).toMatch("");
    expect(wrapper.vm.errors).toEqual({});
    expect(wrapper.vm.$router.push).toBeCalledWith({ name: "user-list" });
  });

  it("handles API error when 'upsert_user' sends a POST request to add user", async () => {
    const err = {
      response: { data: { errors: [{ field: "email", message: "error" }] } },
    };
    wrapper.vm.$http = jest.fn(() => Promise.reject(err));

    wrapper.vm.upsert_user();
    await Vue.nextTick();

    expect(wrapper.vm.$http).toBeCalled();
    expect(wrapper.vm.status).toMatch("error");
    expect(wrapper.vm.errors).toEqual(err.response.data.errors);
    expect(wrapper.vm.error_message).toEqual(
      err.response.data.errors[0].field +
        " : " +
        err.response.data.errors[0].message
    );
  });

  it("initializes correctly with fobj_user prop", () => {
    expect(wrapper2.name()).toMatch("UserAddEditComponent");
    expect(wrapper2.vm.data).toEqual(user);
    expect(Object.keys(wrapper2.vm.errors).length).toBe(0);
    expect(wrapper2.vm.error_message).toMatch("");
    expect(wrapper2.vm.gender_options).toEqual([
      { label: "Male", value: "M" },
      { label: "Female", value: "F" },
      { label: "Would rather not say", value: "N" },
    ]);
    expect(wrapper2.vm.cropping).toBeFalsy();
  });

  it("computed property 'user' returns fobj_user object", () => {
    expect(wrapper2.vm.user).toEqual(user);
  });

  it("computed property 'upsert_method' returns 'PATCH' when editing a user", () => {
    expect(wrapper2.vm.upsert_method).toMatch("PATCH");
  });

  it("computed property 'upsert_url' returns correct url when editing a user", () => {
    const url = process.env.VUE_APP_BASE_URL + "/api/users/" + user.id;
    expect(wrapper2.vm.upsert_url).toMatch(url);
  });

  it("computed property 'gender_options_d' returns correct value when editing a user", () => {
    const options = {
      M: wrapper2.vm.gender_options[0],
      F: wrapper2.vm.gender_options[1],
      N: wrapper2.vm.gender_options[2],
    };
    expect(wrapper2.vm.gender_options_d).toEqual(options);
  });

  it("gets 'gender' value correctly when props given", () => {
    expect(wrapper2.vm.gender.value).toEqual(user.gender);
  });

  it("gets 'date_of_birth' values correctly when props given", () => {
    expect(wrapper2.vm.date_of_birth).toMatch(user.date_of_birth);
  });

  it("gets 'height' values correctly when props given", () => {
    expect(wrapper2.vm.height).toEqual({
      magnitude_si: user.height_cm,
      preferred_unit: user.height_unit,
    });
  });

  it("gets 'weight' values correctly when props given", () => {
    expect(wrapper2.vm.weight).toEqual({
      magnitude_si: user.weight_kg,
      preferred_unit: user.weight_unit,
    });
  });

  it("gets 'image' values correctly when props given", () => {
    expect(wrapper2.vm.image).toBeNull();
  });

  it("gets 'is_staff' values correctly when props given", () => {
    expect(wrapper2.vm.is_staff).toBe(user.is_staff);
  });

  it("gets & sets 'is_active' values correctly when props given", () => {
    expect(wrapper2.vm.is_active).toBe(user.is_active);
  });

  it("gets 'accuniq_id' values correctly when props given", () => {
    expect(wrapper2.vm.accuniq_id).toBeUndefined();
  });

  it("gets 'email' values correctly when props given", () => {
    expect(wrapper2.vm.email).toMatch(user.email);
  });

  it("gets 'first_name' values correctly when props given", () => {
    expect(wrapper2.vm.first_name).toMatch(user.first_name);
  });

  it("gets 'last_name' values correctly when props given", () => {
    expect(wrapper2.vm.last_name).toMatch(user.last_name);
  });

  it("gets 'number' values correctly when props given", () => {
    expect(wrapper2.vm.number).toMatch(user.number);
  });

  it("'upsert_user' sends a PATCH request to edit a user correctly", async () => {
    let formData = new FormData();
    for (var key in wrapper2.vm.data) {
      if (key == "image") {
        continue;
      }
      if (wrapper2.vm.data[key]) {
        formData.append(key, wrapper2.vm.data[key]);
      }
    }
    if (wrapper2.vm.data.image && typeof wrapper2.vm.data.image != "string") {
      formData.append("image", wrapper2.vm.data.image, "something.png");
    }

    wrapper2.vm.upsert_user();
    await Vue.nextTick();

    expect(wrapper2.vm.$http).toBeCalledWith({
      url: process.env.VUE_APP_BASE_URL + "/api/users/" + user.id,
      data: formData,
      method: "PATCH",
    });
    expect(wrapper2.vm.status).toMatch("success");
    expect(wrapper2.vm.error_message).toMatch("");
    expect(wrapper2.vm.errors).toEqual({});
    expect(wrapper2.vm.$router.push).toBeCalledWith({ name: "user-list" });
  });
});
