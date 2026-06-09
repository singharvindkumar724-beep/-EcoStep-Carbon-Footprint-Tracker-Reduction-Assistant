import { ONBOARDING_FACTORS, LOGGING_FACTORS } from "../data/emissionFactors";
import { UserProfile } from "../types";

/**
 * Represents the breakdown of a user's carbon footprint into main categories.
 * All units are in kilograms of CO2 equivalent (kg CO2e) per year.
 */
export interface FootprintBreakdown {
  food: number;
  travel: number;
  energy: number;
  shopping: number;
  total: number;
}

/**
 * Calculates the baseline annual carbon footprint score based on the user's onboarding inputs.
 * Uses IPCC AR6 compliant emission factors sourced from the ONBOARDING_FACTORS data dictionary.
 * 
 * @param profile - The completed UserProfile containing lifestyle metrics.
 * @returns A detailed FootprintBreakdown object with annual category totals and the grand total.
 */
export function calculateOnboardingScore(profile: UserProfile): FootprintBreakdown {
  // 1. Food emissions based on general dietary habits
  const foodEmissions = ONBOARDING_FACTORS.diet[profile.dietType] || 2200;

  // 2. Travel emissions based on vehicle type, weekly distance, and flight segments
  const annualCarDist = profile.carDistanceWeekly * 52;
  const carFactor = ONBOARDING_FACTORS.travel[profile.vehicleType] || 0;
  const carEmissions = annualCarDist * carFactor;

  const shortFlightEmissions = profile.flightShortDuration * ONBOARDING_FACTORS.flights.short;
  const longFlightEmissions = profile.flightLongDuration * ONBOARDING_FACTORS.flights.long;
  const travelEmissions = carEmissions + shortFlightEmissions + longFlightEmissions;

  // 3. Home Energy emissions scaled inversely by household size
  // Monthly electricity factors are multiplied by 12 for annual load
  const electricityEmissions = ONBOARDING_FACTORS.energy.electricity[profile.electricitySource] * 12;
  const heatingEmissions = ONBOARDING_FACTORS.energy.heating[profile.heatingSource] || 0;
  
  // Shared household resource division assumes equal splitting of structural energy costs
  const size = Math.max(1, profile.householdSize);
  const energyEmissions = (electricityEmissions + heatingEmissions) / size;

  // 4. Shopping and consumption behavior emissions
  const shoppingEmissions = ONBOARDING_FACTORS.shopping[profile.shoppingHabits] || 1200;

  // Calculate aggregate annual totals
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
 * Calculates the carbon emission footprint of a single logged activity.
 * Useful for daily tracking of green habits or high-emission actions.
 * 
 * @param category - The main domain of the activity (food, travel, energy, shopping).
 * @param subcategory - The specific action identifier (e.g., vegan_meal, public_transit).
 * @param quantity - The multiplier for the emission factor (e.g., km driven, meals eaten).
 * @returns The emissions for this single activity in kg CO2e.
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
