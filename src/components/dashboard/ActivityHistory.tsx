"use client";

import React, { useState } from "react";
import { useEcoStore } from "@/store/useEcoStore";
import { LOGGING_FACTORS } from "@/data/emissionFactors";
import { Search, Trash2, Calendar } from "lucide-react";

type SortOption = "newest" | "oldest" | "highest" | "lowest";

export default function ActivityHistory() {
  const { activities, deleteActivity, clearActivities } = useEcoStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Category labels helper
  const getSubcategoryLabel = (category: string, sub: string) => {
    const factors = LOGGING_FACTORS as unknown as Record<string, Record<string, { label: string }>>;
    const info = factors[category]?.[sub];
    return info?.label || sub;
  };

  // Filter & Search & Sort logic
  const filteredActivities = activities
    .filter((act) => {
      const matchCat = selectedCategory === "all" || act.category === selectedCategory;
      const labelText = getSubcategoryLabel(act.category, act.subcategory).toLowerCase();
      const matchSearch = labelText.includes(searchQuery.toLowerCase()) || act.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime();
      }
      if (sortBy === "oldest") {
        return new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime();
      }
      if (sortBy === "highest") {
        return b.co2e - a.co2e;
      }
      if (sortBy === "lowest") {
        return a.co2e - b.co2e;
      }
      return 0;
    });

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const categoryColorMap: Record<string, string> = {
    food: "bg-orange-100 text-orange-800",
    travel: "bg-blue-100 text-blue-800",
    energy: "bg-yellow-100 text-yellow-800",
    shopping: "bg-purple-100 text-purple-800",
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 border border-gray-100 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 tracking-tight">Activity History</h3>
          <p className="text-xs text-gray-500">Search, filter, and review your logged footprint history.</p>
        </div>
        {activities.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Are you sure you want to clear all logged activities? This cannot be undone.")) {
                clearActivities();
              }
            }}
            className="text-xs font-semibold text-red-600 hover:text-red-800 border border-red-200 hover:border-red-300 px-3 py-1.5 rounded-btn bg-red-50/50"
            aria-label="Clear all activity history"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Search logged activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-11 pl-10 pr-3 border border-gray-300 rounded-input text-sm text-gray-900 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none"
            aria-label="Search activities query"
          />
        </div>

        {/* Category Selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-11 px-3 border border-gray-300 rounded-input bg-white text-gray-900 text-sm focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none"
          aria-label="Filter activities by category"
        >
          <option value="all">All Categories</option>
          <option value="food">Food</option>
          <option value="travel">Travel</option>
          <option value="energy">Home Energy</option>
          <option value="shopping">Shopping</option>
        </select>

        {/* Sort Selector */}
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="h-11 px-3 border border-gray-300 rounded-input bg-white text-gray-900 text-sm focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none"
          aria-label="Sort activities list"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="highest">Highest CO₂</option>
          <option value="lowest">Lowest CO₂</option>
        </select>
      </div>

      {/* Activities List Area */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-card p-6">
          <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-gray-700">No activities found</h4>
          <p className="text-xs text-gray-400 mt-1">
            {activities.length === 0
              ? "Record your first daily activity to populate your logs."
              : "Try adjusting your search query or category filters."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden border border-gray-100 rounded-card">
          {/* Desktop Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Activity Description</th>
                  <th className="py-3 px-4 text-right">Logged Value</th>
                  <th className="py-3 px-4 text-right">Emissions</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredActivities.map((act) => (
                  <tr key={act.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-medium text-gray-500">{formatDate(act.recordedAt)}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${categoryColorMap[act.category]}`}>
                        {act.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {getSubcategoryLabel(act.category, act.subcategory)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">
                      {act.quantity} {act.unit}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-gray-900">
                      {act.co2e.toLocaleString()} kg CO₂e
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => deleteActivity(act.id)}
                        className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition"
                        aria-label={`Delete activity logged on ${formatDate(act.recordedAt)}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile List Card View */}
          <div className="block sm:hidden divide-y divide-gray-100">
            {filteredActivities.map((act) => (
              <div key={act.id} className="p-4 flex justify-between items-center hover:bg-gray-50/50">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${categoryColorMap[act.category]}`}>
                      {act.category}
                    </span>
                    <span className="text-[10px] text-gray-400">{formatDate(act.recordedAt)}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 text-sm">{getSubcategoryLabel(act.category, act.subcategory)}</h4>
                  <p className="text-xs text-gray-500">Amount: {act.quantity} {act.unit}</p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900 text-sm">{act.co2e.toLocaleString()} kg</span>
                  <button
                    onClick={() => deleteActivity(act.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg"
                    aria-label="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
