import React from "react";
import { UserProfile } from "@/types";

export interface StepShoppingProps {
  flightShortDuration: number;
  setFlightShortDuration: (val: number) => void;
  flightLongDuration: number;
  setFlightLongDuration: (val: number) => void;
  shoppingHabits: UserProfile["shoppingHabits"];
  setShoppingHabits: (habits: UserProfile["shoppingHabits"]) => void;
}

export function StepShopping({
  flightShortDuration,
  setFlightShortDuration,
  flightLongDuration,
  setFlightLongDuration,
  shoppingHabits,
  setShoppingHabits,
}: StepShoppingProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          Flights and shopping behavior
        </h1>
        <p className="text-sm text-gray-600">
          High altitude air emissions and manufacturing of consumer goods represent your indirect global carbon load.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Annual flight count (single-leg segments)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="flightShort" className="block text-xs font-semibold text-gray-500 mb-1">
                Short Flights (under 3 hours)
              </label>
              <input
                type="number"
                id="flightShort"
                min="0"
                max="100"
                value={flightShortDuration}
                onChange={(e) => setFlightShortDuration(Math.max(0, parseInt(e.target.value) || 0))}
                className="block w-full h-12 px-3 border border-gray-300 rounded-input bg-white text-gray-900 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none"
              />
            </div>
            <div>
              <label htmlFor="flightLong" className="block text-xs font-semibold text-gray-500 mb-1">
                Long Flights (over 3 hours)
              </label>
              <input
                type="number"
                id="flightLong"
                min="0"
                max="100"
                value={flightLongDuration}
                onChange={(e) => setFlightLongDuration(Math.max(0, parseInt(e.target.value) || 0))}
                className="block w-full h-12 px-3 border border-gray-300 rounded-input bg-white text-gray-900 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            General shopping frequency
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Shopping habits Selection">
            {[
              { value: "minimal", label: "Minimalist", desc: "Rarely buy new items, prefer secondhand" },
              { value: "average", label: "Average", desc: "Regular clothing, tech, utility purchases" },
              { value: "frequent", label: "Frequent", desc: "Fast fashion, latest gadgets, regular deliveries" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setShoppingHabits(opt.value as UserProfile["shoppingHabits"])}
                className={`flex flex-col p-4 border rounded-card text-left transition ${
                  shoppingHabits === opt.value
                    ? "border-primary-green bg-primary-light/30 text-gray-900"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
                role="radio"
                aria-checked={shoppingHabits === opt.value}
              >
                <span className="font-bold text-sm leading-none mb-1">{opt.label}</span>
                <span className="text-[10px] text-gray-500 leading-tight">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
