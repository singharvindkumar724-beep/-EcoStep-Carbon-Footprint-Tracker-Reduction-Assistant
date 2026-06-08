import { vi, describe, it, expect, beforeEach } from "vitest";
import { useEcoStore } from "../useEcoStore";
import { UserProfile } from "../../types";

// Mock idb-keyval to avoid real IndexedDB operations in unit tests
vi.mock("idb-keyval", () => {
  const store = new Map();
  return {
    get: async (key: string) => store.get(key) || null,
    set: async (key: string, val: unknown) => {
      store.set(key, val);
    },
    del: async (key: string) => {
      store.delete(key);
    },
  };
});

describe("Zustand EcoStore Tests", () => {
  beforeEach(() => {
    // Reset Zustand store state before each test
    useEcoStore.setState({
      userProfile: null,
      onboardingProgress: {},
      activities: [],
      insights: [],
      streaks: {
        currentStreak: 0,
        bestStreak: 0,
        lastLoggedDate: null,
      },
      actionsState: {},
    });
  });

  it("should update onboarding progress correctly", () => {
    const store = useEcoStore.getState();
    store.setOnboardingProgress({ location: "US", householdSize: 2 });
    
    expect(useEcoStore.getState().onboardingProgress).toEqual({
      location: "US",
      householdSize: 2,
    });

    useEcoStore.getState().setOnboardingProgress({ dietType: "vegetarian" });
    expect(useEcoStore.getState().onboardingProgress).toEqual({
      location: "US",
      householdSize: 2,
      dietType: "vegetarian",
    });
  });

  it("should complete onboarding and populate user profile", () => {
    const profile: UserProfile = {
      location: "US",
      householdSize: 2,
      dietType: "vegetarian",
      vehicleType: "electric_car",
      carDistanceWeekly: 50,
      flightShortDuration: 1,
      flightLongDuration: 0,
      electricitySource: "grid_electricity",
      heatingSource: "natural_gas",
      shoppingHabits: "average",
    };

    useEcoStore.getState().completeOnboarding(profile);

    expect(useEcoStore.getState().userProfile).toEqual(profile);
    expect(useEcoStore.getState().onboardingProgress).toEqual({});
  });

  it("should log activity and calculate correct co2 emissions", () => {
    // Log a red meat meal (rate = 6.5)
    useEcoStore.getState().logActivity({
      category: "food",
      subcategory: "red_meat_meal",
      quantity: 3,
      unit: "meals",
    });

    const state = useEcoStore.getState();
    expect(state.activities.length).toBe(1);
    expect(state.activities[0].co2e).toBe(19.5); // 3 * 6.5
    expect(state.activities[0].id).toBeDefined();
    expect(state.activities[0].recordedAt).toBeDefined();

    // Check streak was initiated to 1
    expect(state.streaks.currentStreak).toBe(1);
    expect(state.streaks.bestStreak).toBe(1);
    expect(state.streaks.lastLoggedDate).toBeDefined();
  });

  it("should delete activity correctly", () => {
    useEcoStore.getState().logActivity({
      category: "food",
      subcategory: "red_meat_meal",
      quantity: 1,
      unit: "meals",
    });

    const initialId = useEcoStore.getState().activities[0].id;
    expect(useEcoStore.getState().activities.length).toBe(1);

    useEcoStore.getState().deleteActivity(initialId);
    expect(useEcoStore.getState().activities.length).toBe(0);
  });
});
