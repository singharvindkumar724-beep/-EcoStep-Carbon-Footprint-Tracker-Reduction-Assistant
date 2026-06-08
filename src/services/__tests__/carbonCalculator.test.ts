import { describe, it, expect } from "vitest";
import { calculateOnboardingScore, calculateActivityEmissions } from "../carbonCalculator";
import { UserProfile } from "../../types";

describe("Carbon Calculation Engine Tests", () => {
  it("should calculate correct baseline for an average high-impact omnivore user", () => {
    const profile: UserProfile = {
      location: "US",
      householdSize: 1,
      dietType: "omnivore",
      vehicleType: "petrol_car",
      carDistanceWeekly: 200,
      flightShortDuration: 4,
      flightLongDuration: 2,
      electricitySource: "grid_electricity",
      heatingSource: "natural_gas",
      shoppingHabits: "frequent",
    };

    const breakdown = calculateOnboardingScore(profile);

    // Food: omnivore = 3300
    expect(breakdown.food).toBe(3300);

    // Travel: car = 200km * 52 weeks * 0.192 = 1996.8
    // Flights: 4 * 150 (600) + 2 * 600 (1200) = 1800
    // Travel Total: 1997 + 1800 = 3797
    expect(breakdown.travel).toBe(3797);

    // Energy: electricity (350 * 0.45 * 12 = 1890) + heating (natural_gas = 1200) = 3090
    // householdSize = 1 => 3090 / 1 = 3090
    expect(breakdown.energy).toBe(3090);

    // Shopping: frequent = 2500
    expect(breakdown.shopping).toBe(2500);

    // Total: 3300 + 3797 + 3090 + 2500 = 12687
    expect(breakdown.total).toBe(12687);
  });

  it("should calculate correct baseline for a low-impact vegan/bike user", () => {
    const profile: UserProfile = {
      location: "IN",
      householdSize: 4,
      dietType: "vegan",
      vehicleType: "bike_walk",
      carDistanceWeekly: 0,
      flightShortDuration: 0,
      flightLongDuration: 0,
      electricitySource: "renewable_electricity",
      heatingSource: "electric_heating",
      shoppingHabits: "minimal",
    };

    const breakdown = calculateOnboardingScore(profile);

    // Food: vegan = 1000
    expect(breakdown.food).toBe(1000);

    // Travel: 0
    expect(breakdown.travel).toBe(0);

    // Energy: electricity (350 * 0.02 * 12 = 84) + heating (electric_heating = 600) = 684
    // householdSize = 4 => 684 / 4 = 171
    expect(breakdown.energy).toBe(171);

    // Shopping: minimal = 500
    expect(breakdown.shopping).toBe(500);

    // Total: 1000 + 0 + 171 + 500 = 1671
    expect(breakdown.total).toBe(1671);
  });

  it("should calculate correct emissions for logged activities", () => {
    // 2 portions of red meat
    const redMeatEmissions = calculateActivityEmissions("food", "red_meat_meal", 2);
    expect(redMeatEmissions).toBe(13.0); // 2 * 6.5

    // 50 km petrol car drive
    const driveEmissions = calculateActivityEmissions("travel", "petrol_car_km", 50);
    expect(driveEmissions).toBe(9.6); // 50 * 0.192

    // Invalid activity subcategory
    const invalidEmissions = calculateActivityEmissions("travel", "rocket_ship", 1);
    expect(invalidEmissions).toBe(0);
  });
});
