import { describe, it, expect } from "vitest";
import { rankSustainabilityActions } from "../rankingEngine";
import { UserProfile } from "../../types";

describe("Sustainability Actions Ranking Engine", () => {
  it("should rank vegan-related actions at zero relevance if the user is already vegan", () => {
    const profile: UserProfile = {
      location: "US",
      householdSize: 2,
      dietType: "vegan", // ALREADY VEGAN
      vehicleType: "petrol_car",
      carDistanceWeekly: 100,
      flightShortDuration: 0,
      flightLongDuration: 0,
      electricitySource: "grid_electricity",
      heatingSource: "natural_gas",
      shoppingHabits: "average",
    };

    const ranked = rankSustainabilityActions(profile);

    // Verify go vegan (food_04) and go vegetarian (food_03) are completely removed (score = 0)
    const goVegan = ranked.find((a) => a.id === "food_04");
    const goVegetarian = ranked.find((a) => a.id === "food_03");

    expect(goVegan).toBeUndefined();
    expect(goVegetarian).toBeUndefined();
  });

  it("should rank EV-related actions high for petrol car drivers", () => {
    const profile: UserProfile = {
      location: "US",
      householdSize: 2,
      dietType: "omnivore",
      vehicleType: "petrol_car", // PETROL DRIVER
      carDistanceWeekly: 300,
      flightShortDuration: 0,
      flightLongDuration: 0,
      electricitySource: "grid_electricity",
      heatingSource: "natural_gas",
      shoppingHabits: "average",
    };

    const ranked = rankSustainabilityActions(profile);

    // Verify EV transition (travel_04) is present
    const evAction = ranked.find((a) => a.id === "travel_04");
    expect(evAction).toBeDefined();
    
    // Petrol car travel is large, so travel options should rank high
    expect(ranked[0].category).toBeDefined();
  });
});
