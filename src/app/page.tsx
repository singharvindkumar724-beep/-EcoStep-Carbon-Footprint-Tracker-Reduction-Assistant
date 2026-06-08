import Link from "next/link";
import { Leaf, Flame, Sparkles, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import React from "react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 selection:bg-primary-light selection:text-primary-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2" aria-label="EcoStep Home">
            <span className="p-2 bg-primary-light text-primary-green rounded-xl">
              <Leaf className="w-6 h-6" />
            </span>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              Eco<span className="text-primary-green">Step</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-primary-green">Features</a>
            <a href="#how-it-works" className="hover:text-primary-green">How It Works</a>
            <a href="#insights-preview" className="hover:text-primary-green">AI Insights</a>
          </nav>

          <div>
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-primary-green text-white font-medium rounded-btn hover:bg-primary-hover shadow-card text-sm"
              aria-label="Start carbon score quiz"
            >
              Get My Score
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 sm:pt-24 lg:pt-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-light text-primary-green text-xs font-semibold rounded-full mb-6">
                  <Sparkles className="w-3.5 h-3.5" /> Empowering Individual Climate Action
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-none mb-6">
                  Know your footprint, <br />
                  <span className="text-primary-green">reduce it with AI.</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8 max-w-lg sm:mx-auto lg:mx-0">
                  Estimate your personal annual CO₂ footprint in less than 5 minutes. No sign-up required. Receive custom AI recommendations, track daily habits, and build eco-friendly streaks.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/onboarding"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-green hover:bg-primary-hover text-white font-semibold rounded-btn shadow-elevated text-base"
                    aria-label="Get started with carbon footprint onboarding"
                  >
                    Start Free Footprint Quiz <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
                <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-primary-green" /> No registration required</span>
                  <span className="flex items-center gap-1"><Zap className="w-4 h-4 text-primary-green" /> First AI tip under 5 mins</span>
                </div>
              </div>

              {/* Graphic Mockup Area */}
              <div className="mt-12 sm:mt-16 lg:mt-0 lg:col-span-6 relative">
                <div className="relative mx-auto w-full max-w-md lg:max-w-none">
                  <div className="bg-white rounded-card shadow-elevated border border-gray-100 p-6 sm:p-8 space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                      <div>
                        <p className="text-xs text-gray-400 font-semibold tracking-wider uppercase">Your Estimated Footprint</p>
                        <h2 className="text-3xl font-bold text-gray-900">4,280 kg <span className="text-xs text-gray-500 font-normal">CO₂e/yr</span></h2>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                        Average
                      </span>
                    </div>

                    {/* Simple Mock Charts/Progress */}
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">🚗 Travel</span>
                          <span className="text-gray-500 font-medium">1,820 kg (42%)</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: "42%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">🍔 Food</span>
                          <span className="text-gray-500 font-medium">1,210 kg (28%)</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: "28%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-gray-700">⚡ Home Energy</span>
                          <span className="text-gray-500 font-medium">850 kg (20%)</span>
                        </div>
                        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                      </div>
                    </div>

                    {/* Mock Coach Card */}
                    <div className="bg-primary-light border border-primary-green/20 rounded-btn p-4 flex gap-3 items-start">
                      <Sparkles className="w-5 h-5 text-primary-green shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-primary-dark">AI Coach Suggestion</h4>
                        <p className="text-xs text-primary-dark/80 mt-1">
                          {"\"Swapping two beef meals for plant-based ones weekly will cut your food emissions by 340 kg CO₂e this year.\""}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="features" className="py-16 sm:py-24 bg-white border-t border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
                A simple, positive approach to climate action.
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                {"Reducing carbon shouldn't feel like a chore. We help you focus on small, compounding improvements rather than guilt."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-gray-50 rounded-card border border-gray-100">
                <div className="w-12 h-12 bg-primary-light text-primary-green rounded-xl flex items-center justify-center mb-6">
                  <Leaf className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">5-Minute Assessment</h3>
                <p className="text-gray-600">
                  Easy, conversational questions capture location, travel, household energy, diet, and shopping to determine your baseline.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-card border border-gray-100">
                <div className="w-12 h-12 bg-primary-light text-primary-green rounded-xl flex items-center justify-center mb-6">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Carbon Coach</h3>
                <p className="text-gray-600">
                  Google Gemini matches actions to your specific high-emission areas, providing actionable instructions instead of generic advice.
                </p>
              </div>

              <div className="p-6 bg-gray-50 rounded-card border border-gray-100">
                <div className="w-12 h-12 bg-primary-light text-primary-green rounded-xl flex items-center justify-center mb-6">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Habit Streaks</h3>
                <p className="text-gray-600">
                  Log actions daily and track continuous streaks. Watch your carbon score decrease in real-time as sustainability becomes secondary nature.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight sm:text-4xl">
                Get started in 3 simple steps
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="text-center relative">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary-green text-white font-bold flex items-center justify-center text-lg mb-6 shadow-card">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Take the Quiz</h3>
                <p className="text-gray-600 max-w-xs mx-auto">Answer easy questions about your transportation, home heating, diet, and flights.</p>
              </div>

              <div className="text-center relative">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary-green text-white font-bold flex items-center justify-center text-lg mb-6 shadow-card">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Your Dashboard</h3>
                <p className="text-gray-600 max-w-xs mx-auto">See your footprint categories and read your personalized AI coach insights instantly.</p>
              </div>

              <div className="text-center relative">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary-green text-white font-bold flex items-center justify-center text-lg mb-6 shadow-card">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Log Daily Actions</h3>
                <p className="text-gray-600 max-w-xs mx-auto">Update your dashboard by tracking trips, meals, and green habits. Watch your streak build!</p>
              </div>
            </div>
          </div>
        </section>

        {/* AI Insights Preview */}
        <section id="insights-preview" className="py-16 sm:py-24 bg-primary-dark text-white rounded-t-[40px] sm:rounded-t-[60px]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-5 mb-10 lg:mb-0">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-primary-light text-xs font-semibold rounded-full mb-6">
                  <Sparkles className="w-3.5 h-3.5" /> Dynamic Recommendation Pipeline
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
                  Smart AI recommendations designed around your lifestyle.
                </h2>
                <p className="text-primary-light/80 text-lg mb-8">
                  EcoStep does not generate generic suggestions. Our engine prioritizes custom actions based on:
                </p>
                <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-white/10 text-primary-light flex items-center justify-center text-sm font-semibold mt-0.5">✓</span>
                    <div>
                      <strong className="text-white">Emission Impact:</strong> Focus on what moves the needle most.
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-white/10 text-primary-light flex items-center justify-center text-sm font-semibold mt-0.5">✓</span>
                    <div>
                      <strong className="text-white">Relevance:</strong> Targeted to your household size, vehicle type, and location.
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <span className="w-6 h-6 rounded-full bg-white/10 text-primary-light flex items-center justify-center text-sm font-semibold mt-0.5">✓</span>
                    <div>
                      <strong className="text-white">Feasibility:</strong> Structured by difficulty and potential cost-savings.
                    </div>
                  </li>
                </ul>
              </div>

              <div className="lg:col-span-7 bg-white/5 border border-white/10 rounded-card p-6 sm:p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-light/10 text-primary-light rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">AI Recommendation Engine</h3>
                    <p className="text-xs text-white/60">Structured prompt & responses powered by Gemini</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm text-white/80">
                  <div className="p-4 bg-white/5 rounded-btn border border-white/10">
                    <h4 className="font-semibold text-white mb-1">🌱 Switch to a hybrid/electric vehicle or carpool</h4>
                    <p className="text-xs mb-2">CO₂ Savings: <span className="text-primary-light font-bold">1,200 kg / year</span> | Difficulty: Medium</p>
                    <p className="text-xs text-white/70">{"\"Since commuting by car accounts for 42% of your footprint, reducing single-driver miles will yield the highest return.\""}</p>
                  </div>

                  <div className="p-4 bg-white/5 rounded-btn border border-white/10">
                    <h4 className="font-semibold text-white mb-1">🥬 Incorporate Plant-Based Meals 3 Days/Week</h4>
                    <p className="text-xs mb-2">CO₂ Savings: <span className="text-primary-light font-bold">450 kg / year</span> | Difficulty: Easy</p>
                    <p className="text-xs text-white/70">{"\"Transitioning some meals to vegan alternatives will drastically offset your omnivore footprint with minimal daily friction.\""}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-primary-light text-primary-green rounded-lg">
              <Leaf className="w-5 h-5" />
            </span>
            <span className="font-bold text-lg text-gray-900">
              Eco<span className="text-primary-green">Step</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EcoStep. Hackathon Edition. All calculations are estimated.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#features" className="hover:text-primary-green">Features</a>
            <a href="#how-it-works" className="hover:text-primary-green">How It Works</a>
            <a href="/onboarding" className="hover:text-primary-green font-semibold">Start Quiz</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
