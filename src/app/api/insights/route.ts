import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { rankSustainabilityActions } from "@/services/rankingEngine";

// Initialize Gemini SDK with key from environment variables
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

interface RateLimitInfo {
  count: number;
  resetTime: number;
}
const ipCache = new Map<string, RateLimitInfo>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // Increased to accommodate strict mode dev mounts

export async function POST(req: NextRequest) {
  // Hoist profile so the catch block can use it for local fallback
  // (req.body can only be consumed once — can't call req.json() again inside catch)
  let parsedProfile: Parameters<typeof rankSustainabilityActions>[0] | null = null;
  try {
    // 1. Basic Rate Limiting
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

    // 2. Parse Request Body
    const body = await req.json();
    const { profile, activities } = body;

    if (!profile) {
      return NextResponse.json(
        { error: "User profile context is required" },
        { status: 400 }
      );
    }

    // Store profile at outer scope for catch block fallback
    parsedProfile = profile;

    // 3. Smart local fallback if Gemini API Key is missing
    if (!genAI) {
      console.log("No GEMINI_API_KEY set. Falling back to local ranking engine.");
      const locallyRanked = rankSustainabilityActions(profile);
      // Grab top 3 ranked actions
      const recommendations = locallyRanked.slice(0, 3).map(action => ({
        ...action,
        reasoning: `Recommended by local Carbon Engine. This action targets your lifestyle in category: ${action.category} with a localized prioritization score of ${action.rankScore}.`
      }));

      return NextResponse.json({ recommendations });
    }

    // 4. Construct AI Prompt
    // Limit activities to avoid exceeding token limit (though negligible here)
    const limitedActivities = Array.isArray(activities) ? activities.slice(0, 10) : [];
    
    // Select a subset of sustainability actions list to give Gemini options (around 20 high relevance actions)
    const rankedActionsForAI = rankSustainabilityActions(profile).slice(0, 15);

    const prompt = `
You are a supportive, knowledgeable personal climate coach at EcoStep.
Analyze the user's carbon profile and recent actions.

User Profile:
- Location: ${profile.location}
- Household Size: ${profile.householdSize}
- Diet Type: ${profile.dietType}
- Transport Mode: ${profile.vehicleType}
- Weekly Car Distance: ${profile.carDistanceWeekly} km
- Annual Short Flights: ${profile.flightShortDuration}
- Annual Long Flights: ${profile.flightLongDuration}
- Home Electricity Grid: ${profile.electricitySource}
- Home Heating: ${profile.heatingSource}
- Shopping Style: ${profile.shoppingHabits}

Recent Activities Logged:
${JSON.stringify(limitedActivities)}

Your Task:
Recommend the top 3 personalized actions from the list below. Return a valid JSON object matching the schema below.
Do not output anything else. Your output must be parseable by JSON.parse.

Schema:
{
  "recommendations": [
    {
      "id": "action_id",
      "title": "Action Title",
      "description": "Action Description",
      "category": "food" | "travel" | "energy" | "shopping",
      "co2Savings": number,
      "difficulty": "easy" | "medium" | "hard",
      "costImpact": "saving" | "neutral" | "investment",
      "reasoning": "Write a 1-2 sentence hyper-personalized explanation of why this action is recommended specifically for their profile (e.g. referencing their driving miles, diet, or flights).",
      "implementationSteps": [
        "Step 1",
        "Step 2",
        "Step 3"
      ]
    }
  ]
}

Available actions to choose from (pick 3 that are highly relevant and make the most sense for the user):
${JSON.stringify(rankedActionsForAI)}
`;

    // 5. Query Gemini
    // gemini-2.0-flash-lite has a generous free-tier quota (1500 req/day)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
    const aiResult = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const aiResponseText = aiResult.response.text();
    const parsedData = JSON.parse(aiResponseText);

    if (parsedData && parsedData.recommendations) {
      return NextResponse.json(parsedData);
    } else {
      throw new Error("AI response structure is missing recommendations array");
    }

  } catch (err: unknown) {
    console.error("Gemini API Error:", err instanceof Error ? err.message : err);

    // On any API/quota/parsing error, fall back gracefully with a 200
    if (parsedProfile) {
      const locallyRanked = rankSustainabilityActions(parsedProfile);
      const recommendations = locallyRanked.slice(0, 3).map(action => ({
        ...action,
        reasoning: `Recommended by local Carbon Engine. Targets your ${action.category} footprint with a personalization score of ${action.rankScore}.`,
      }));
      return NextResponse.json({ recommendations });
    }

    // Ultimate fallback: empty list, still 200 so the UI doesn't break
    return NextResponse.json({ recommendations: [] });
  }
}
