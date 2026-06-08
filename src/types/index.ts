export interface UserProfile {
  location: string;
  householdSize: number;
  dietType: "vegan" | "vegetarian" | "flexitarian" | "omnivore";
  vehicleType: "petrol_car" | "electric_car" | "public_transit" | "bike_walk";
  carDistanceWeekly: number; // in km
  flightShortDuration: number; // short flights per year
  flightLongDuration: number; // long flights per year
  electricitySource: "grid_electricity" | "renewable_electricity" | "mixed";
  heatingSource: "natural_gas" | "electric_heating";
  shoppingHabits: "minimal" | "average" | "frequent";
}

export interface ActivityLog {
  id: string;
  category: "food" | "travel" | "energy" | "shopping";
  subcategory: string;
  quantity: number;
  unit: string;
  co2e: number; // calculated CO2 in kg
  recordedAt: string; // ISO String
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: "food" | "travel" | "energy" | "shopping";
  co2Savings: number; // kg/year
  difficulty: "easy" | "medium" | "hard";
  costImpact: "saving" | "neutral" | "investment";
  reasoning: string;
  implementationSteps: string[];
}

export interface HabitStreak {
  currentStreak: number;
  bestStreak: number;
  lastLoggedDate: string | null; // Date string format YYYY-MM-DD
}

export interface ActionState {
  actionId: string;
  status: "available" | "started" | "completed";
  updatedAt: string;
}

export interface EcoState {
  userProfile: UserProfile | null;
  onboardingProgress: Partial<UserProfile>;
  activities: ActivityLog[];
  insights: Recommendation[];
  insightsLoading: boolean;
  insightsError: string | null;
  streaks: HabitStreak;
  actionsState: Record<string, "started" | "completed">;
  
  // Actions
  setOnboardingProgress: (progress: Partial<UserProfile>) => void;
  completeOnboarding: (profile: UserProfile) => void;
  resetOnboarding: () => void;
  
  logActivity: (activity: Omit<ActivityLog, "id" | "recordedAt" | "co2e">) => void;
  deleteActivity: (id: string) => void;
  clearActivities: () => void;
  
  setInsights: (insights: Recommendation[]) => void;
  fetchInsights: () => Promise<void>;
  
  toggleAction: (actionId: string, status: "started" | "completed" | "available") => void;
  updateStreaks: () => void;
}
