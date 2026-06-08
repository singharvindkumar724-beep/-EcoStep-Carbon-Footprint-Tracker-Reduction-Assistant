"use client";

import React from "react";
import { useEcoStore } from "@/store/useEcoStore";
import { calculateOnboardingScore } from "@/services/carbonCalculator";
import { Leaf, Flame, TrendingDown, CheckCircle2 } from "lucide-react";
import { SUSTAINABILITY_ACTIONS } from "@/data/actions";

export default function KPIHeader() {
  const { userProfile, actionsState, streaks } = useEcoStore();

  if (!userProfile) return null;

  // Calculate baseline footprint
  const baseline = calculateOnboardingScore(userProfile);
  
  let annualSavings = 0;
  let activeActionsCount = 0;
  let completedActionsCount = 0;

  Object.entries(actionsState).forEach(([actionId, status]) => {
    if (status === "started") {
      activeActionsCount++;
    } else if (status === "completed") {
      completedActionsCount++;
      const action = SUSTAINABILITY_ACTIONS.find((a) => a.id === actionId);
      if (action) {
        annualSavings += action.co2Savings;
      }
    }
  });

  // Calculate new annual score
  const baselineScore = baseline.total;
  const currentAnnualScore = Math.max(0, baselineScore - annualSavings);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1: Annual Carbon Score */}
      <div className="bg-white rounded-card shadow-card p-6 border border-gray-100 flex flex-col justify-between hover:shadow-elevated transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Annual Footprint</span>
          <span className="p-2 bg-primary-light text-primary-green rounded-xl">
            <Leaf className="w-5 h-5" />
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-3xl font-extrabold text-gray-900">{currentAnnualScore.toLocaleString()}</h3>
            <span className="text-xs font-medium text-gray-500">kg CO₂e/yr</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Baseline: {baselineScore.toLocaleString()} kg (Saved: {annualSavings.toLocaleString()} kg)
          </p>
        </div>
      </div>

      {/* Card 2: Estimated Savings */}
      <div className="bg-white rounded-card shadow-card p-6 border border-gray-100 flex flex-col justify-between hover:shadow-elevated transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Carbon Saved</span>
          <span className="p-2 bg-green-50 text-green-600 rounded-xl">
            <TrendingDown className="w-5 h-5" />
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-3xl font-extrabold text-green-600">-{annualSavings.toLocaleString()}</h3>
            <span className="text-xs font-medium text-green-600">kg/yr</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Reduced your footprint by <span className="font-semibold text-green-600">{baselineScore > 0 ? Math.round((annualSavings / baselineScore) * 100) : 0}%</span>
          </p>
        </div>
      </div>

      {/* Card 3: Completed Actions */}
      <div className="bg-white rounded-card shadow-card p-6 border border-gray-100 flex flex-col justify-between hover:shadow-elevated transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Completed Actions</span>
          <span className="p-2 bg-blue-50 text-blue-600 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-3xl font-extrabold text-gray-900">{completedActionsCount}</h3>
            <span className="text-xs font-medium text-gray-500">actions</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {activeActionsCount} action{activeActionsCount === 1 ? "" : "s"} currently in progress
          </p>
        </div>
      </div>

      {/* Card 4: Streak Tracker */}
      <div className="bg-white rounded-card shadow-card p-6 border border-gray-100 flex flex-col justify-between hover:shadow-elevated transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Logging Streak</span>
          <span className="p-2 bg-orange-50 text-orange-600 rounded-xl">
            <Flame className="w-5 h-5" aria-hidden="true" />
          </span>
        </div>
        <div>
          <div className="flex items-baseline gap-1.5">
            <h3 className="text-3xl font-extrabold text-gray-900">{streaks.currentStreak}</h3>
            <span className="text-xs font-medium text-gray-500">days</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Best streak: {streaks.bestStreak} day{streaks.bestStreak === 1 ? "" : "s"}
          </p>
        </div>
      </div>
    </div>
  );
}
