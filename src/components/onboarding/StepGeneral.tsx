import React from "react";

export interface StepGeneralProps {
  location: string;
  setLocation: (loc: string) => void;
  householdSize: number;
  setHouseholdSize: (size: number) => void;
}

export function StepGeneral({
  location,
  setLocation,
  householdSize,
  setHouseholdSize,
}: StepGeneralProps) {
  return (
    <div className="space-y-6 transition-opacity duration-300">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          {"Let's start with the basics"}
        </h1>
        <p className="text-sm text-gray-600">
          We use your location and household size to benchmark your energy grid and resource sharing averages.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
            Where do you live?
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="block w-full h-12 px-3 border border-gray-300 rounded-input bg-white text-gray-900 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none"
          >
            <option value="US">United States (US)</option>
            <option value="IN">India (IN)</option>
            <option value="UK">United Kingdom (UK)</option>
            <option value="DE">Germany (DE)</option>
            <option value="Global">Other / Global Average</option>
          </select>
        </div>

        <div>
          <label htmlFor="householdSize" className="block text-sm font-semibold text-gray-700 mb-2">
            How many people live in your household?
          </label>
          <div className="flex items-center gap-4">
            <input
              type="number"
              id="householdSize"
              min="1"
              max="20"
              value={householdSize}
              onChange={(e) => setHouseholdSize(Math.max(1, parseInt(e.target.value) || 1))}
              className="block w-24 h-12 px-3 border border-gray-300 rounded-input text-gray-900 focus:border-primary-green focus:ring-1 focus:ring-primary-green outline-none"
            />
            <span className="text-sm text-gray-500 font-medium">people (including you)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
