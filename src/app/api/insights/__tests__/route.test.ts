import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

// Mock the ranking engine to avoid dealing with standard actions list database in test
vi.mock("@/services/rankingEngine", () => ({
  rankSustainabilityActions: () => [
    {
      id: "test_action",
      category: "food",
      title: "Test Carbon Swap Action",
      description: "A test action",
      co2Savings: 250,
      difficulty: "easy",
      costImpact: "saving",
      rankScore: 150,
    },
  ],
}));

vi.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          generateContent: async () => ({
            response: { 
              text: () => JSON.stringify({
                recommendations: [{
                  id: "ai_action",
                  category: "travel",
                  title: "AI Action",
                  description: "AI description",
                  co2Savings: 500,
                  difficulty: "medium",
                  costImpact: "neutral",
                  reasoning: "AI reasoning",
                  implementationSteps: []
                }]
              })
            }
          })
        };
      }
    }
  };
});

describe("Insights API Route Integration", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return AI recommendations when GEMINI_API_KEY is present", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const { POST } = await import("../route");

    const request = new NextRequest("http://localhost:3000/api/insights", {
      method: "POST",
      headers: { "x-forwarded-for": "test-ip-0" },
      body: JSON.stringify({
        profile: {
          location: "US", householdSize: 2, dietType: "omnivore", vehicleType: "petrol_car",
          carDistanceWeekly: 100, flightShortDuration: 1, flightLongDuration: 0,
          electricitySource: "grid_electricity", heatingSource: "natural_gas", shoppingHabits: "average"
        },
        activities: [],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.recommendations).toBeDefined();
    expect(body.recommendations.length).toBe(1);
    expect(body.recommendations[0].id).toBe("ai_action");
    expect(body.recommendations[0].title).toBe("AI Action");
  });

  it("should return recommendations using local fallback engine when API key is missing", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    const { POST } = await import("../route");
    const request = new NextRequest("http://localhost:3000/api/insights", {
      method: "POST",
      headers: {
        "x-forwarded-for": "test-ip-1",
      },
      body: JSON.stringify({
        profile: {
          location: "US",
          householdSize: 2,
          dietType: "omnivore",
          vehicleType: "petrol_car",
          carDistanceWeekly: 100,
          flightShortDuration: 1,
          flightLongDuration: 0,
          electricitySource: "grid_electricity",
          heatingSource: "natural_gas",
          shoppingHabits: "average",
        },
        activities: [],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.recommendations).toBeDefined();
    expect(body.recommendations.length).toBe(1);
    expect(body.recommendations[0].id).toBe("test_action");
    expect(body.recommendations[0].co2Savings).toBe(250);
  });

  it("should return 400 Bad Request if profile context is missing", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    const { POST } = await import("../route");
    const request = new NextRequest("http://localhost:3000/api/insights", {
      method: "POST",
      headers: {
        "x-forwarded-for": "test-ip-2",
      },
      body: JSON.stringify({
        activities: [],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toBe("User profile context is required");
  });

  it("should gracefully handle Gemini errors via fallback", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.doMock("@google/generative-ai", () => {
      return {
        GoogleGenerativeAI: class {
          getGenerativeModel() {
            return {
              generateContent: () => {
                throw new Error("Simulated API Error");
              }
            };
          }
        }
      };
    });

    vi.resetModules();
    const { POST } = await import("../route");

    const request = new NextRequest("http://localhost:3000/api/insights", {
      method: "POST",
      headers: { "x-forwarded-for": "test-ip-3" },
      body: JSON.stringify({
        profile: {
          location: "US", householdSize: 2, dietType: "omnivore", vehicleType: "petrol_car",
          carDistanceWeekly: 100, flightShortDuration: 1, flightLongDuration: 0,
          electricitySource: "grid_electricity", heatingSource: "natural_gas", shoppingHabits: "average"
        },
        activities: [],
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.recommendations).toBeDefined();
    expect(body.recommendations.length).toBe(1);
    expect(body.recommendations[0].id).toBe("test_action");
    expect(body.recommendations[0].reasoning).toContain("Recommended by local Carbon Engine");

    vi.doUnmock("@google/generative-ai");
  });
});
