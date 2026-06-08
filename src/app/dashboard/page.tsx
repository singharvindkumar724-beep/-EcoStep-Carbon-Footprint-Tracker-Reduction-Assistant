"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEcoStore } from "@/store/useEcoStore";
import KPIHeader from "@/components/dashboard/KPIHeader";
import ActivityLogger from "@/components/dashboard/ActivityLogger";
import ActivityHistory from "@/components/dashboard/ActivityHistory";
import AIInsightsSection from "@/components/insights/AIInsightsSection";
import ActionLibrarySection from "@/components/dashboard/ActionLibrarySection";
import { Leaf, LayoutDashboard, CalendarDays, Award, Settings, LogOut, ShieldAlert } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import ChatWidget from "@/components/dashboard/ChatWidget";

const BreakdownCharts = dynamic(() => import("@/components/charts/BreakdownCharts"), {
  ssr: false,
  loading: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
      <div className="bg-white rounded-card shadow-card p-6 h-96 border border-gray-100" />
      <div className="bg-white rounded-card shadow-card p-6 h-96 border border-gray-100" />
    </div>
  ),
});

const NAV_ITEMS = [
  { id: "home", label: "Dashboard", icon: LayoutDashboard },
  { id: "log", label: "Log Activities", icon: CalendarDays },
  { id: "actions", label: "Eco Actions", icon: Award },
  { id: "profile", label: "My Profile", icon: Settings },
] as const;

type TabId = typeof NAV_ITEMS[number]["id"];


export default function Dashboard() {
  const router = useRouter();
  const { userProfile, resetOnboarding } = useEcoStore();
  const [hydrated, setHydrated] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("home");

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
          <p className="text-gray-500 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Handle resets
  const handleReset = () => {
    if (confirm("Are you sure you want to reset your EcoStep profile? All logged activities and streaks will be cleared.")) {
      resetOnboarding();
      router.push("/onboarding");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 selection:bg-primary-light selection:text-primary-dark pb-20 md:pb-0">
      
      {/* 1. Desktop Sidebar Navigation */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-white border-r border-gray-200 p-6 shrink-0 sticky top-0 h-screen">
        <div className="space-y-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="EcoStep Home">
            <span className="p-1.5 bg-primary-light text-primary-green rounded-lg">
              <Leaf className="w-5 h-5" />
            </span>
            <span className="font-bold text-lg text-gray-900">
              Eco<span className="text-primary-green">Step</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="space-y-1" role="tablist" aria-label="Dashboard views">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  role="tab"
                  aria-selected={activeTab === item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-btn transition outline-none cursor-pointer ${
                    activeTab === item.id
                      ? "bg-primary-light text-primary-dark"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div>
          <button
            onClick={handleReset}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-btn text-red-600 hover:bg-red-50 hover:text-red-700 transition cursor-pointer"
            aria-label="Reset and clear profile data"
          >
            <LogOut className="w-4 h-4" /> Reset Profile
          </button>
        </div>
      </aside>

      {/* 2. Main content area */}
      <div className="flex-grow flex flex-col min-h-screen overflow-y-auto">
        {/* Top Header bar */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 sm:px-8 flex items-center justify-between sticky top-0 z-40">
          <h1 className="text-xl font-extrabold text-gray-900 capitalize tracking-tight">
            {activeTab === "home" ? "Climate Dashboard" : activeTab === "log" ? "Log Activities" : activeTab === "actions" ? "Action Library" : "Profile Details"}
          </h1>
          <div className="flex items-center gap-4 text-xs font-semibold text-gray-500">
            <span>Location: <strong>{userProfile.location}</strong></span>
            <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
            <span>Household size: <strong>{userProfile.householdSize}</strong></span>
          </div>
        </header>

        {/* Dynamic Inner Tab views */}
        <main className="flex-grow p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* TAB 1: Home Dashboard */}
          {activeTab === "home" && (
            <div className="space-y-8">
              {/* KPI metrics row */}
              <KPIHeader />

              {/* AI Insight section */}
              <AIInsightsSection />

              {/* Recharts section */}
              <BreakdownCharts />
            </div>
          )}

          {/* TAB 2: Logging and logs history */}
          {activeTab === "log" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="lg:col-span-1">
                <ActivityLogger />
              </div>
              <div className="lg:col-span-2">
                <ActivityHistory />
              </div>
            </div>
          )}

          {/* TAB 3: Sustainability Action database */}
          {activeTab === "actions" && (
            <ActionLibrarySection />
          )}

          {/* TAB 4: Profile Settings details */}
          {activeTab === "profile" && (
            <div className="bg-white rounded-card shadow-card p-6 sm:p-8 border border-gray-100 max-w-xl mx-auto space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 tracking-tight">Your Climate Profile</h3>
                <p className="text-xs text-gray-500">Review the onboarding baseline preferences driving your calculation estimates.</p>
              </div>

              <div className="divide-y divide-gray-100 text-sm">
                {[
                  { label: "Country/Region", val: userProfile.location },
                  { label: "Household Size", val: `${userProfile.householdSize} person(s)` },
                  { label: "Diet Preference", val: userProfile.dietType, isCapital: true },
                  { label: "Primary Transport Mode", val: userProfile.vehicleType.replace("_", " "), isCapital: true },
                  { label: "Weekly Driving Distance", val: `${userProfile.carDistanceWeekly} km` },
                  { label: "Flights per Year (Short/Long)", val: `${userProfile.flightShortDuration} short / ${userProfile.flightLongDuration} long` },
                  { label: "Electricity Grid Plan", val: userProfile.electricitySource.replace("_", " "), isCapital: true },
                  { label: "Heating Fuel Type", val: userProfile.heatingSource.replace("_", " "), isCapital: true },
                  { label: "Shopping Habits", val: userProfile.shoppingHabits, isCapital: true },
                ].map((row, idx) => (
                  <div key={idx} className="py-3.5 flex justify-between">
                    <span className="font-medium text-gray-500">{row.label}</span>
                    <strong className={`text-gray-900 font-bold ${row.isCapital ? "capitalize" : ""}`}>{row.val}</strong>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-btn p-4 flex gap-3 text-xs">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold mb-1">Reset Profile Data</h4>
                  <p className="text-gray-600 leading-relaxed">
                    If you wish to change your answers or recalculate your score, you can reset your profile. This clears all local IndexedDB logs, streaks, and started actions.
                  </p>
                  <button
                    onClick={handleReset}
                    className="mt-3 bg-white hover:bg-red-50 text-red-600 font-bold border border-red-200 hover:border-red-300 px-4 py-2 rounded-btn transition"
                  >
                    Reset & Recalculate Footprint
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* 3. Mobile Navigation Tab Bar (Fixed sticky bottom) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 h-16 flex items-center justify-around px-4 shadow-elevated">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full text-center outline-none ${
                activeTab === item.id ? "text-primary-green font-bold" : "text-gray-400 font-medium"
              }`}
              aria-label={`Open ${item.label} tab`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Chat widget */}
      <ChatWidget />

    </div>
  );
}
