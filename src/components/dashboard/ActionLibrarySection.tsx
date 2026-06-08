"use client";

import React, { useState, useEffect } from "react";
import { useEcoStore } from "@/store/useEcoStore";
import { rankSustainabilityActions } from "@/services/rankingEngine";
import { Search, TrendingDown, Check, HelpCircle, Sparkles } from "lucide-react";
import { ActionItem } from "@/data/actions";

export default function ActionLibrarySection() {
  const { userProfile, actionsState, toggleAction } = useEcoStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);

  // Close details modal on Escape key press for accessibility compliance
  useEffect(() => {
    if (!selectedAction) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedAction(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedAction]);

  if (!userProfile) return null;

  // Personalize and rank actions list locally using our engine!
  const rankedActions = rankSustainabilityActions(userProfile);

  // Filter actions
  const filteredActions = rankedActions.filter((action) => {
    const matchCategory = categoryFilter === "all" || action.category === categoryFilter;
    const matchSearch =
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case "food": return "bg-orange-50 border-orange-200 text-orange-800";
      case "travel": return "bg-blue-50 border-blue-200 text-blue-800";
      case "energy": return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "shopping": return "bg-purple-50 border-purple-200 text-purple-800";
      default: return "bg-gray-50 border-gray-200 text-gray-800";
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "easy": return "text-green-700 bg-green-50";
      case "medium": return "text-amber-700 bg-amber-50";
      case "hard": return "text-red-700 bg-red-50";
      default: return "text-gray-700 bg-gray-50";
    }
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 border border-gray-100 space-y-6">
      
      {/* Header and description */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Eco Action Library</h3>
          <p className="text-xs text-gray-500">
            Explore 50+ sustainability habits, ranked dynamically for your profile (relevance × impact × feasibility).
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] px-2.5 py-1 bg-primary-light text-primary-dark rounded-full font-bold">
          <Sparkles className="w-3.5 h-3.5 text-primary-green" /> Smart Ranked
        </span>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search actions by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-3 border border-gray-300 rounded-input text-sm text-gray-900 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none"
            aria-label="Search actions"
          />
        </div>

        {/* Category Filters selectors */}
        <div className="flex overflow-x-auto gap-2 py-0.5" role="tablist" aria-label="Category filters">
          {[
            { value: "all", label: "All" },
            { value: "food", label: "Food" },
            { value: "travel", label: "Travel" },
            { value: "energy", label: "Energy" },
            { value: "shopping", label: "Shopping" },
          ].map((cat) => (
            <button
              key={cat.value}
              role="tab"
              aria-selected={categoryFilter === cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={`h-11 px-4 border rounded-btn text-xs font-semibold shrink-0 cursor-pointer outline-none transition ${
                categoryFilter === cat.value
                  ? "bg-primary-green text-white border-primary-green"
                  : "bg-white text-gray-600 border-gray-300 hover:border-gray-400"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List of actions */}
      {filteredActions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-card p-6">
          <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-gray-700">No actions match search filters</h4>
          <p className="text-xs text-gray-400 mt-1">Try refining your keyword query or resetting the category tabs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2">
          {filteredActions.map((action) => {
            const status = actionsState[action.id];

            return (
              <div
                key={action.id}
                className="p-5 border border-gray-100 rounded-card bg-gray-50/50 hover:bg-white hover:shadow-card transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border ${getCategoryColor(action.category)}`}>
                      {action.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-bold">Priority Score: {action.rankScore}</span>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-sm">{action.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{action.description}</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between items-center text-[10px] text-gray-500">
                    <span className="inline-flex items-center gap-0.5 font-bold text-primary-green">
                      <TrendingDown className="w-3.5 h-3.5" /> -{action.co2Savings} kg/yr
                    </span>
                    <span className={`px-2 py-0.5 rounded-full capitalize font-semibold ${getDifficultyColor(action.difficulty)}`}>
                      {action.difficulty}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {/* Action details button */}
                    <button
                      onClick={() => setSelectedAction(action)}
                      className="flex-1 h-9 bg-white border border-gray-300 hover:bg-gray-50 text-[10px] font-bold rounded-btn text-gray-700 cursor-pointer"
                    >
                      Steps
                    </button>

                    {/* Toggle button */}
                    {status === "completed" ? (
                      <button
                        onClick={() => toggleAction(action.id, "available")}
                        className="flex-1 h-9 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 text-[10px] font-bold rounded-btn flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" /> Done
                      </button>
                    ) : status === "started" ? (
                      <button
                        onClick={() => toggleAction(action.id, "completed")}
                        className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-btn cursor-pointer"
                      >
                        Complete
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleAction(action.id, "started")}
                        className="flex-1 h-9 bg-primary-green hover:bg-primary-hover text-white text-[10px] font-bold rounded-btn cursor-pointer"
                      >
                        Start
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action details modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="action-modal-title">
          <div className="w-full max-w-md bg-white rounded-modal shadow-modal border border-gray-100 p-6 space-y-6 relative max-h-[85vh] overflow-y-auto">
            
            <button
              onClick={() => setSelectedAction(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full"
              aria-label="Close dialog"
            >
              <Check className="w-4 h-4 rotate-45" /> {/* simple cross */}
            </button>

            <div className="space-y-4">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getCategoryColor(selectedAction.category)}`}>
                {selectedAction.category}
              </span>
              <h2 id="action-modal-title" className="text-lg font-bold text-gray-900 pr-6 leading-tight">
                {selectedAction.title}
              </h2>
              <p className="text-xs text-gray-500 leading-relaxed">
                {selectedAction.description}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 py-2.5 border-t border-b border-gray-100 text-center text-[10px] text-gray-500">
              <div>
                <span className="block mb-0.5 font-semibold text-gray-400">Carbon Savings</span>
                <strong className="text-primary-green font-bold text-xs">-{selectedAction.co2Savings} kg/yr</strong>
              </div>
              <div>
                <span className="block mb-0.5 font-semibold text-gray-400">Difficulty</span>
                <strong className="text-gray-800 font-bold uppercase">{selectedAction.difficulty}</strong>
              </div>
              <div>
                <span className="block mb-0.5 font-semibold text-gray-400">Cost Impact</span>
                <strong className="text-gray-800 font-bold capitalize">{selectedAction.costImpact}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Implementation Guide</h4>
              <ol className="space-y-2">
                {selectedAction.implementationSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-2.5 text-xs text-gray-600">
                    <span className="w-4.5 h-4.5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-semibold shrink-0">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <button
              onClick={() => setSelectedAction(null)}
              className="w-full h-11 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-btn text-xs cursor-pointer"
            >
              Done Reading
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
