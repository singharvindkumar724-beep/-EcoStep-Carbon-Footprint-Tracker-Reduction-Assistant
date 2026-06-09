import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@google/generative-ai", () => {
  return {
    GoogleGenerativeAI: class {
      getGenerativeModel() {
        return {
          startChat: () => ({
            sendMessage: async () => ({
              response: { text: () => "Mock AI Response" }
            })
          })
        };
      }
    }
  };
});

describe("Chatbot API Route Integration", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return AI response when GEMINI_API_KEY is present", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    const { POST } = await import("../route");

    const request = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "x-forwarded-for": "chat-ip-0" },
      body: JSON.stringify({
        message: "Hello AI",
        history: [{ role: "user", content: "Hi" }],
        profile: { location: "US", householdSize: 2 }
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.reply).toBe("Mock AI Response");
  });

  it("should return simulated fallback responses for active transit actions when API key is missing", async () => {
    vi.stubEnv("GEMINI_API_KEY", "");
    const { POST } = await import("../route");
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
    vi.stubEnv("GEMINI_API_KEY", "");
    const { POST } = await import("../route");
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
    vi.stubEnv("GEMINI_API_KEY", "");
    const { POST } = await import("../route");
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

  it("should gracefully handle Gemini errors via fallback when API key is present", async () => {
    vi.stubEnv("GEMINI_API_KEY", "test-key");
    vi.doMock("@google/generative-ai", () => {
      return {
        GoogleGenerativeAI: class {
          getGenerativeModel() {
            return {
              startChat: () => {
                throw new Error("Simulated SDK Error");
              }
            };
          }
        }
      };
    });
    
    vi.resetModules();
    const { POST } = await import("../route");

    const request = new NextRequest("http://localhost:3000/api/chat", {
      method: "POST",
      headers: { "x-forwarded-for": "chat-ip-error" },
      body: JSON.stringify({
        message: "I walked to work",
        history: [],
        profile: { location: "US", householdSize: 2 }
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.reply).toContain("Fantastic decision!");
    
    vi.doUnmock("@google/generative-ai");
  });
});
