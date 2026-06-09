import { create } from "zustand";
import { persist, StateStorage, createJSONStorage } from "zustand/middleware";
import { get, set, del } from "idb-keyval";
import { EcoState, ActivityLog, Goal } from "../types";
import { calculateActivityEmissions } from "../services/carbonCalculator";

// Custom IndexedDB storage adapter for Zustand persist
const idbStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    if (typeof window === "undefined") return null;
    try {
      const val = await get(name);
      return val || null;
    } catch (err) {
      console.error("Error reading from IndexedDB:", err);
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    if (typeof window === "undefined") return;
    try {
      await set(name, value);
    } catch (err) {
      console.error("Error writing to IndexedDB:", err);
    }
  },
  removeItem: async (name: string): Promise<void> => {
    if (typeof window === "undefined") return;
    try {
      await del(name);
    } catch (err) {
      console.error("Error deleting from IndexedDB:", err);
    }
  },
};

const getTodayString = () => {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const getYesterdayString = () => {
  const date = new Date();
  date.setDate(date.getDate() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

export const useEcoStore = create<EcoState>()(
  persist(
    (set, getStore) => ({
      userProfile: null,
      onboardingProgress: {},
      activities: [],
      insights: [],
      insightsLoading: false,
      insightsError: null,
      streaks: {
        currentStreak: 0,
        bestStreak: 0,
        lastLoggedDate: null,
      },
      actionsState: {},
      goals: [],

      setOnboardingProgress: (progress) =>
        set((state) => ({
          onboardingProgress: { ...state.onboardingProgress, ...progress },
        })),

      completeOnboarding: (profile) =>
        set(() => ({
          userProfile: profile,
          onboardingProgress: {},
        })),

      resetOnboarding: () =>
        set(() => ({
          userProfile: null,
          onboardingProgress: {},
          activities: [],
          insights: [],
          streaks: { currentStreak: 0, bestStreak: 0, lastLoggedDate: null },
          actionsState: {},
          goals: [],
        })),

      logActivity: (activityData) => {
        const co2e = calculateActivityEmissions(
          activityData.category,
          activityData.subcategory,
          activityData.quantity
        );

        const newActivity: ActivityLog = {
          id: Math.random().toString(36).substring(2, 9),
          ...activityData,
          co2e,
          recordedAt: new Date().toISOString(),
        };

        set((state) => ({
          activities: [newActivity, ...state.activities],
        }));

        // Update streaks
        getStore().updateStreaks();
      },

      deleteActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((act) => act.id !== id),
        })),

      clearActivities: () =>
        set(() => ({
          activities: [],
        })),

      setInsights: (insights) =>
        set(() => ({
          insights,
        })),

      fetchInsights: async () => {
        const profile = getStore().userProfile;
        const activities = getStore().activities;

        if (!profile) return;

        set({ insightsLoading: true, insightsError: null });

        try {
          const res = await fetch("/api/insights", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              profile,
              activities: activities.slice(0, 15),
            }),
          });

          // Always try to parse the body — our route returns 200 with a local
          // fallback even on Gemini errors, so we avoid hard-throwing here.
          const data = await res.json().catch(() => ({ recommendations: [] }));

          if (data.recommendations && Array.isArray(data.recommendations)) {
            set({ insights: data.recommendations, insightsLoading: false });
          } else {
            // Unexpected shape — just clear loading so the dashboard isn't stuck
            set({ insightsLoading: false });
          }
        } catch (err: unknown) {
          // Network-level failure (offline, DNS, etc.) — fail silently
          console.warn("AI Insight Engine unavailable:", err);
          set({ insightsLoading: false, insightsError: null });
        }
      },

      toggleAction: (actionId, status) => {
        set((state) => {
          const nextActionsState = { ...state.actionsState };
          if (status === "available") {
            delete nextActionsState[actionId];
          } else {
            nextActionsState[actionId] = status;
          }
          return { actionsState: nextActionsState };
        });
      },

      updateStreaks: () => {
        const today = getTodayString();
        const yesterday = getYesterdayString();
        const currentStreakState = getStore().streaks;

        let currentStreak = currentStreakState.currentStreak;
        let bestStreak = currentStreakState.bestStreak;
        const lastLoggedDate = currentStreakState.lastLoggedDate;

        if (lastLoggedDate === today) {
          // Already logged today, streak is maintained
          return;
        } else if (lastLoggedDate === yesterday) {
          // Logged yesterday, increment streak
          currentStreak += 1;
        } else {
          // Reset streak because user missed a day
          currentStreak = 1;
        }

        bestStreak = Math.max(bestStreak, currentStreak);

        set(() => ({
          streaks: {
            currentStreak,
            bestStreak,
            lastLoggedDate: today,
          },
        }));
      },
      
      addGoal: (goalData) => {
        const newGoal: Goal = {
          id: Math.random().toString(36).substring(2, 9),
          ...goalData,
          currentCo2e: 0,
          status: "active",
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      updateGoalProgress: (id, currentCo2e) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, currentCo2e } : g
          ),
        }));
      },

      completeGoal: (id) => {
        set((state) => ({
          goals: state.goals.map((g) =>
            g.id === id ? { ...g, status: "completed" } : g
          ),
        }));
      },
    }),
    {
      name: "ecostep-storage",
      storage: createJSONStorage(() => idbStorage),
      // Only persist complete store, exclude transient states like loading
      partialize: (state) => ({
        userProfile: state.userProfile,
        activities: state.activities,
        insights: state.insights,
        streaks: state.streaks,
        actionsState: state.actionsState,
        goals: state.goals,
      }),
    }
  )
);
