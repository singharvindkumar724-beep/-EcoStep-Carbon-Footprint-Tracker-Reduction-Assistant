import { describe, it, expect } from "vitest";
import { POST } from "../route";
import { NextRequest } from "next/server";

describe("Chatbot API Route Integration", () => {
  it("should return simulated fallback responses for active transit actions when API key is missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "x-forwarded-for": "chat-ip-1",
      },
      body: JSON.stringify({
        message: "I biked to work today instead of driving!",
        history: [],
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
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.reply).toBeDefined();
    expect(body.reply).toContain("Fantastic decision!");
    expect(body.reply).toContain("1.9 kg of CO₂e");
  });

  it("should return simulated fallback responses for plant-based food choices", async () => {
    const request = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "x-forwarded-for": "chat-ip-2",
      },
      body: JSON.stringify({
        message: "I had a vegan burger for lunch.",
        history: [],
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
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.reply).toContain("Excellent choice!");
    expect(body.reply).toContain("3.2 kg of CO₂e");
  });

  it("should return 400 Bad Request if message is missing", async () => {
    const request = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      headers: {
        "x-forwarded-for": "chat-ip-3",
      },
      body: JSON.stringify({
        profile: {
          location: "US",
          householdSize: 2,
        },
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const body = await response.json();
    expect(body.error).toBe("Message and user profile are required context.");
  });
});
