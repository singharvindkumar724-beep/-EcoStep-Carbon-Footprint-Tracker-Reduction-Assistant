"use client";

import React, { useEffect, useState } from "react";
import { useEcoStore } from "@/store/useEcoStore";
import { calculateOnboardingScore } from "@/services/carbonCalculator";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";
import { Leaf } from "lucide-react";
import { SUSTAINABILITY_ACTIONS } from "@/data/actions";

export default function BreakdownCharts() {
  const { userProfile, actionsState } = useEcoStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!userProfile) return null;
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-card shadow-card p-6 h-80 border border-gray-100 animate-pulse" />
        <div className="bg-white rounded-card shadow-card p-6 h-80 border border-gray-100 animate-pulse" />
      </div>
    );
  }

  // 1. Calculate current breakdown
  const baseline = calculateOnboardingScore(userProfile);
  
  let foodSavings = 0;
  let travelSavings = 0;
  let energySavings = 0;
  let shoppingSavings = 0;

  Object.entries(actionsState).forEach(([actionId, status]) => {
    if (status === "completed") {
      const action = SUSTAINABILITY_ACTIONS.find((a) => a.id === actionId);
      if (action) {
        if (action.category === "food") foodSavings += action.co2Savings;
        if (action.category === "travel") travelSavings += action.co2Savings;
        if (action.category === "energy") energySavings += action.co2Savings;
        if (action.category === "shopping") shoppingSavings += action.co2Savings;
      }
    }
  });

  const currentFood = Math.max(0, baseline.food - foodSavings);
  const currentTravel = Math.max(0, baseline.travel - travelSavings);
  const currentEnergy = Math.max(0, baseline.energy - energySavings);
  const currentShopping = Math.max(0, baseline.shopping - shoppingSavings);
  const currentTotal = currentFood + currentTravel + currentEnergy + currentShopping;

  // Pie chart data
  const pieData = [
    { name: "Food", value: currentFood, color: "#F97316" },
    { name: "Travel", value: currentTravel, color: "#3B82F6" },
    { name: "Home Energy", value: currentEnergy, color: "#EAB308" },
    { name: "Shopping", value: currentShopping, color: "#A855F7" },
  ].filter((d) => d.value > 0);

  // Line chart trend data (4 weeks progression)
  const weeklyBaseline = Math.round(baseline.total / 52);
  const totalWeeklySavings = Math.round((foodSavings + travelSavings + energySavings + shoppingSavings) / 52);
  
  const lineData = [
    { week: "Week 1", Footprint: weeklyBaseline, Target: Math.round(weeklyBaseline * 0.9) },
    { week: "Week 2", Footprint: Math.round(weeklyBaseline - totalWeeklySavings * 0.3), Target: Math.round(weeklyBaseline * 0.9) },
    { week: "Week 3", Footprint: Math.round(weeklyBaseline - totalWeeklySavings * 0.7), Target: Math.round(weeklyBaseline * 0.9) },
    { week: "Week 4", Footprint: Math.max(0, Math.round(weeklyBaseline - totalWeeklySavings)), Target: Math.round(weeklyBaseline * 0.9) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 1. Category Breakdown Donut */}
      <div className="bg-white rounded-card shadow-card p-6 border border-gray-100 flex flex-col justify-between h-96">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Footprint Category Breakdown</h3>
          <p className="text-xs text-gray-500 mt-1">Real-time allocation of carbon emissions across lifestyle categories.</p>
        </div>

        <div className="h-56 relative flex items-center justify-center">
          {pieData.length === 0 ? (
            <div className="text-center text-xs text-gray-400">
              <Leaf className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <span>Zero emissions footprint detected! Excellent job.</span>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${(value as number).toLocaleString()} kg CO₂e`, "Emissions"]}
                  contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "11px" }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  iconSize={10} 
                  iconType="circle"
                  wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}

          {/* Inner total text overlay */}
          {pieData.length > 0 && (
            <div className="absolute text-center select-none pointer-events-none">
              <span className="block text-xl font-extrabold text-gray-900">
                {Math.round(currentTotal / 1000 * 10) / 10}t
              </span>
              <span className="block text-[8px] text-gray-400 font-bold uppercase tracking-wider">CO₂e/yr</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Reduction Trend Line */}
      <div className="bg-white rounded-card shadow-card p-6 border border-gray-100 flex flex-col justify-between h-96">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">Weekly Footprint Reduction Trend</h3>
          <p className="text-xs text-gray-500 mt-1">Progress timeline comparing current weekly footprint to Paris Accord 10% reduction targets.</p>
        </div>

        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineData}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
              <XAxis dataKey="week" stroke="#9CA3AF" style={{ fontSize: "10px", fontWeight: "bold" }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: "10px", fontWeight: "bold" }} />
              <Tooltip
                formatter={(value) => [`${(value as number).toLocaleString()} kg CO₂e`, ""]}
                contentStyle={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #E5E7EB", fontSize: "11px" }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconSize={10} 
                iconType="circle"
                wrapperStyle={{ fontSize: "10px", fontWeight: "bold" }}
              />
              <Line
                type="monotone"
                dataKey="Footprint"
                stroke="#16A34A"
                strokeWidth={3}
                activeDot={{ r: 6 }}
                name="Your Footprint"
              />
              <Line
                type="monotone"
                dataKey="Target"
                stroke="#EF4444"
                strokeDasharray="5 5"
                strokeWidth={1.5}
                dot={false}
                name="Paris Target (-10%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
