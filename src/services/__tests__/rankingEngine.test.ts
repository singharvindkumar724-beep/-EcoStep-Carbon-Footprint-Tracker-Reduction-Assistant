import { describe, it, expect } from "vitest";
import { rankSustainabilityActions } from "../rankingEngine";
import { UserProfile } from "../../types";

describe("Sustainability Actions Ranking Engine", () => {
  const baseProfile: UserProfile = {
    location: "US",
    householdSize: 2,
    dietType: "omnivore",
    vehicleType: "petrol_car",
    carDistanceWeekly: 100,
    flightShortDuration: 0,
    flightLongDuration: 0,
    electricitySource: "grid_electricity",
    heatingSource: "natural_gas",
    shoppingHabits: "average",
  };

  it("should rank vegan-related actions at zero relevance if the user is already vegan", () => {
    const profile = { ...baseProfile, dietType: "vegan" as const };
    const ranked = rankSustainabilityActions(profile);

    const goVegan = ranked.find((a) => a.id === "food_04");
    expect(goVegan).toBeUndefined();
  });

  it("should rank vegetarian logic correctly", () => {
    const profile = { ...baseProfile, dietType: "vegetarian" as const };
    const ranked = rankSustainabilityActions(profile);

    // Should hide vegetarian transition, boost vegan transition
    const goVegetarian = ranked.find((a) => a.id === "food_03");
    const goVegan = ranked.find((a) => a.id === "food_04");
    
    expect(goVegetarian).toBeUndefined();
    expect(goVegan).toBeDefined();
  });

  it("should rank flexitarian logic correctly", () => {
    const profile = { ...baseProfile, dietType: "flexitarian" as const };
    const ranked = rankSustainabilityActions(profile);

    const redMeatSwap = ranked.find((a) => a.id === "food_02");
    expect(redMeatSwap).toBeDefined();
  });

  it("should rank EV-related actions high for petrol car drivers", () => {
    const profile = { ...baseProfile, vehicleType: "petrol_car" as const, carDistanceWeekly: 300 };
    const ranked = rankSustainabilityActions(profile);

    const evAction = ranked.find((a) => a.id === "travel_04");
    expect(evAction).toBeDefined();
  });

  it("should rank zero for car actions if bike/walk", () => {
    const profile = { ...baseProfile, vehicleType: "bike_walk" as const };
    const ranked = rankSustainabilityActions(profile);

    const evAction = ranked.find((a) => a.id === "travel_04");
    const carpoolAction = ranked.find((a) => a.id === "travel_01");
    expect(evAction).toBeUndefined();
    expect(carpoolAction).toBeUndefined();
  });

  it("should rank zero for EV purchase if already owns EV", () => {
    const profile = { ...baseProfile, vehicleType: "electric_car" as const };
    const ranked = rankSustainabilityActions(profile);

    const evAction = ranked.find((a) => a.id === "travel_04");
    expect(evAction).toBeUndefined();
  });

  it("should rank flights heavily if user flies a lot", () => {
    const profile = { ...baseProfile, flightShortDuration: 5, flightLongDuration: 2 };
    const ranked = rankSustainabilityActions(profile);

    const offsetFlight = ranked.find((a) => a.id === "travel_07");
    expect(offsetFlight).toBeDefined();
  });

  it("should rank flights at zero if user doesn't fly", () => {
    const profile = { ...baseProfile, flightShortDuration: 0, flightLongDuration: 0 };
    const ranked = rankSustainabilityActions(profile);

    const offsetFlight = ranked.find((a) => a.id === "travel_07");
    expect(offsetFlight).toBeUndefined();
  });

  it("should zero out green energy plan if already on renewable", () => {
    const profile = { ...baseProfile, electricitySource: "renewable_electricity" as const };
    const ranked = rankSustainabilityActions(profile);

    const greenEnergy = ranked.find((a) => a.id === "energy_07");
    expect(greenEnergy).toBeUndefined();
  });

  it("should boost solar for large households", () => {
    const profile = { ...baseProfile, householdSize: 5 };
    const ranked = rankSustainabilityActions(profile);

    const solarPanel = ranked.find((a) => a.id === "energy_08");
    expect(solarPanel).toBeDefined();
  });
});
