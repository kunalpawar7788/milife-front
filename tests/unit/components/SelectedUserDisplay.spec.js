import { shallowMount } from "@vue/test-utils";
import SelectedUserDisplay from "@/components/SelectedUserDisplay.vue";

describe("SelectedUserDisplay.vue", () => {
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

  let wrapper = shallowMount(SelectedUserDisplay, {
    propsData: { fobj_user: user },
  });

  it("initializes correctly", () => {
    expect(wrapper.name()).toMatch("SelectedUserDisplay");
  });

  it("gets the correct user", () => {
    expect(wrapper.vm.user).toEqual(user);
  });

  it("computes user's full name correctly", () => {
    expect(wrapper.vm.full_name).toMatch(
      `${user.first_name} ${user.last_name}`
    );
  });
});
