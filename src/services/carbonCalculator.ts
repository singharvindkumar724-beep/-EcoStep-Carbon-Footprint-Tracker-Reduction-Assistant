import { ONBOARDING_FACTORS, LOGGING_FACTORS } from "../data/emissionFactors";
import { UserProfile } from "../types";

export interface FootprintBreakdown {
  food: number; // kg CO2e / year
  travel: number; // kg CO2e / year
  energy: number; // kg CO2e / year
  shopping: number; // kg CO2e / year
  total: number; // kg CO2e / year
}

/**
 * Calculates the baseline carbon footprint score (kg CO2e/year) from onboarding inputs.
 */
export function calculateOnboardingScore(profile: UserProfile): FootprintBreakdown {
  // 1. Food emissions
  const foodEmissions = ONBOARDING_FACTORS.diet[profile.dietType] || 2200;

  // 2. Travel emissions
  const annualCarDist = profile.carDistanceWeekly * 52;
  const carFactor = ONBOARDING_FACTORS.travel[profile.vehicleType] || 0;
  const carEmissions = annualCarDist * carFactor;

  const shortFlightEmissions = profile.flightShortDuration * ONBOARDING_FACTORS.flights.short;
  const longFlightEmissions = profile.flightLongDuration * ONBOARDING_FACTORS.flights.long;
  const travelEmissions = carEmissions + shortFlightEmissions + longFlightEmissions;

  // 3. Home Energy emissions (scaled by household size)
  const electricityEmissions = ONBOARDING_FACTORS.energy.electricity[profile.electricitySource] * 12;
  const heatingEmissions = ONBOARDING_FACTORS.energy.heating[profile.heatingSource] || 0;
  
  // Shared household resource division
  const size = Math.max(1, profile.householdSize);
  const energyEmissions = (electricityEmissions + heatingEmissions) / size;

  // 4. Shopping emissions
  const shoppingEmissions = ONBOARDING_FACTORS.shopping[profile.shoppingHabits] || 1200;

  // Calculate totals
  const total = foodEmissions + travelEmissions + energyEmissions + shoppingEmissions;

  return {
    food: Math.round(foodEmissions),
    travel: Math.round(travelEmissions),
    energy: Math.round(energyEmissions),
    shopping: Math.round(shoppingEmissions),
    total: Math.round(total),
  };
}

/**
 * Calculates the emissions of a specific logged activity in kg CO2e.
 */
export function calculateActivityEmissions(
  category: "food" | "travel" | "energy" | "shopping",
  subcategory: string,
  quantity: number
): number {
  const categoryFactors = LOGGING_FACTORS[category] as Record<string, { rate: number; unit: string; label: string }>;
  if (!categoryFactors || !categoryFactors[subcategory]) {
    return 0;
  }
  const factor = categoryFactors[subcategory].rate;
  return Number((quantity * factor).toFixed(2));
}
