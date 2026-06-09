import React from "react";
import { UserProfile } from "@/types";

export interface StepEnergyProps {
  electricitySource: UserProfile["electricitySource"];
  setElectricitySource: (src: UserProfile["electricitySource"]) => void;
  heatingSource: UserProfile["heatingSource"];
  setHeatingSource: (src: UserProfile["heatingSource"]) => void;
}

export function StepEnergy({
  electricitySource,
  setElectricitySource,
  heatingSource,
  setHeatingSource,
}: StepEnergyProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          How is your home powered?
        </h1>
        <p className="text-sm text-gray-600">
          Residential electricity grids and space heating fuels contribute strongly to local emissions.
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Electricity source
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3" role="radiogroup" aria-label="Electricity Source Selection">
            {[
              { value: "grid_electricity", label: "Standard Grid", desc: "Fossil / Coal fuels" },
              { value: "mixed", label: "Mixed Grid", desc: "Nuclear, Hydro, Solar" },
              { value: "renewable_electricity", label: "100% Green", desc: "Solar, wind, clean tags" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setElectricitySource(opt.value as UserProfile["electricitySource"])}
                className={`flex flex-col p-4 border rounded-card text-left transition ${
                  electricitySource === opt.value
                    ? "border-primary-green bg-primary-light/30 text-gray-900"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
                role="radio"
                aria-checked={electricitySource === opt.value}
              >
                <span className="font-bold text-sm leading-none mb-1">{opt.label}</span>
                <span className="text-[10px] text-gray-500 leading-tight">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Heating / Thermal energy source
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Heating Source Selection">
            {[
              { value: "natural_gas", label: "Natural Gas / Boiler", desc: "Fossil gas grid connection" },
              { value: "electric_heating", label: "Electric / Heat Pump", desc: "Grid-powered electric warmth" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setHeatingSource(opt.value as UserProfile["heatingSource"])}
                className={`flex flex-col p-4 border rounded-card text-left transition ${
                  heatingSource === opt.value
                    ? "border-primary-green bg-primary-light/30 text-gray-900"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
                role="radio"
                aria-checked={heatingSource === opt.value}
              >
                <span className="font-bold text-sm">{opt.label}</span>
                <span className="text-xs text-gray-500 mt-1">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
