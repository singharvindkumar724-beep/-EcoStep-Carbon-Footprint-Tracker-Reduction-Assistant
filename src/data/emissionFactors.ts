export const ONBOARDING_FACTORS = {
  diet: {
    vegan: 1000,        // kg CO2e / year
    vegetarian: 1500,   // kg CO2e / year
    flexitarian: 2200,  // kg CO2e / year
    omnivore: 3300,     // kg CO2e / year
  },
  travel: {
    petrol_car: 0.192,     // kg CO2e / km
    electric_car: 0.050,   // kg CO2e / km
    public_transit: 0.040, // kg CO2e / km
    bike_walk: 0.000,      // kg CO2e / km
  },
  flights: {
    short: 150, // kg CO2e per flight segment
    long: 600,  // kg CO2e per flight segment
  },
  energy: {
    electricity: {
      grid_electricity: 350 * 0.45,       // average 350 kWh/month * factor
      renewable_electricity: 350 * 0.02,  // average 350 kWh/month * factor
      mixed: 350 * 0.25,                  // mixed
    },
    heating: {
      natural_gas: 1200,      // kg CO2e / year average
      electric_heating: 600,  // kg CO2e / year average
    }
  },
  shopping: {
    minimal: 500,     // kg CO2e / year
    average: 1200,    // kg CO2e / year
    frequent: 2500,   // kg CO2e / year
  }
};

export const LOGGING_FACTORS = {
  food: {
    red_meat_meal: { rate: 6.5, unit: "meals", label: "Red Meat Meal" },
    poultry_fish_meal: { rate: 2.2, unit: "meals", label: "Poultry or Fish Meal" },
    vegetarian_meal: { rate: 0.9, unit: "meals", label: "Vegetarian Meal" },
    vegan_meal: { rate: 0.5, unit: "meals", label: "Vegan Meal" },
  },
  travel: {
    petrol_car_km: { rate: 0.192, unit: "km", label: "Petrol/Diesel Car Trip" },
    electric_car_km: { rate: 0.050, unit: "km", label: "Electric Vehicle Trip" },
    transit_km: { rate: 0.040, unit: "km", label: "Public Transit Ride" },
    flight_segment: { rate: 250, unit: "segments", label: "Flight Segment (Single Leg)" },
  },
  energy: {
    electricity_kwh: { rate: 0.45, unit: "kWh", label: "Electricity Usage" },
    heating_gas_hours: { rate: 1.8, unit: "hours", label: "Natural Gas Heating Run" },
  },
  shopping: {
    new_clothing_item: { rate: 15.0, unit: "items", label: "New Clothing Item" },
    new_electronic_item: { rate: 80.0, unit: "items", label: "New Electronic Device" },
    general_purchase: { rate: 5.0, unit: "purchases", label: "General Retail Purchase" },
  }
};

export const COUNTRY_AVERAGES: Record<string, number> = {
  US: 15200, // kg CO2e / year
  DE: 8400,  // Germany
  IN: 1900,  // India
  UK: 5800,  // United Kingdom
  Global: 4700,
};
