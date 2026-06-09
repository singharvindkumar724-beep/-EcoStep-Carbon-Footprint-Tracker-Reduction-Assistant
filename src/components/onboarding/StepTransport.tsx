import React from "react";
import { UserProfile } from "@/types";

export interface StepTransportProps {
  vehicleType: UserProfile["vehicleType"];
  setVehicleType: (type: UserProfile["vehicleType"]) => void;
  carDistanceWeekly: number;
  setCarDistanceWeekly: (distance: number) => void;
}

export function StepTransport({
  vehicleType,
  setVehicleType,
  carDistanceWeekly,
  setCarDistanceWeekly,
}: StepTransportProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          How do you get around?
        </h1>
        <p className="text-sm text-gray-600">
          Transportation is often the largest single contributor to personal carbon footprint.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Primary mode of transport
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Transport Mode Selection">
            {[
              { value: "petrol_car", label: "Petrol / Diesel Car", desc: "Standard passenger vehicle" },
              { value: "electric_car", label: "Electric Vehicle (EV)", desc: "Low direct operational footprint" },
              { value: "public_transit", label: "Public Transit", desc: "Trains, subways, city buses" },
              { value: "bike_walk", label: "Bike / Walk", desc: "Zero direct emissions" },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setVehicleType(opt.value as UserProfile["vehicleType"])}
                className={`flex flex-col p-4 border rounded-card text-left transition ${
                  vehicleType === opt.value
                    ? "border-primary-green bg-primary-light/30 text-gray-900"
                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                }`}
                role="radio"
                aria-checked={vehicleType === opt.value}
              >
                <span className="font-bold text-sm">{opt.label}</span>
                <span className="text-xs text-gray-500 mt-1">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {vehicleType !== "bike_walk" && (
          <div className="space-y-2">
            <label htmlFor="carDistanceWeekly" className="block text-sm font-semibold text-gray-700">
              How many kilometers do you travel in a typical week?
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                id="carDistanceWeekly"
                min="0"
                max="1000"
                step="10"
                value={carDistanceWeekly}
                onChange={(e) => setCarDistanceWeekly(parseInt(e.target.value) || 0)}
                className="w-full accent-primary-green"
              />
              <span className="w-20 text-right font-bold text-gray-900 shrink-0">
                {carDistanceWeekly} km
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
