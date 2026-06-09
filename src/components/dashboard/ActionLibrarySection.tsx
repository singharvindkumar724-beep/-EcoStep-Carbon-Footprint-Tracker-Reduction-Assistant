"use client";

import React, { useState } from "react";
import { useEcoStore } from "@/store/useEcoStore";
import { rankSustainabilityActions } from "@/services/rankingEngine";
import { HelpCircle, Sparkles } from "lucide-react";
import { ActionItem } from "@/data/actions";
import ActionFilters from "./ActionFilters";
import ActionCard from "./ActionCard";
import ActionModal from "./ActionModal";

export default function ActionLibrarySection() {
  const { userProfile, actionsState, toggleAction } = useEcoStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedAction, setSelectedAction] = useState<ActionItem | null>(null);

  if (!userProfile) return null;

  // Personalize and rank actions list locally using our engine
  const rankedActions = rankSustainabilityActions(userProfile);

  // Filter actions based on search query and category
  const filteredActions = rankedActions.filter((action) => {
    const matchCategory = categoryFilter === "all" || action.category === categoryFilter;
    const matchSearch =
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

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

      <ActionFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      {/* Grid List of actions */}
      {filteredActions.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-card p-6">
          <HelpCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-gray-700">No actions match search filters</h4>
          <p className="text-xs text-gray-400 mt-1">Try refining your keyword query or resetting the category tabs.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto pr-2">
          {filteredActions.map((action) => (
            <ActionCard 
              key={action.id} 
              action={action} 
              status={actionsState[action.id]} 
              onSelect={setSelectedAction}
              onToggleStatus={toggleAction}
            />
          ))}
        </div>
      )}

      {/* Action details modal */}
      <ActionModal 
        action={selectedAction} 
        onClose={() => setSelectedAction(null)} 
      />

    </div>
  );
}
