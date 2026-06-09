import { ActionItem, SUSTAINABILITY_ACTIONS } from "../data/actions";
import { UserProfile } from "../types";
import { calculateOnboardingScore } from "./carbonCalculator";

/**
 * Core algorithm for prioritizing and ranking sustainability actions.
 * Evaluates all possible actions against the user's specific profile to output a highly personalized, sorted list.
 * 
 * Formula: Rank Score = Impact × Relevance × Feasibility
 * 
 * - **Impact**: The base annual CO2e savings in kg (defined in the action dictionary).
 * - **Relevance**: A dynamic multiplier (0.0 to 2.5) calculated based on the user's current habits.
 *   - E.g., if a user is already vegan, meat-reduction actions get a 0.0 relevance.
 *   - E.g., if a user drives a petrol car, EV transition gets a 2.5x relevance boost.
 * - **Feasibility**: A fractional damper representing the difficulty of the action.
 *   - Easy = 1.0, Medium = 0.7, Hard = 0.4.
 * 
 * @param profile - The completed UserProfile containing dietary, travel, and energy habits.
 * @returns A sorted array of `ActionItem` objects extended with a computed `rankScore`, descending.
 */
export function rankSustainabilityActions(profile: UserProfile): (ActionItem & { rankScore: number })[] {
  // 1. Calculate the user's footprint breakdown to check high emission categories
  const breakdown = calculateOnboardingScore(profile);
  
  // Find highest category (excluding total)
  const categories = [
    { key: "food", val: breakdown.food },
    { key: "travel", val: breakdown.travel },
    { key: "energy", val: breakdown.energy },
    { key: "shopping", val: breakdown.shopping }
  ];
  categories.sort((a, b) => b.val - a.val);
  const highestCategory = categories[0].key;

  return SUSTAINABILITY_ACTIONS.map((action) => {
    let relevance = 1.0;
    
    // Feasibility factor
    let feasibility = 1.0;
    if (action.difficulty === "medium") feasibility = 0.7;
    if (action.difficulty === "hard") feasibility = 0.4;

    // Apply baseline category relevance (if category is user's highest emission source, boost relevance)
    if (action.category === highestCategory) {
      relevance *= 1.5;
    }

    // Contextual personalization filters & boosts
    // -- FOOD RELEVANCE --
    if (action.category === "food") {
      if (profile.dietType === "vegan") {
        // Already vegan, animal product reduction actions are not relevant
        if (action.id === "food_01" || action.id === "food_02" || action.id === "food_03" || action.id === "food_04" || action.id === "food_11") {
          relevance = 0.0;
        }
      } else if (profile.dietType === "vegetarian") {
        // Already vegetarian, meat reduction is not relevant, but vegan transition is
        if (action.id === "food_01" || action.id === "food_02" || action.id === "food_03") {
          relevance = 0.0;
        } else if (action.id === "food_04" || action.id === "food_11") {
          relevance *= 2.0; // Boost vegan/dairy transition
        }
      } else if (profile.dietType === "flexitarian") {
        // Flexitarian, target complete vegetarianism or red meat swaps
        if (action.id === "food_02") relevance *= 1.8;
        if (action.id === "food_03") relevance *= 1.5;
      } else if (profile.dietType === "omnivore") {
        // Omnivore, huge potential for simple swaps
        if (action.id === "food_01" || action.id === "food_02") {
          relevance *= 2.5; // Boost easy swaps
        }
      }
    }

    // -- TRAVEL RELEVANCE --
    if (action.category === "travel") {
      if (profile.vehicleType === "bike_walk") {
        // User walks/bikes, carpool or EV and car maintenance have zero relevance
        if (action.id === "travel_01" || action.id === "travel_04" || action.id === "travel_08" || action.id === "travel_09" || action.id === "travel_12" || action.id === "travel_03") {
          relevance = 0.0;
        }
      } else if (profile.vehicleType === "electric_car") {
        // User drives EV, fuel efficiency is less relevant, carpooling is moderately relevant
        if (action.id === "travel_04") {
          relevance = 0.0; // Already has EV
        } else if (action.id === "travel_08" || action.id === "travel_09" || action.id === "travel_12") {
          relevance *= 0.5; // Less impact for EV driving style
        }
      } else if (profile.vehicleType === "petrol_car") {
        // Driving gasoline car: EV transition, eco tires, and carpool are highly relevant
        if (action.id === "travel_01" || action.id === "travel_04" || action.id === "travel_09") {
          relevance *= 2.5;
        }
      }

      // Flight relevance
      const totalFlights = profile.flightShortDuration + profile.flightLongDuration;
      if (totalFlights === 0 && action.id === "travel_07") {
        relevance = 0.0; // Doesn't fly
      } else if (totalFlights > 4 && action.id === "travel_07") {
        relevance *= 2.0; // Highly relevant if they fly a lot
      }
    }

    // -- ENERGY RELEVANCE --
    if (action.category === "energy") {
      // Scale energy checks
      if (profile.electricitySource === "renewable_electricity" && action.id === "energy_07") {
        relevance = 0.0; // Already has green energy
      }
      if (profile.electricitySource === "grid_electricity" && action.id === "energy_07") {
        relevance *= 2.5; // Suggest switching plan
      }
      // Household size checks (solar panel is better for larger houses, pipe insulation as well)
      if (profile.householdSize > 3) {
        if (action.id === "energy_08") relevance *= 1.5; // solar panels
      }
    }

    const rankScore = Math.round(action.co2Savings * relevance * feasibility);

    return {
      ...action,
      rankScore,
    };
  })
  .filter((action) => action.rankScore > 0) // Filter out zero relevance actions
  .sort((a, b) => b.rankScore - a.rankScore); // Sort by highest score descending
}
