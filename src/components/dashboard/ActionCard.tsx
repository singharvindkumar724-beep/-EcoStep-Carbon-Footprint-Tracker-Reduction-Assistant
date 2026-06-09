"use client";

import React from "react";
import { TrendingDown, Check } from "lucide-react";
import { ActionItem } from "@/data/actions";

interface ActionCardProps {
  action: ActionItem;
  status: "available" | "started" | "completed" | undefined;
  onSelect: (action: ActionItem) => void;
  onToggleStatus: (actionId: string, status: "available" | "started" | "completed") => void;
}

export default function ActionCard({
  action,
  status,
  onSelect,
  onToggleStatus,
}: ActionCardProps) {
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
    <div className="p-5 border border-gray-100 rounded-card bg-gray-50/50 hover:bg-white hover:shadow-card transition flex flex-col justify-between">
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
            onClick={() => onSelect(action)}
            className="flex-1 h-9 bg-white border border-gray-300 hover:bg-gray-50 text-[10px] font-bold rounded-btn text-gray-700 cursor-pointer"
          >
            Steps
          </button>

          {/* Toggle button */}
          {status === "completed" ? (
            <button
              onClick={() => onToggleStatus(action.id, "available")}
              className="flex-1 h-9 bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 text-[10px] font-bold rounded-btn flex items-center justify-center gap-1 cursor-pointer"
            >
              <Check className="w-3.5 h-3.5" /> Done
            </button>
          ) : status === "started" ? (
            <button
              onClick={() => onToggleStatus(action.id, "completed")}
              className="flex-1 h-9 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-btn cursor-pointer"
            >
              Complete
            </button>
          ) : (
            <button
              onClick={() => onToggleStatus(action.id, "started")}
              className="flex-1 h-9 bg-primary-green hover:bg-primary-hover text-white text-[10px] font-bold rounded-btn cursor-pointer"
            >
              Start
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
