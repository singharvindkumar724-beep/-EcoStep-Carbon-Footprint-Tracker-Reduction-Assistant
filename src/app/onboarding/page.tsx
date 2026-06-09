"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useEcoStore } from "@/store/useEcoStore";
import { UserProfile } from "@/types";
import { Leaf, ArrowRight, ArrowLeft, Info } from "lucide-react";
import Link from "next/link";
import { StepGeneral } from "@/components/onboarding/StepGeneral";
import { StepTransport } from "@/components/onboarding/StepTransport";
import { StepDiet } from "@/components/onboarding/StepDiet";
import { StepEnergy } from "@/components/onboarding/StepEnergy";
import { StepShopping } from "@/components/onboarding/StepShopping";

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
            
            {step === 1 && (
              <StepGeneral
                location={location}
                setLocation={setLocation}
                householdSize={householdSize}
                setHouseholdSize={setHouseholdSize}
              />
            )}

            {step === 2 && (
              <StepTransport
                vehicleType={vehicleType}
                setVehicleType={setVehicleType}
                carDistanceWeekly={carDistanceWeekly}
                setCarDistanceWeekly={setCarDistanceWeekly}
              />
            )}

            {step === 3 && (
              <StepDiet
                dietType={dietType}
                setDietType={setDietType}
              />
            )}

            {step === 4 && (
              <StepEnergy
                electricitySource={electricitySource}
                setElectricitySource={setElectricitySource}
                heatingSource={heatingSource}
                setHeatingSource={setHeatingSource}
              />
            )}

            {step === 5 && (
              <StepShopping
                flightShortDuration={flightShortDuration}
                setFlightShortDuration={setFlightShortDuration}
                flightLongDuration={flightLongDuration}
                setFlightLongDuration={setFlightLongDuration}
                shoppingHabits={shoppingHabits}
                setShoppingHabits={setShoppingHabits}
              />
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
