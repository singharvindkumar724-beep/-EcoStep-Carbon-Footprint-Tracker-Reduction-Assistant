"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEcoStore } from "@/store/useEcoStore";
import { calculateOnboardingScore } from "@/services/carbonCalculator";
import { COUNTRY_AVERAGES } from "@/data/emissionFactors";
import { Leaf, ArrowRight, CheckCircle2, TrendingDown, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function ResultsReveal() {
  const router = useRouter();
  const { userProfile } = useEcoStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (useEcoStore.persist.hasHydrated()) {
      setHydrated(true);
    } else {
      const unsub = useEcoStore.persist.onFinishHydration(() => {
        setHydrated(true);
      });
      return () => unsub();
    }
  }, []);

  useEffect(() => {
    if (hydrated && !userProfile) {
      router.push("/onboarding");
    }
  }, [userProfile, router, hydrated]);

  if (!hydrated || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-primary-green border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-semibold">Calculating your carbon score...</p>
        </div>
      </div>
    );
  }

  // Calculate scores
  const breakdown = calculateOnboardingScore(userProfile);
  const total = breakdown.total;

  // National averages benchmark
  const countryCode = userProfile.location;
  const countryAvg = COUNTRY_AVERAGES[countryCode] || COUNTRY_AVERAGES["Global"];
  
  // Calculate percentage difference
  const diffPercent = Math.round((Math.abs(total - countryAvg) / countryAvg) * 100);
  const isLower = total <= countryAvg;

  // Pie chart calculation helper
  const categories = [
    { name: "Food", value: breakdown.food, color: "#F97316", percentage: Math.round((breakdown.food / total) * 100) },
    { name: "Travel", value: breakdown.travel, color: "#3B82F6", percentage: Math.round((breakdown.travel / total) * 100) },
    { name: "Home Energy", value: breakdown.energy, color: "#EAB308", percentage: Math.round((breakdown.energy / total) * 100) },
    { name: "Shopping", value: breakdown.shopping, color: "#A855F7", percentage: Math.round((breakdown.shopping / total) * 100) },
  ].filter(c => c.value > 0);

  // SVG parameters for donut chart
  const radius = 70;
  const strokeWidth = 20;
  const circumference = 2 * Math.PI * radius;
  let accumulatedAngle = 0;

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gray-50 selection:bg-primary-light selection:text-primary-dark">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-primary-light text-primary-green rounded-lg">
              <Leaf className="w-5 h-5" />
            </span>
            <span className="font-bold text-lg text-gray-900">
              Eco<span className="text-primary-green">Step</span>
            </span>
          </div>
          <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-green-100 text-green-800 rounded-full font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Assessment Complete
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col justify-center">
        <div className="bg-white rounded-card shadow-card border border-gray-100 p-6 sm:p-8 md:p-12 space-y-10">
          
          {/* Main Title Banner */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
              Your Climate Footprint Reveal
            </h1>
            <p className="text-gray-500">
              Here is your estimated baseline annual carbon footprint based on your day-to-day choices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Score reveal card */}
            <div className="bg-gray-50 rounded-card p-6 sm:p-8 border border-gray-100 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-2">
                <p className="text-sm font-semibold tracking-wider text-gray-500 uppercase">Estimated Annual Impact</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-5xl sm:text-6xl font-bold text-primary-green tracking-tight">
                    {total.toLocaleString()}
                  </h2>
                  <span className="text-xl font-medium text-gray-500">kg CO₂e/yr</span>
                </div>
              </div>

              {/* Benchmark comparison card */}
              <div className={`p-4 rounded-btn border flex gap-3 items-start ${
                isLower 
                  ? "bg-green-50 border-green-200 text-green-900" 
                  : "bg-amber-50 border-amber-200 text-amber-900"
              }`}>
                {isLower ? (
                  <TrendingDown className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                ) : (
                  <TrendingUp className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <h3 className="font-bold text-sm leading-none mb-1">
                    {isLower ? "Below National Average" : "Above National Average"}
                  </h3>
                  <p className="text-xs leading-relaxed text-gray-600">
                    Your footprint is <span className="font-bold text-gray-900">{diffPercent}% {isLower ? "lower" : "higher"}</span> than the average for <span className="font-semibold">{countryCode}</span> ({countryAvg.toLocaleString()} kg CO₂e).
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                This baseline represents carbon equivalents from your daily diet, electricity, vehicle miles, flights, and shopping habits.
              </p>
            </div>

            {/* Custom SVG Donut Chart and legend */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 p-4">
              {/* Donut Chart SVG */}
              <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="transparent"
                    stroke="#F3F4F6"
                    strokeWidth={strokeWidth}
                  />
                  {categories.map((cat, idx) => {
                    const strokeDasharray = `${(cat.value / total) * circumference} ${circumference}`;
                    const strokeDashoffset = -accumulatedAngle;
                    accumulatedAngle += (cat.value / total) * circumference;

                    return (
                      <circle
                        key={idx}
                        cx="100"
                        cy="100"
                        r={radius}
                        fill="transparent"
                        stroke={cat.color}
                        strokeWidth={strokeWidth}
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-500"
                      />
                    );
                  })}
                </svg>

                {/* Inner center total */}
                <div className="absolute text-center">
                  <span className="block text-2xl font-bold text-gray-900">{Math.round(total/1000 * 10)/10}t</span>
                  <span className="block text-[10px] text-gray-400 font-semibold uppercase tracking-wider">CO₂e/yr</span>
                </div>
              </div>

              {/* Legend list */}
              <div className="space-y-3 w-full sm:w-auto">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Category Breakdown</h3>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-3">
                  {categories.map((cat, idx) => (
                    <div key={idx} className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }}></span>
                      <div>
                        <span className="block text-xs font-semibold text-gray-500 leading-none">{cat.name}</span>
                        <span className="block text-sm font-bold text-gray-900 mt-1">
                          {cat.value.toLocaleString()} kg <span className="text-[10px] text-gray-400 font-medium">({cat.percentage}%)</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Action CTA Block */}
          <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="font-bold text-gray-900 text-lg">Ready to lower your footprint?</h3>
              <p className="text-sm text-gray-500">
                Unlock your custom reduction action plan and start logging green habits daily.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-green hover:bg-primary-hover text-white font-semibold rounded-btn shadow-elevated"
              aria-label="Navigate to your personalization dashboard"
            >
              Unlock My Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

        </div>
      </main>

      {/* Info notice */}
      <footer className="py-4 text-center text-xs text-gray-400 bg-white border-t border-gray-200">
        <span>Powered by EcoStep Smart AI insight Engine.</span>
      </footer>
    </div>
  );
}
