import { vi, describe, it, expect, beforeEach } from "vitest";
import { useEcoStore } from "../useEcoStore";
import { UserProfile, Recommendation } from "../../types";

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

// Mock fetch for fetchInsights test
global.fetch = vi.fn();

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
      goals: [],
    });
    vi.resetAllMocks();
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

  it("should clear all activities", () => {
    useEcoStore.getState().logActivity({ category: "food", subcategory: "red_meat_meal", quantity: 1, unit: "meals" });
    expect(useEcoStore.getState().activities.length).toBe(1);
    useEcoStore.getState().clearActivities();
    expect(useEcoStore.getState().activities.length).toBe(0);
  });

  it("should reset onboarding properly", () => {
    useEcoStore.getState().setOnboardingProgress({ location: "US" });
    useEcoStore.getState().resetOnboarding();
    expect(useEcoStore.getState().onboardingProgress).toEqual({});
    expect(useEcoStore.getState().userProfile).toBeNull();
  });

  it("should set and fetch insights", async () => {
    const mockInsight: Recommendation = {
      id: "1", title: "Test Insight", description: "Desc", category: "energy",
      co2Savings: 100, difficulty: "easy", costImpact: "saving", reasoning: "Because", implementationSteps: []
    };

    useEcoStore.getState().setInsights([mockInsight]);
    expect(useEcoStore.getState().insights.length).toBe(1);

    // Mock fetch insights
    (global.fetch as any).mockResolvedValueOnce({
      json: async () => ({ recommendations: [mockInsight] })
    });

    // Profile needs to exist to fetch
    useEcoStore.setState({ userProfile: { location: "US", householdSize: 1, dietType: "vegan", vehicleType: "bike_walk", carDistanceWeekly: 0, flightShortDuration: 0, flightLongDuration: 0, electricitySource: "mixed", heatingSource: "electric_heating", shoppingHabits: "minimal" } });
    
    await useEcoStore.getState().fetchInsights();
    expect(useEcoStore.getState().insights.length).toBe(1);
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });

  it("should handle failed fetchInsights", async () => {
    // Return early if no profile
    await useEcoStore.getState().fetchInsights();
    expect(useEcoStore.getState().insightsLoading).toBe(false);

    useEcoStore.setState({ userProfile: { location: "US", householdSize: 1, dietType: "vegan", vehicleType: "bike_walk", carDistanceWeekly: 0, flightShortDuration: 0, flightLongDuration: 0, electricitySource: "mixed", heatingSource: "electric_heating", shoppingHabits: "minimal" } });

    // Mock failure
    (global.fetch as any).mockRejectedValueOnce(new Error("Network Error"));
    await useEcoStore.getState().fetchInsights();
    expect(useEcoStore.getState().insightsLoading).toBe(false);
    expect(useEcoStore.getState().insightsError).toBeNull();
  });

  it("should toggle action state", () => {
    useEcoStore.getState().toggleAction("action-1", "started");
    expect(useEcoStore.getState().actionsState["action-1"]).toBe("started");

    useEcoStore.getState().toggleAction("action-1", "completed");
    expect(useEcoStore.getState().actionsState["action-1"]).toBe("completed");

    useEcoStore.getState().toggleAction("action-1", "available");
    expect(useEcoStore.getState().actionsState["action-1"]).toBeUndefined();
  });

  it("should add, update, and complete goals", () => {
    useEcoStore.getState().addGoal({
      title: "Test Goal",
      targetCo2e: 500,
      startDate: "2026-01-01",
      endDate: "2026-12-31"
    });

    const goals = useEcoStore.getState().goals;
    expect(goals.length).toBe(1);
    const goalId = goals[0].id;
    expect(goals[0].status).toBe("active");
    expect(goals[0].currentCo2e).toBe(0);

    useEcoStore.getState().updateGoalProgress(goalId, 250);
    expect(useEcoStore.getState().goals[0].currentCo2e).toBe(250);

    useEcoStore.getState().completeGoal(goalId);
    expect(useEcoStore.getState().goals[0].status).toBe("completed");
  });

  it("should test streak update logic (same day, next day, miss)", () => {
    // Initial log
    useEcoStore.getState().logActivity({ category: "food", subcategory: "vegan_meal", quantity: 1, unit: "meals" });
    const today = useEcoStore.getState().streaks.lastLoggedDate;
    expect(useEcoStore.getState().streaks.currentStreak).toBe(1);

    // Same day log should maintain streak
    useEcoStore.getState().updateStreaks();
    expect(useEcoStore.getState().streaks.currentStreak).toBe(1);

    // Mock yesterday's date
    const date = new Date();
    date.setDate(date.getDate() - 1);
    const yesterdayStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    useEcoStore.setState({ streaks: { currentStreak: 1, bestStreak: 1, lastLoggedDate: yesterdayStr } });

    // Next day log should increment streak
    useEcoStore.getState().updateStreaks();
    expect(useEcoStore.getState().streaks.currentStreak).toBe(2);
    expect(useEcoStore.getState().streaks.bestStreak).toBe(2);

    // Mock missed day (2 days ago)
    date.setDate(date.getDate() - 1);
    const twoDaysAgoStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    useEcoStore.setState({ streaks: { currentStreak: 2, bestStreak: 2, lastLoggedDate: twoDaysAgoStr } });

    // Reset streak on miss
    useEcoStore.getState().updateStreaks();
    expect(useEcoStore.getState().streaks.currentStreak).toBe(1);
    expect(useEcoStore.getState().streaks.bestStreak).toBe(2);
  });
});
