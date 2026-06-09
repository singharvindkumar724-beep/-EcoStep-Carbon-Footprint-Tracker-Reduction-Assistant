"use client";

import React, { useState } from "react";
import { useEcoStore } from "@/store/useEcoStore";
import { Target, CheckCircle2, TrendingDown } from "lucide-react";

export default function GoalProgress() {
  const { goals, addGoal, completeGoal } = useEcoStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [goalTitle, setGoalTitle] = useState("");
  const [targetCo2e, setTargetCo2e] = useState("");
  const [endDate, setEndDate] = useState("");

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalTitle || !targetCo2e || !endDate) return;

    addGoal({
      title: goalTitle,
      targetCo2e: Number(targetCo2e),
      startDate: new Date().toISOString().split("T")[0],
      endDate: endDate,
    });

    setGoalTitle("");
    setTargetCo2e("");
    setEndDate("");
    setShowAddForm(false);
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 border border-gray-100 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-green" /> Reduction Goals
          </h3>
          <p className="text-xs text-gray-500 mt-1">Set and track your carbon reduction targets.</p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-primary-green hover:bg-primary-hover text-white text-xs font-bold rounded-btn transition"
          >
            + New Goal
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleAddGoal} className="bg-gray-50 p-4 rounded-btn border border-gray-200 space-y-4">
          <div className="space-y-3">
            <div>
              <label htmlFor="goalTitle" className="block text-xs font-semibold text-gray-700 mb-1">Goal Title</label>
              <input
                id="goalTitle"
                type="text"
                value={goalTitle}
                onChange={(e) => setGoalTitle(e.target.value)}
                placeholder="e.g. Go Vegan for a Month"
                className="w-full px-3 py-2 border border-gray-300 rounded-input text-sm outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                required
              />
            </div>
            <div className="flex gap-3">
              <div className="flex-1">
                <label htmlFor="targetCo2e" className="block text-xs font-semibold text-gray-700 mb-1">Target Reduction (kg CO₂e)</label>
                <input
                  id="targetCo2e"
                  type="number"
                  value={targetCo2e}
                  onChange={(e) => setTargetCo2e(e.target.value)}
                  placeholder="e.g. 50"
                  className="w-full px-3 py-2 border border-gray-300 rounded-input text-sm outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                  required
                />
              </div>
              <div className="flex-1">
                <label htmlFor="endDate" className="block text-xs font-semibold text-gray-700 mb-1">End Date</label>
                <input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-input text-sm outline-none focus:border-primary-green focus:ring-1 focus:ring-primary-green"
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-btn transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-green hover:bg-primary-hover text-white text-xs font-bold rounded-btn transition"
            >
              Save Goal
            </button>
          </div>
        </form>
      )}

      {goals.length === 0 && !showAddForm ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-btn">
          <p className="text-xs text-gray-500">No active goals. Set a target to stay motivated!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activeGoals.map((goal) => {
            const progress = Math.min((goal.currentCo2e / goal.targetCo2e) * 100, 100);
            return (
              <div key={goal.id} className="p-4 border border-gray-200 rounded-btn space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{goal.title}</h4>
                    <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider mt-0.5">
                      Target: {goal.targetCo2e} kg • Deadline: {goal.endDate}
                    </p>
                  </div>
                  <button
                    onClick={() => completeGoal(goal.id)}
                    className="p-1.5 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition"
                    aria-label={`Mark goal ${goal.title} as completed`}
                  >
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold text-gray-600">
                    <span>{progress.toFixed(0)}% Completed</span>
                    <span>{goal.currentCo2e} kg saved</span>
                  </div>
                  <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary-green rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {completedGoals.length > 0 && (
            <div className="pt-4 mt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Completed Goals</h4>
              <div className="space-y-2">
                {completedGoals.map((goal) => (
                  <div key={goal.id} className="flex items-center gap-2 p-2 bg-green-50 rounded text-sm text-green-800">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span className="font-medium line-through opacity-80">{goal.title}</span>
                    <span className="ml-auto font-bold text-xs flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" /> -{goal.targetCo2e} kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
