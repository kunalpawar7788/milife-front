import { shallowMount } from "@vue/test-utils";
import ProfilePictureCropper from "@/components/ProfilePictureCropper.vue";

describe("ProfilePictureCropper.vue", () => {
  let wrapper = shallowMount(ProfilePictureCropper);

  it("initializes correctly", () => {
    expect(wrapper.vm.coordinates).toEqual({
      width: 0,
      height: 0,
      left: 0,
      top: 0,
    });
    expect(wrapper.vm.image).toBeNull();
  });

  it("updates coordinates on change correctly", () => {
    const newCoordinates = {
      width: 300,
      height: 300,
      left: 50,
      right: 50,
    };
    wrapper.vm.onChange({ coordinates: newCoordinates, canvas: null });
    expect(wrapper.vm.coordinates).toEqual(newCoordinates);
  });
});
