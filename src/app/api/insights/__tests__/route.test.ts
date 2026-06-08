import { describe, it, expect, vi } from "vitest";
import { POST } from "../route";
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

describe("Insights API Route Integration", () => {
  it("should return recommendations using local fallback engine when API key is missing", async () => {
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
});
