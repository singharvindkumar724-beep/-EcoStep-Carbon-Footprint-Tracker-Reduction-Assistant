# EcoStep — Carbon Footprint Tracker & Reduction Assistant

EcoStep is a consumer-friendly climate companion designed to help individuals understand, track, and reduce their personal carbon footprints. Rather than fostering eco-anxiety or guilt, EcoStep positions itself as an intelligent, optimistic climate coach.

**Live Demo:** [https://project3-lilac-xi.vercel.app](https://project3-lilac-xi.vercel.app)

---

## 🌟 Key Features

1. **5-Step Onboarding Quiz**: A conversational, frictionless quiz capturing location, household size, transport, diet, home energy, and shopping habits to compute a baseline carbon score in under 5 minutes.
2. **Personalized Carbon Engine**: Evaluates baseline emissions across four core lifestyle categories (Food, Travel, Home Energy, Shopping) benchmarking results against national averages.
3. **AI Climate Coach (Gemini integration)**: Generates hyper-personalized reduction insights matching the user's high-emission activities. Automatically falls back to a smart local ranking algorithm if the Gemini API key is missing.
4. **Interactive Action Library**: Searchable and filterable database of 50+ sustainability habits, dynamically ranked using the formula:  
   $$\text{Rank Score} = \text{Impact} \times \text{Relevance} \times \text{Feasibility}$$
5. **Activity Log & History**: Allows daily logging of green choices and consumption metrics. Shows full historical lists with filtering, sorting, searching, and entry deletion.
6. **Habit Streak Engine**: Tracks daily log activity, motivating consistency with gamified active/best streaks.
7. **Custom Goal Tracking**: Users can create personalized carbon reduction goals, set target reduction amounts, and visualize progress dynamically towards their objectives.
8. **PWA Support**: Support for offline access, dynamic cache optimization, and desktop/mobile install prompt configuration.

---

## 🛠️ Tech Stack & Design System

* **Core Framework**: Next.js 15 (App Router), React 19, TypeScript
* **State Management**: Zustand 5 + custom `idb-keyval` persistence layer syncing state asynchronously to browser **IndexedDB**.
* **Visual Data**: Recharts 3 for interactive footprint category breakdown (Donut) and reduction trend charts (Line chart benchmarking against Paris Accord 10% targets).
* **Styling**: Tailwind CSS 4 with custom design tokens (Eco Green palette, curved border radiuses: `12px` inputs, `20px` cards, and `24px` modal dialogs).
* **AI Engine**: Google Gemini API via `@google/generative-ai` SDK.
* **Testing**: Vitest + JSDOM for unit and integration testing.

---

## 📁 Folder Structure

```text
src/
├── app/                  # Next.js Routes
│   ├── api/insights/     # AI Recommendation API route
│   ├── dashboard/        # Main interactive workspace
│   ├── onboarding/       # Conversational quiz & results reveal screens
│   ├── globals.css       # Design system tokens and tailwind styling
│   └── layout.tsx        # HTML metadata and PWA registration
├── components/           # UI Components
│   ├── ui/               # Modular elements
│   ├── charts/           # Breakdown and Trend Recharts wrappers
│   ├── dashboard/        # Logger, history log, actions, and KPI panels
│   └── insights/         # AI Insights and coaching cards
├── services/             # Core engines
│   ├── carbonCalculator.ts  # Emission formulas
│   └── rankingEngine.ts     # Personalized priority algorithms
├── store/                # Zustand State
│   └── useEcoStore.ts    # Store persistent layer
└── types/                # TypeScript Interfaces
```

---

## 🚀 Setup & Local Running

### 1. Clone & Install Dependencies
Ensure you have Node.js 18+ installed on your machine.
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the project root to integrate Google Gemini:
```env
GEMINI_API_KEY=your_gemini_api_key_here
```
*(If no API key is set, the system seamlessly triggers a local ranking calculation fallback.)*

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

The testing suite utilizes `Vitest` to run calculations, store actions, and API integrations in a JSDOM environment. The project proudly maintains **100% test coverage** for its core business logic, store functionality, ranking algorithms, and API fallback layers.

Run the test suite:
```bash
npm run test
```

Run test coverage reports:
```bash
npx vitest run --coverage
```

Build the optimized production app:
```bash
npm run build
```

---

## ♿ Accessibility & PWA Integration

* **WCAG 2.1 AA Compliance**: Complete semantic tag structure, focus outlines (`*:focus-visible`), and ARIA descriptions. Keyboard-friendly details dialogs dismissible using the `Escape` key, backed by intelligent **Focus Traps** for seamless screen-reader experiences.
* **PWA Installability**: Serves assets via custom offline caching service worker [sw.js](file:///c:/KRISH/PROGRAMMING/project_3/public/sw.js) and includes install configurations in [manifest.json](file:///c:/KRISH/PROGRAMMING/project_3/public/manifest.json).
