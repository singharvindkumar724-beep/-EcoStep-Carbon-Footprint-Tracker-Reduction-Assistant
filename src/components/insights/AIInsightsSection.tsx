"use client";

import React, { useEffect, useState } from "react";
import { useEcoStore } from "@/store/useEcoStore";
import { Sparkles, TrendingDown, ArrowRight, X, ShieldAlert } from "lucide-react";
import { Recommendation } from "@/types";

export default function AIInsightsSection() {
  const { insights, insightsLoading, insightsError, fetchInsights, actionsState, toggleAction } = useEcoStore();
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);

  // Trigger fetch once on mount
  useEffect(() => {
    fetchInsights();
  }, [fetchInsights]);

  // Close details modal on Escape key press for accessibility compliance
  useEffect(() => {
    if (!selectedRec) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedRec(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedRec]);

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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-primary-light text-primary-green rounded-lg">
              <Sparkles className="w-5 h-5" />
            </span>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Your AI Climate Coach</h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">Hyper-personalized reduction actions generated from your profile and habit history.</p>
        </div>
        <button
          onClick={() => fetchInsights()}
          disabled={insightsLoading}
          className="text-xs font-semibold px-3 py-1.5 border border-gray-300 rounded-btn hover:bg-gray-50 flex items-center gap-1.5 disabled:opacity-50"
          aria-label="Refresh AI insights recommendations"
        >
          {insightsLoading ? "Refreshing..." : "Refresh Recommendations"}
        </button>
      </div>

      {/* Loading Skeleton */}
      {insightsLoading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((num) => (
            <div key={num} className="bg-white rounded-card border border-gray-100 p-6 space-y-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
            </div>
          ))}
        </div>
      )}

      {/* Error Banner (if error happens and list is empty) */}
      {!insightsLoading && insightsError && insights.length === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-card p-6 text-center space-y-3">
          <ShieldAlert className="w-10 h-10 text-red-500 mx-auto" />
          <h4 className="font-bold text-red-900 text-sm">Failed to generate insights</h4>
          <p className="text-xs text-red-600 max-w-md mx-auto">{insightsError}</p>
          <button
            onClick={() => fetchInsights()}
            className="text-xs font-bold bg-white border border-red-300 px-4 py-2 text-red-700 rounded-btn hover:bg-red-50"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Recommendations Cards Grid */}
      {!insightsLoading && insights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((rec) => {
            const status = actionsState[rec.id];

            return (
              <div
                key={rec.id}
                className="bg-white rounded-card shadow-card border border-gray-100 p-6 flex flex-col justify-between hover:shadow-elevated transition-shadow relative overflow-hidden"
              >
                {status && (
                  <div className="absolute top-0 right-0">
                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl border-l border-b ${
                      status === "completed" 
                        ? "bg-green-100 border-green-200 text-green-800" 
                        : "bg-blue-100 border-blue-200 text-blue-800"
                    }`}>
                      {status}
                    </span>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${getCategoryColor(rec.category)}`}>
                      {rec.category}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-gray-900 text-base leading-snug">{rec.title}</h4>
                    <p className="text-xs text-gray-500 mt-1.5 line-clamp-3">{rec.reasoning}</p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center justify-between text-xs py-2 border-t border-b border-gray-50">
                    <span className="text-gray-400">CO₂ Savings:</span>
                    <strong className="text-primary-green font-bold flex items-center gap-1">
                      <TrendingDown className="w-3.5 h-3.5" /> -{rec.co2Savings} kg/yr
                    </strong>
                  </div>

                  <button
                    onClick={() => setSelectedRec(rec)}
                    className="w-full h-11 inline-flex items-center justify-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-btn hover:bg-gray-100 text-xs cursor-pointer"
                    aria-label={`View action steps for ${rec.title}`}
                  >
                    View Plan & Steps <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Details Recommendation Modal */}
      {selectedRec && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className="w-full max-w-xl bg-white rounded-modal shadow-modal border border-gray-100 p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto animate-scaleUp">
            
            {/* Close button */}
            <button
              onClick={() => setSelectedRec(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1.5 hover:bg-gray-100 rounded-full"
              aria-label="Close details dialog"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="space-y-4">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${getCategoryColor(selectedRec.category)}`}>
                {selectedRec.category}
              </span>
              <h2 id="modal-title" className="text-xl font-bold text-gray-900 pr-6 leading-tight">
                {selectedRec.title}
              </h2>
            </div>

            {/* Micro Details Grid */}
            <div className="grid grid-cols-3 gap-3 py-3 border-t border-b border-gray-100 text-center text-xs">
              <div>
                <span className="block text-gray-400 font-semibold mb-1">CO₂ Savings</span>
                <strong className="text-primary-green font-bold inline-flex items-center gap-1 text-sm">
                  <TrendingDown className="w-4 h-4" /> -{selectedRec.co2Savings} kg/yr
                </strong>
              </div>
              <div>
                <span className="block text-gray-400 font-semibold mb-1">Difficulty</span>
                <strong className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase inline-block ${getDifficultyColor(selectedRec.difficulty)}`}>
                  {selectedRec.difficulty}
                </strong>
              </div>
              <div>
                <span className="block text-gray-400 font-semibold mb-1">Cost Impact</span>
                <strong className="text-gray-900 font-bold capitalize text-sm">
                  {selectedRec.costImpact}
                </strong>
              </div>
            </div>

            {/* Reasoning */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Coach Insights</h4>
              <p className="text-sm text-gray-700 leading-relaxed bg-primary-light/10 border border-primary-green/10 p-4 rounded-btn">
                {selectedRec.reasoning}
              </p>
            </div>

            {/* Implementation Steps */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Step-by-step guidance</h4>
              <ol className="space-y-2">
                {selectedRec.implementationSteps.map((step, idx) => (
                  <li key={idx} className="flex gap-3 text-sm text-gray-600">
                    <span className="w-5 h-5 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Action Toggles */}
            <div className="border-t border-gray-100 pt-5 flex flex-col sm:flex-row gap-3">
              {actionsState[selectedRec.id] !== "started" && actionsState[selectedRec.id] !== "completed" && (
                <button
                  onClick={() => {
                    toggleAction(selectedRec.id, "started");
                    setSelectedRec(null);
                  }}
                  className="flex-1 h-12 inline-flex items-center justify-center bg-primary-green hover:bg-primary-hover text-white font-semibold rounded-btn shadow-card text-xs cursor-pointer"
                >
                  Start Action
                </button>
              )}

              {actionsState[selectedRec.id] === "started" && (
                <>
                  <button
                    onClick={() => {
                      toggleAction(selectedRec.id, "completed");
                      setSelectedRec(null);
                    }}
                    className="flex-1 h-12 inline-flex items-center justify-center bg-green-600 hover:bg-green-700 text-white font-semibold rounded-btn shadow-card text-xs cursor-pointer"
                  >
                    Complete Action
                  </button>
                  <button
                    onClick={() => {
                      toggleAction(selectedRec.id, "available");
                      setSelectedRec(null);
                    }}
                    className="flex-1 h-12 inline-flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-btn text-xs cursor-pointer"
                  >
                    Cancel Action
                  </button>
                </>
              )}

              {actionsState[selectedRec.id] === "completed" && (
                <button
                  onClick={() => {
                    toggleAction(selectedRec.id, "started");
                    setSelectedRec(null);
                  }}
                  className="flex-1 h-12 inline-flex items-center justify-center bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-btn text-xs cursor-pointer"
                >
                  Mark as In Progress
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
