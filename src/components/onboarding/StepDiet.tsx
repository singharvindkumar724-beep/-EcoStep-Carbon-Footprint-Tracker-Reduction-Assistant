import React from "react";
import { UserProfile } from "@/types";

export interface StepDietProps {
  dietType: UserProfile["dietType"];
  setDietType: (type: UserProfile["dietType"]) => void;
}

export function StepDiet({ dietType, setDietType }: StepDietProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          What are your eating habits?
        </h1>
        <p className="text-sm text-gray-600">
          Animal agriculture drives significant carbon, methane, and resource-intensive emissions.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Diet Selection">
          {[
            { value: "omnivore", label: "Omnivore", desc: "Frequent poultry, fish, and red meat meals" },
            { value: "flexitarian", label: "Flexitarian", desc: "Reduced meat consumption, plant-focused" },
            { value: "vegetarian", label: "Vegetarian", desc: "Dairy/eggs, but zero seafood or meat" },
            { value: "vegan", label: "Vegan", desc: "100% plant-based diet, no animal products" },
          ].map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDietType(opt.value as UserProfile["dietType"])}
              className={`flex flex-col p-4 border rounded-card text-left transition ${
                dietType === opt.value
                  ? "border-primary-green bg-primary-light/30 text-gray-900"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
              role="radio"
              aria-checked={dietType === opt.value}
            >
              <span className="font-bold text-sm">{opt.label}</span>
              <span className="text-xs text-gray-500 mt-1">{opt.desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
