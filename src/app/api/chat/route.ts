import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Rate limiting cache
interface RateLimitInfo {
  count: number;
  resetTime: number;
}
const ipCache = new Map<string, RateLimitInfo>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 30;

export async function POST(req: NextRequest) {
  let parsedMessage = "";
  let parsedProfile: { location?: string; householdSize?: number } | null = null;
  
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();
    let limitInfo = ipCache.get(ip);
    if (!limitInfo || now > limitInfo.resetTime) {
      limitInfo = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
      ipCache.set(ip, limitInfo);
    } else {
      if (limitInfo.count >= MAX_REQUESTS_PER_WINDOW) {
        return NextResponse.json(
          { error: "Too many requests. Please slow down." },
          { status: 429 }
        );
      }
      limitInfo.count++;
    }

    // 2. Parse Request
    const body = await req.json();
    const { message, history, profile } = body;
    parsedMessage = message;
    parsedProfile = profile;

    if (!message || !profile) {
      return NextResponse.json(
        { error: "Message and user profile are required context." },
        { status: 400 }
      );
    }

    // 3. Smart local fallback if Gemini is not set up
    if (!genAI) {
      console.log("No GEMINI_API_KEY set. Falling back to local chat simulator.");
      
      const cleanMessage = message.toLowerCase();
      let reply = "";

      if (cleanMessage.includes("bike") || cleanMessage.includes("walk") || cleanMessage.includes("bus") || cleanMessage.includes("train")) {
        reply = `**Fantastic decision!** Choosing active transit or public transit cuts direct emissions. Replacing a typical 10 km car drive with biking saves about **1.9 kg of CO₂e**! Keep up the amazing habit! 🚲`;
      } else if (cleanMessage.includes("meat") || cleanMessage.includes("vegan") || cleanMessage.includes("vegetarian") || cleanMessage.includes("plant-based")) {
        reply = `**Excellent choice!** Food accounts for a significant portion of our carbon footprint. Swapping beef for a plant-based alternative saves roughly **3.2 kg of CO₂e** per meal. That represents a huge annual saving if done consistently! 🥗`;
      } else if (cleanMessage.includes("solar") || cleanMessage.includes("heat") || cleanMessage.includes("led") || cleanMessage.includes("thermostat")) {
        reply = `**Smart home optimization!** Home heating and grid electricity represent major footprint areas. Turning down the thermostat by just 1°C can save up to **10%** on your heating emissions annually. Great job focusing on home energy efficiency! ⚡`;
      } else if (cleanMessage.includes("buy") || cleanMessage.includes("shop") || cleanMessage.includes("minimal") || cleanMessage.includes("secondhand")) {
        reply = `**Wonderful minimalist choice!** Choosing secondhand goods or repairing old items prevents manufacturing emissions. Every new item avoided saves around **5-20 kg of CO₂e** depending on raw materials. Thank you for voting for circular consumption! 🛍️`;
      } else {
        reply = `Hello! I'm your **EcoStep Climate Coach**. 🌿 

Based on your profile (Location: **${profile.location}**, Household size: **${profile.householdSize}**), you can make a major impact by:
* Reducing high-impact meals (e.g. switching to plant-based days).
* Adjusting daily vehicle trips (e.g. walking/biking short distances).
* Optimizing home heating and electronics.

Tell me about a green action you took today, or ask me about the carbon impact of a specific habit!`;
      }

      return NextResponse.json({ reply });
    }

    // 4. Gemini Generative AI Chat Integration
    // gemini-2.0-flash-lite has a generous free-tier quota (1500 req/day)
    const systemInstructionText = `You are a warm, extremely supportive, and encouraging personal Climate Coach at EcoStep.
The user's current baseline profile:
- Location: ${profile.location}
- Household Size: ${profile.householdSize}
- Diet Type: ${profile.dietType}
- Transportation Mode: ${profile.vehicleType} (weekly driving: ${profile.carDistanceWeekly} km)
- Annual Flights: ${profile.flightShortDuration} short / ${profile.flightLongDuration} long
- Electricity Source: ${profile.electricitySource}
- Heating Fuel: ${profile.heatingSource}
- Shopping Habits: ${profile.shoppingHabits}

Your Task:
1. Help the user evaluate the carbon emissions of actions they describe.
2. Recommend solutions, green swaps, or alternative ways to achieve the same result.
3. Warmly appreciate and congratulate the user if they share positive habits or green actions.
4. Keep replies concise (3-4 sentences max), positive, motivating, and beautifully formatted in markdown.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-lite",
      // systemInstruction must be a Content object, not a plain string
      systemInstruction: { role: "system", parts: [{ text: systemInstructionText }] },
    });

    // Format chat history to comply with Gemini API spec
    // [{ role: "user" | "model", parts: [{ text: string }] }]
    const formattedHistory = Array.isArray(history)
      ? history.map((h: { role: string; content: string }) => ({
          role: h.role === "assistant" ? "model" : "user",
          parts: [{ text: h.content }],
        }))
      : [];

    const chat = model.startChat({ history: formattedHistory });

    const aiResult = await chat.sendMessage(message);
    const replyText = aiResult.response.text();

    return NextResponse.json({ reply: replyText });

  } catch (err: unknown) {
    console.error("Gemini Chat API Error:", err instanceof Error ? err.message : err);
    // Graceful fallback — always give the user a local response rather than a 500
    const msg = parsedMessage || "";
    const prof = parsedProfile;
    const clean = msg.toLowerCase();
    let fallbackReply = "";
    if (clean.includes("bike") || clean.includes("walk") || clean.includes("bus") || clean.includes("train")) {
      fallbackReply = `**Fantastic decision!** 🚲 Active transit slashes direct transport emissions. Replacing a 10 km car trip by biking saves ~**1.9 kg CO₂e**. Keep it up!`;
    } else if (clean.includes("meat") || clean.includes("vegan") || clean.includes("vegetarian") || clean.includes("plant")) {
      fallbackReply = `**Excellent choice!** 🥗 Swapping beef for a plant-based option saves ~**3.2 kg CO₂e** per meal. Consistent habits like this make a huge annual difference!`;
    } else if (clean.includes("solar") || clean.includes("led") || clean.includes("thermostat") || clean.includes("heat")) {
      fallbackReply = `**Smart home move!** ⚡ Dropping your thermostat 1°C can cut heating emissions by ~10% annually. Small tweaks in home energy have outsized impacts.`;
    } else if (clean.includes("shop") || clean.includes("buy") || clean.includes("secondhand") || clean.includes("minimal")) {
      fallbackReply = `**Wonderful!** 🛍️ Choosing secondhand or delaying a purchase avoids 5–20 kg CO₂e per item in manufacturing emissions. Circular consumption is powerful!`;
    } else {
      fallbackReply = `I'm your **EcoStep Climate Coach** 🌿. Tell me about a green action you took today, or ask about the carbon impact of any habit — I'm here to help${prof ? ` (I know your profile: ${prof.location}, household of ${prof.householdSize})` : ""}.`;
    }
    return NextResponse.json({ reply: fallbackReply });
  }
}
