import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are Rapid Route+ AI — an expert travel intelligence system for India.
Given an origin and destination, analyze ALL possible travel modes and return a structured JSON response.

You MUST respond with ONLY valid JSON (no markdown, no explanation) in this exact format:
{
  "routes": [
    {
      "rank": 1,
      "medal": "🥇",
      "mode": "Train",
      "subMode": "Express/Superfast",
      "feasibility": "direct" | "indirect" | "not_available",
      "totalTime": "4h 30m",
      "estimatedCost": "₹300–₹1,200",
      "transfers": 0,
      "availability": "available" | "limited" | "not_available",
      "urgencyScore": 9,
      "steps": [
        { "instruction": "Take Shatabdi Express from Station A to Station B", "duration": "4h 30m" }
      ],
      "bookingPlatform": { "name": "IRCTC", "url": "https://www.irctc.co.in" },
      "pros": ["Fastest ground option", "Comfortable"],
      "cons": ["Advance booking needed"]
    }
  ],
  "bestForEmergency": {
    "mode": "Car",
    "reason": "Immediately available, no booking required",
    "fastestReachTime": "5h 15m"
  },
  "noRouteAlternative": null,
  "summary": "Brief 1-2 sentence recommendation"
}

Rules:
- Always include Train, Bus, Flight, and Car options when feasible
- For routes < 100km: prioritize Car and Bus; flights unlikely
- For routes 100-500km: all modes viable
- For routes > 500km: prioritize Flight and Train
- Use realistic Indian travel data (approximate times, costs in INR)
- If no direct route: suggest nearest hub city with step-by-step fallback
- For emergency mode: always highlight fastest option regardless of cost
- Rank by: 1st = Best overall, 2nd = Alternative, 3rd = Backup
- Set availability based on typical Indian transport patterns
- Consider time of day if mentioned`;

serve(async (req) => {
  if (req.method === "OPTIONS")
    return new Response(null, { headers: corsHeaders });

  try {
    // Auth guard — require a Bearer token to prevent anonymous AI credit abuse
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { from, to, mode } = await req.json();

    if (!from || !to) {
      return new Response(
        JSON.stringify({ error: "Origin and destination are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const userPrompt = mode === "emergency"
      ? `EMERGENCY MODE: I need to get from "${from}" to "${to}" as fast as possible. Prioritize speed over cost. Include hybrid routes (e.g., auto+train, car+flight). Highlight the FASTEST REACH TIME prominently.`
      : `LAST-MINUTE TRAVEL: I need to get from "${from}" to "${to}". Balance time, cost, and availability. Only suggest practical and bookable options.`;

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userPrompt },
          ],
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limited. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service unavailable" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Parse JSON from AI response (handle markdown code blocks)
    let parsed;
    try {
      const jsonStr = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(jsonStr);
    } catch {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI analysis", raw: content }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("route-intelligence error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
