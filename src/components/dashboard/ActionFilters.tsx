"use client";

import React from "react";
import { Search } from "lucide-react";

interface ActionFiltersProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  categoryFilter: string;
  setCategoryFilter: (val: string) => void;
}

export default function ActionFilters({
  searchQuery,
  setSearchQuery,
  categoryFilter,
  setCategoryFilter,
}: ActionFiltersProps) {
  const categories = [
    { value: "all", label: "All" },
    { value: "food", label: "Food" },
    { value: "travel", label: "Travel" },
    { value: "energy", label: "Energy" },
    { value: "shopping", label: "Shopping" },
  ];

  return (
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
        {categories.map((cat) => (
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
  );
}
