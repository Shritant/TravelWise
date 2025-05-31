import OpenAI from "openai";
import type { CreateRecommendation, RecommendationResponse } from "@shared/schema";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY || "default_key"
});

export async function generateRecommendations(data: CreateRecommendation): Promise<RecommendationResponse> {
  try {
    const { itineraryText, interests, leisureTime } = data;
    
    // Extract location information from itinerary
    const locationPrompt = `
Analyze this travel itinerary and extract the primary destination/city:
"${itineraryText}"

Respond with just the city and country name (e.g., "Tokyo, Japan").
`;

    const locationResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: locationPrompt }],
      max_tokens: 20,
    });

    const destination = locationResponse.choices[0].message.content?.trim() || "the destination";

    // Generate comprehensive recommendations
    const recommendationsPrompt = `
You are a travel expert providing personalized recommendations for ${destination}.

ITINERARY DETAILS:
${itineraryText}

SELECTED INTERESTS:
${interests.join(", ")}

LEISURE TIME PREFERENCES:
${leisureTime ? `
- Daily free hours: ${leisureTime.dailyHours || "Not specified"}
- Preferred time: ${leisureTime.preferredTime || "Any time"}
- Travel style: ${leisureTime.travelStyle || "Flexible"}
` : "Not specified"}

Please provide recommendations in the following JSON format:

{
  "mustVisitPlaces": [
    {
      "name": "Place name",
      "description": "Brief compelling description (max 100 chars)",
      "duration": "Time needed (e.g., '2-3 hours')",
      "rating": 4.8,
      "category": "cultural/historical/scenic/etc"
    }
  ],
  "personalizedRecommendations": {
    "food": [
      {
        "name": "Restaurant/Food place name",
        "description": "Brief description highlighting what makes it special",
        "priceRange": "$/$$/$$$/$$$$",
        "matchReason": "Matches: [specific interest from user's selection]",
        "category": "restaurant/cafe/market/etc"
      }
    ],
    "culture": [
      {
        "name": "Cultural attraction name",
        "description": "What visitors can expect and why it's worthwhile",
        "duration": "Time needed",
        "matchReason": "Matches: [specific interest from user's selection]",
        "category": "museum/temple/gallery/etc"
      }
    ],
    "nature": [
      {
        "name": "Nature/outdoor activity name",
        "description": "What makes this natural attraction special",
        "duration": "Time needed",
        "matchReason": "Matches: [specific interest from user's selection]",
        "category": "park/garden/hiking/etc"
      }
    ],
    "shopping": [
      {
        "name": "Shopping/entertainment venue name",
        "description": "What type of experience this offers",
        "duration": "Time needed",
        "matchReason": "Matches: [specific interest from user's selection]",
        "category": "market/mall/theater/etc"
      }
    ]
  }
}

REQUIREMENTS:
1. Provide 3-5 must-visit places that are iconic to ${destination} regardless of user interests
2. For personalized recommendations, only include categories where the user selected related interests
3. Each personalized category should have 2-4 recommendations
4. All recommendations should be real places/establishments in ${destination}
5. Match leisure time constraints when possible
6. Ensure "matchReason" specifically references the user's selected interests
7. Use realistic ratings between 4.0-4.9 for must-visit places
8. Keep descriptions concise but compelling
9. Provide accurate duration estimates
10. Only include categories in personalizedRecommendations if user selected related interests

Respond with valid JSON only.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a travel advisor. Provide accurate recommendations in the exact JSON format requested."
        },
        {
          role: "user",
          content: recommendationsPrompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1500,
    });

    const recommendationsText = response.choices[0].message.content;
    if (!recommendationsText) {
      throw new Error("No recommendations generated");
    }

    let recommendations: RecommendationResponse;
    try {
      recommendations = JSON.parse(recommendationsText);
    } catch (parseError) {
      console.error("Failed to parse OpenAI response:", recommendationsText);
      throw new Error("Invalid response format from AI service");
    }

    // Validate the response structure
    if (!recommendations.mustVisitPlaces || !Array.isArray(recommendations.mustVisitPlaces)) {
      throw new Error("Invalid recommendations structure: missing mustVisitPlaces");
    }

    if (!recommendations.personalizedRecommendations || typeof recommendations.personalizedRecommendations !== 'object') {
      throw new Error("Invalid recommendations structure: missing personalizedRecommendations");
    }

    // Filter personalized recommendations based on user interests
    const filteredRecommendations: RecommendationResponse = {
      mustVisitPlaces: recommendations.mustVisitPlaces,
      personalizedRecommendations: {
        food: [],
        culture: [],
        nature: [],
        shopping: []
      }
    };

    // Map user interests to categories
    const foodInterests = ["Fine Dining", "Street Food", "Local Cuisine", "Cafes", "Food Markets"];
    const cultureInterests = ["Museums", "Historical Sites", "Architecture", "Art Galleries", "Cultural Events"];
    const natureInterests = ["Hiking", "Water Sports", "Parks & Gardens", "Scenic Views", "Wildlife"];
    const shoppingInterests = ["Shopping Malls", "Local Markets", "Nightlife", "Live Music", "Theaters"];

    const hasFood = interests.some(interest => foodInterests.includes(interest));
    const hasCulture = interests.some(interest => cultureInterests.includes(interest));
    const hasNature = interests.some(interest => natureInterests.includes(interest));
    const hasShopping = interests.some(interest => shoppingInterests.includes(interest));

    if (hasFood && recommendations.personalizedRecommendations.food) {
      filteredRecommendations.personalizedRecommendations.food = recommendations.personalizedRecommendations.food;
    }
    if (hasCulture && recommendations.personalizedRecommendations.culture) {
      filteredRecommendations.personalizedRecommendations.culture = recommendations.personalizedRecommendations.culture;
    }
    if (hasNature && recommendations.personalizedRecommendations.nature) {
      filteredRecommendations.personalizedRecommendations.nature = recommendations.personalizedRecommendations.nature;
    }
    if (hasShopping && recommendations.personalizedRecommendations.shopping) {
      filteredRecommendations.personalizedRecommendations.shopping = recommendations.personalizedRecommendations.shopping;
    }

    return filteredRecommendations;

  } catch (error) {
    console.error("OpenAI API error:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("OpenAI API key is invalid or missing. Please check your configuration.");
      }
      if (error.message.includes("quota")) {
        throw new Error("OpenAI API quota exceeded. Please check your usage limits.");
      }
      if (error.message.includes("rate limit")) {
        throw new Error("OpenAI API rate limit exceeded. Please try again in a moment.");
      }
      throw error;
    }
    
    throw new Error("Failed to generate recommendations. Please try again.");
  }
}
