"use client";

import React, { useState, useEffect } from "react";
import { useEcoStore } from "@/store/useEcoStore";
import { LOGGING_FACTORS } from "@/data/emissionFactors";
import { PlusCircle, Info, Check } from "lucide-react";

interface FactorDetails {
  rate: number;
  unit: string;
  label: string;
}

export default function ActivityLogger() {
  const { logActivity } = useEcoStore();
  const [activeTab, setActiveTab] = useState<"food" | "travel" | "energy" | "shopping">("food");
  const [subcategory, setSubcategory] = useState("");
  const [quantity, setQuantity] = useState<number | "">("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [loggedDetails, setLoggedDetails] = useState("");

  // Setup default subcategory when tab changes
  useEffect(() => {
    const subs = Object.keys(LOGGING_FACTORS[activeTab]);
    if (subs.length > 0) {
      setSubcategory(subs[0]);
    }
    setQuantity("");
  }, [activeTab]);

  const activeCategoryFactors = LOGGING_FACTORS[activeTab] as Record<string, FactorDetails>;
  const currentFactorInfo = activeCategoryFactors[subcategory];
  const unit = currentFactorInfo?.unit || "";
  const label = currentFactorInfo?.label || "";
  const rate = currentFactorInfo?.rate || 0;

  // Auto-calculated preview
  const previewCo2 = quantity ? Number((Number(quantity) * rate).toFixed(2)) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subcategory || !quantity || Number(quantity) <= 0) return;

    logActivity({
      category: activeTab,
      subcategory,
      quantity: Number(quantity),
      unit,
    });

    setLoggedDetails(`${quantity} ${unit} of ${label} (${previewCo2} kg CO₂e)`);
    setQuantity("");
    setShowSuccess(true);
    
    // Hide success alert after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 4000);
  };

  return (
    <div className="bg-white rounded-card shadow-card p-6 border border-gray-100 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 tracking-tight">Quick Log Activity</h3>
        <p className="text-xs text-gray-500">Record daily consumption or green choices to update your scores instantly.</p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-gray-100" role="tablist" aria-label="Logging categories">
        {(["food", "travel", "energy", "shopping"] as const).map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`panel-${tab}`}
            id={`tab-${tab}`}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 text-center py-2.5 text-xs font-semibold uppercase tracking-wider border-b-2 transition outline-none ${
              activeTab === tab
                ? "border-primary-green text-primary-green"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`} className="space-y-4">
        
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-800 rounded-btn p-3 text-xs flex items-center gap-2 animate-fadeIn" role="alert">
            <Check className="w-4 h-4 text-green-600" />
            <span>Successfully logged: <strong className="text-gray-950">{loggedDetails}</strong>! Your score was updated.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Select Subcategory */}
            <div>
              <label htmlFor="log-subcategory" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                Activity Type
              </label>
              <select
                id="log-subcategory"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full h-12 px-3 border border-gray-300 rounded-input bg-white text-gray-900 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none text-sm"
              >
                {Object.entries(activeCategoryFactors).map(([key, details]) => (
                  <option key={key} value={key}>
                    {details.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Input Quantity */}
            <div>
              <label htmlFor="log-quantity" className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                Amount ({unit || "units"})
              </label>
              <input
                type="number"
                id="log-quantity"
                min="0.01"
                step="any"
                required
                placeholder={`Enter quantity in ${unit}`}
                value={quantity}
                onChange={(e) => {
                  const val = e.target.value;
                  setQuantity(val === "" ? "" : Number(val));
                }}
                className="w-full h-12 px-3 border border-gray-300 rounded-input text-gray-900 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none text-sm"
              />
            </div>
          </div>

          {/* Quick Info & Live Preview Area */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-gray-50 rounded-btn border border-gray-100 text-xs">
            <div className="flex gap-2 items-center text-gray-500">
              <Info className="w-4 h-4 text-gray-400 shrink-0" />
              <span>Factor rate: {rate} kg CO₂e per {unit.substring(0, unit.length - 1) || unit}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <span className="text-gray-500">Emissions preview:</span>
              <strong className="text-sm text-primary-green">{previewCo2} kg CO₂e</strong>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!quantity || Number(quantity) <= 0}
            className="w-full h-12 inline-flex items-center justify-center gap-2 bg-primary-green hover:bg-primary-hover disabled:bg-gray-100 disabled:text-gray-400 text-white font-semibold rounded-btn shadow-card text-sm cursor-pointer disabled:cursor-not-allowed"
          >
            <PlusCircle className="w-5 h-5" /> Log Activity
          </button>
        </form>

      </div>
    </div>
  );
}
