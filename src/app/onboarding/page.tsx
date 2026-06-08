"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEcoStore } from "@/store/useEcoStore";
import { UserProfile } from "@/types";
import { Leaf, ArrowRight, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";

export default function OnboardingQuiz() {
  const router = useRouter();
  const { onboardingProgress, setOnboardingProgress, completeOnboarding } = useEcoStore();
  const [step, setStep] = useState(1);

  // Local state for answers initialized from store (if exists) or defaults
  const [location, setLocation] = useState(onboardingProgress.location || "US");
  const [householdSize, setHouseholdSize] = useState(onboardingProgress.householdSize || 1);
  const [vehicleType, setVehicleType] = useState<UserProfile["vehicleType"]>(
    onboardingProgress.vehicleType || "petrol_car"
  );
  const [carDistanceWeekly, setCarDistanceWeekly] = useState(
    onboardingProgress.carDistanceWeekly !== undefined ? onboardingProgress.carDistanceWeekly : 100
  );
  const [dietType, setDietType] = useState<UserProfile["dietType"]>(
    onboardingProgress.dietType || "omnivore"
  );
  const [electricitySource, setElectricitySource] = useState<UserProfile["electricitySource"]>(
    onboardingProgress.electricitySource || "grid_electricity"
  );
  const [heatingSource, setHeatingSource] = useState<UserProfile["heatingSource"]>(
    onboardingProgress.heatingSource || "natural_gas"
  );
  const [shoppingHabits, setShoppingHabits] = useState<UserProfile["shoppingHabits"]>(
    onboardingProgress.shoppingHabits || "average"
  );
  const [flightShortDuration, setFlightShortDuration] = useState(
    onboardingProgress.flightShortDuration !== undefined ? onboardingProgress.flightShortDuration : 2
  );
  const [flightLongDuration, setFlightLongDuration] = useState(
    onboardingProgress.flightLongDuration !== undefined ? onboardingProgress.flightLongDuration : 0
  );

  const saveStepProgress = () => {
    setOnboardingProgress({
      location,
      householdSize,
      vehicleType,
      carDistanceWeekly,
      dietType,
      electricitySource,
      heatingSource,
      shoppingHabits,
      flightShortDuration,
      flightLongDuration,
    });
  };

  const handleNext = () => {
    saveStepProgress();
    if (step < 5) {
      setStep(step + 1);
    } else {
      // Completed last step, save user profile and navigate to results page
      const finalProfile: UserProfile = {
        location,
        householdSize: Number(householdSize),
        vehicleType,
        carDistanceWeekly: Number(carDistanceWeekly),
        dietType,
        electricitySource,
        heatingSource,
        shoppingHabits,
        flightShortDuration: Number(flightShortDuration),
        flightLongDuration: Number(flightLongDuration),
      };
      completeOnboarding(finalProfile);
      router.push("/onboarding/results");
    }
  };

  const handlePrev = () => {
    saveStepProgress();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // Progress Bar percentage
  const progressPercent = (step / 5) * 100;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 selection:bg-primary-light selection:text-primary-dark">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="EcoStep Home">
            <span className="p-1.5 bg-primary-light text-primary-green rounded-lg">
              <Leaf className="w-5 h-5" />
            </span>
            <span className="font-bold text-lg text-gray-900">
              Eco<span className="text-primary-green">Step</span>
            </span>
          </Link>
          <span className="text-sm text-gray-500 font-medium">Step {step} of 5</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-xl bg-white rounded-card shadow-card border border-gray-100 p-6 sm:p-8 space-y-6">
          
          {/* Progress Indicator bar */}
          <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden" aria-hidden="true">
            <div 
              className="bg-primary-green h-full rounded-full transition-all duration-300 ease-out" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Quiz Steps */}
          <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="space-y-6">
            
            {/* STEP 1: General Info */}
            {step === 1 && (
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
            )}

            {/* STEP 2: Transport */}
            {step === 2 && (
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
            )}

            {/* STEP 3: Diet */}
            {step === 3 && (
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
            )}

            {/* STEP 4: Home Energy */}
            {step === 4 && (
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
            )}

            {/* STEP 5: Flights & Shopping */}
            {step === 5 && (
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
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between border-t border-gray-100 pt-6">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-4 h-12 border border-gray-300 text-gray-700 font-semibold rounded-btn hover:bg-gray-50"
                  aria-label="Previous onboarding step"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-6 h-12 bg-primary-green hover:bg-primary-hover text-white font-semibold rounded-btn shadow-card"
                aria-label={step === 5 ? "Submit answers and get score" : "Next onboarding step"}
              >
                {step === 5 ? "Get My Score" : "Continue"} <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </form>
        </div>
      </main>

      {/* Info Notice */}
      <footer className="py-4 text-center text-xs text-gray-400 bg-white border-t border-gray-200">
        <div className="max-w-xl mx-auto px-4 flex items-center justify-center gap-1">
          <Info className="w-3.5 h-3.5" />
          <span>All calculation methodology estimates align with IPCC AR6 carbon equivalents.</span>
        </div>
      </footer>
    </div>
  );
}
